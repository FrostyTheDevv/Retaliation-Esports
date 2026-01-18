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
    const { teamId, reason } = body

    if (!teamId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get match
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

    // Verify team is in match
    if (match.team1Id !== teamId && match.team2Id !== teamId) {
      return NextResponse.json({ error: "Not authorized for this match" }, { status: 403 })
    }

    // Check if already requested
    if (match.postponementRequested) {
      return NextResponse.json({ error: "Postponement already requested" }, { status: 400 })
    }

    // Update match
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        postponementRequested: true,
        postponementReason: reason,
        postponementRequestedBy: teamId,
      },
    })

    // Notify admins
    const requestingTeam = match.team1Id === teamId ? match.team1?.name : match.team2?.name
    
    await createNotification({
      recipientType: "admin",
      type: "postponement_requested",
      title: "Match Postponement Requested",
      message: `${requestingTeam} has requested to postpone Match ${match.matchNumber} in ${match.tournament.name}. Reason: ${reason}`,
      priority: "high",
      tournamentId: match.tournamentId,
      matchId: match.id,
      relatedUrl: `/admin/tournaments/${match.tournamentId}/monitor`,
    })

    // Notify opponent team
    const opponentTeamId = match.team1Id === teamId ? match.team2Id : match.team1Id
    if (opponentTeamId) {
      await createNotification({
        recipientType: "team",
        recipientId: opponentTeamId,
        type: "postponement_requested",
        title: "Opponent Requested Postponement",
        message: `Your opponent has requested to postpone Match ${match.matchNumber}. An admin will review the request.`,
        priority: "normal",
        tournamentId: match.tournamentId,
        matchId: match.id,
      })
    }

    return NextResponse.json(updatedMatch)
  } catch (error: any) {
    console.error("Failed to request postponement:", error)
    return NextResponse.json(
      { error: error.message || "Failed to request postponement" },
      { status: 500 }
    )
  }
}
