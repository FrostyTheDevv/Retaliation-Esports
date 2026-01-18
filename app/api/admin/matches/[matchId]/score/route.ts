import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"
import { advanceWinner } from "@/lib/brackets"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    await checkAdmin()
    const { matchId } = await params
    const body = await req.json()

    const { team1Score, team2Score } = body

    if (
      typeof team1Score !== "number" ||
      typeof team2Score !== "number" ||
      team1Score < 0 ||
      team2Score < 0
    ) {
      return NextResponse.json({ error: "Invalid scores" }, { status: 400 })
    }

    if (team1Score === team2Score) {
      return NextResponse.json(
        { error: "Scores cannot be tied" },
        { status: 400 }
      )
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    const winnerId = team1Score > team2Score ? match.team1Id : match.team2Id

    if (!winnerId) {
      return NextResponse.json(
        { error: "Cannot determine winner" },
        { status: 400 }
      )
    }

    await advanceWinner(matchId, winnerId, team1Score, team2Score)

    const updatedMatch = await prisma.match.findUnique({
      where: { id: matchId },
    })

    return NextResponse.json(updatedMatch)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update score" },
      { status: 500 }
    )
  }
}
