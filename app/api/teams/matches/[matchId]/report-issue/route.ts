import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
// @ts-ignore - TypeScript cache issue
import { createNotification } from "@/lib/notifications"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId } = await params
    const body = await req.json()
    const { teamId, issueType, description, severity } = body

    // Validate input
    if (!teamId || !issueType || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify match exists and team is participating
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        team1: true,
        team2: true,
        tournament: true,
      },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.team1Id !== teamId && match.team2Id !== teamId) {
      return NextResponse.json({ error: "Not authorized for this match" }, { status: 403 })
    }

    // Create technical issue
    const issue = await prisma.technicalIssue.create({
      data: {
        matchId,
        reportedByTeamId: teamId,
        issueType,
        description,
        severity: severity || "medium",
      },
    })

    // Notify admins based on severity
    const priority = severity === "critical" ? "urgent" : severity === "high" ? "high" : "normal"
    
    await createNotification({
      recipientType: "admin",
      type: "issue_reported",
      title: `${severity?.toUpperCase() || "MEDIUM"} Technical Issue Reported`,
      message: `${match.team1Id === teamId ? match.team1?.name : match.team2?.name} reported a ${issueType} issue in Match ${match.matchNumber} of ${match.tournament.name}`,
      priority,
      tournamentId: match.tournamentId,
      matchId: match.id,
      relatedUrl: `/admin/tournaments/${match.tournamentId}/issues/${issue.id}`,
    })

    // Auto-pause match if critical
    if (severity === "critical") {
      await prisma.match.update({
        where: { id: matchId },
        data: {
          status: "paused",
          pausedAt: new Date(),
          pauseReason: `Critical technical issue reported: ${issueType}`,
        },
      })

      await prisma.technicalIssue.update({
        where: { id: issue.id },
        data: { matchPaused: true },
      })
    }

    return NextResponse.json(issue)
  } catch (error: any) {
    console.error("Failed to report issue:", error)
    return NextResponse.json(
      { error: error.message || "Failed to report issue" },
      { status: 500 }
    )
  }
}
