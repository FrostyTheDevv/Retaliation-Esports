import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createNotification } from "@/lib/notifications"
import { createMatchHistory } from "@/lib/match-history"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const session = await auth()
    // @ts-ignore - Prisma client generation issue
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { issueId } = await params
    const body = await req.json()
    const { status, assignedTo, resolution, requiresRematch } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const validStatuses = ["open", "investigating", "resolved", "closed"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const issue = await prisma.technicalIssue.findUnique({
      where: { id: issueId },
      include: {
        match: {
          include: {
            team1: true,
            team2: true,
            tournament: true,
          },
        },
      },
    })

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    const updated = await prisma.technicalIssue.update({
      where: { id: issueId },
      data: {
        status,
        assignedTo: assignedTo || issue.assignedTo,
        resolution: resolution || issue.resolution,
        requiresRematch: requiresRematch !== undefined ? requiresRematch : issue.requiresRematch,
        resolvedAt: status === "resolved" || status === "closed" ? new Date() : null,
      },
    })

    // If issue is resolved and match was paused, unpause it
    if ((status === "resolved" || status === "closed") && issue.matchPaused) {
      await prisma.match.update({
        where: { id: issue.matchId },
        data: {
          pausedAt: null,
          pauseReason: null,
          status: "live",
        },
      })

      await createMatchHistory({
        matchId: issue.matchId,
        action: "resumed",
        // @ts-ignore - Prisma client generation issue
        performedBy: session.user.id,
        performedByRole: "admin",
        previousState: { status: "paused", pauseReason: issue.match.pauseReason },
        newState: { status: "live" },
        reason: `Technical issue ${issue.id} resolved`,
      })

      await createNotification({
        recipientType: "team",
        recipientId: issue.reportedByTeamId,
        type: "issue_resolved",
        title: "Technical Issue Resolved",
        message: `Your technical issue for Match ${issue.match.matchNumber} has been resolved. The match has been resumed.`,
        priority: "normal",
        tournamentId: issue.match.tournamentId,
        matchId: issue.matchId,
      })
    }

    // Notify team of status change
    await createNotification({
      recipientType: "team",
      recipientId: issue.reportedByTeamId,
      type: "issue_update",
      title: "Technical Issue Update",
      message: `Status of your technical issue for Match ${issue.match.matchNumber} has been updated to: ${status}`,
      priority: "normal",
      tournamentId: issue.match.tournamentId,
      matchId: issue.matchId,
    })

    if (requiresRematch) {
      await createNotification({
        recipientType: "admin",
        type: "rematch_required",
        title: "Rematch Required",
        message: `Match ${issue.match.matchNumber} requires a rematch due to technical issue ${issue.id}`,
        priority: "high",
        tournamentId: issue.match.tournamentId,
        matchId: issue.matchId,
      })
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Failed to update issue:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update issue" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { issueId } = await params

    const issue = await prisma.technicalIssue.findUnique({
      where: { id: issueId },
      include: {
        match: {
          include: {
            team1: true,
            team2: true,
            tournament: true,
          },
        },
      },
    })

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    // Non-admin users can only see their own team's issues
    // @ts-ignore - Prisma client generation issue
    if (session.user.role !== "admin") {
      // @ts-ignore - Prisma client generation issue
      if (issue.reportedByTeamId !== session.user.teamId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    return NextResponse.json(issue)
  } catch (error: any) {
    console.error("Failed to get issue:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get issue" },
      { status: 500 }
    )
  }
}
