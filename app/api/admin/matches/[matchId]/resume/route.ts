import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"
// @ts-ignore - TypeScript cache issue
import { createMatchHistory } from "@/lib/match-history"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await checkAdmin()
    const { matchId } = await params

    if (!session.user.id) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status !== "paused") {
      return NextResponse.json({ error: "Match is not paused" }, { status: 400 })
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: "live",
        pausedAt: null,
        pauseReason: null,
      },
    })

    // Record history
    await createMatchHistory({
      matchId,
      action: "resumed",
      performedBy: session.user.id,
      performedByRole: "admin",
      previousState: { status: "paused", pausedAt: match.pausedAt, pauseReason: match.pauseReason },
      newState: { status: "live" },
      reason: "Match resumed by admin",
    })

    return NextResponse.json(updatedMatch)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to resume match" },
      { status: 500 }
    )
  }
}
