import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"
import { advanceWinner } from "@/lib/brackets"

// Disqualify a team from a match
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    await checkAdmin()
    const { matchId } = await params
    const body = await req.json()
    const { teamId, reason } = body

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      )
    }

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

    if (match.status === "completed") {
      return NextResponse.json(
        { error: "Match is already completed" },
        { status: 400 }
      )
    }

    // Determine which team is being disqualified
    const isTeam1 = match.team1Id === teamId
    const isTeam2 = match.team2Id === teamId

    if (!isTeam1 && !isTeam2) {
      return NextResponse.json(
        { error: "Team is not part of this match" },
        { status: 400 }
      )
    }

    // The other team wins by DQ
    const winnerId = isTeam1 ? match.team2Id : match.team1Id
    const winnerScore = 1
    const loserScore = 0

    if (!winnerId) {
      return NextResponse.json(
        { error: "Cannot determine winner - other team slot is empty" },
        { status: 400 }
      )
    }

    // Get winner name before update
    const winnerName = winnerId === match.team1Id ? match.team1?.name : match.team2?.name
    const disqualifiedTeamName = isTeam1 ? match.team1?.name : match.team2?.name

    // First add the DQ note
    await prisma.match.update({
      where: { id: matchId },
      data: {
        notes: `Team ${disqualifiedTeamName} disqualified. Reason: ${reason || "No reason provided"}`,
      },
    })

    // Use advanceWinner to properly update match and advance to next round
    await advanceWinner(
      matchId,
      winnerId,
      isTeam1 ? loserScore : winnerScore,
      isTeam2 ? loserScore : winnerScore
    )

    // Fetch the updated match
    const updatedMatch = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        team1: true,
        team2: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Team disqualified. ${winnerName} advances.`,
      match: updatedMatch,
    })
  } catch (error: any) {
    console.error("Disqualify error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to disqualify team" },
      { status: 500 }
    )
  }
}
