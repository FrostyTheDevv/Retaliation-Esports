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

    if (match.status !== "live") {
      return NextResponse.json({ error: "Only live matches can be paused" }, { status: 400 })
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: "paused",
        pausedAt: new Date(),
        pauseReason: reason || "Paused by admin",
      },
    })

    // Record history
    await createMatchHistory({
      matchId,
      action: "paused",
      // @ts-ignore - Prisma client generation issue
      performedBy: session.user.id,
      performedByRole: "admin",
      previousState: { status: "live" },
      newState: { status: "paused", pausedAt: updatedMatch.pausedAt, pauseReason: updatedMatch.pauseReason },
      reason: reason || "Paused by admin",
    })

    return NextResponse.json(updatedMatch)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to pause match" },
      { status: 500 }
    )
  }
}
