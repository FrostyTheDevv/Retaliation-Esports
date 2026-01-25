import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

// Swap teams in a match
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    await checkAdmin()
    const { matchId } = await params

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status === "completed") {
      return NextResponse.json(
        { error: "Cannot swap teams in a completed match" },
        { status: 400 }
      )
    }

    // Swap team1 and team2
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        team1Id: match.team2Id,
        team2Id: match.team1Id,
      },
      include: {
        team1: true,
        team2: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Teams swapped successfully",
      match: updatedMatch,
    })
  } catch (error: any) {
    console.error("Swap teams error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to swap teams" },
      { status: 500 }
    )
  }
}
