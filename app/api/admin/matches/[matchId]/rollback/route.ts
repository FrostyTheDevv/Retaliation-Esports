import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"
import { createMatchHistory } from "@/lib/match-history"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await checkAdmin()
    const { matchId } = await params
    const body = await req.json()
    const { reason } = body

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status !== "completed") {
      return NextResponse.json({ error: "Only completed matches can be rolled back" }, { status: 400 })
    }

    if (!match.previousWinnerId && match.rollbackCount === 0) {
      // First rollback - store current winner
      await prisma.match.update({
        where: { id: matchId },
        data: {
          previousWinnerId: match.winnerId,
        },
      })
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: "live",
        team1Score: null,
        team2Score: null,
        winnerId: null,
        completedAt: null,
        rollbackCount: { increment: 1 },
      },
    })

    // Record history
    await createMatchHistory({
      matchId,
      action: "rolled_back",
      // @ts-ignore - Prisma client generation issue
      performedBy: session.user.id,
      performedByRole: "admin",
      previousState: {
        status: "completed",
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        winnerId: match.winnerId,
      },
      newState: {
        status: "live",
        team1Score: null,
        team2Score: null,
        winnerId: null,
      },
      reason: reason || "Match rolled back by admin",
    })

    return NextResponse.json(updatedMatch)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to rollback match" },
      { status: 500 }
    )
  }
}
