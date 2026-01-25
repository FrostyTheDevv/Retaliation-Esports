import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

// Replace a team in a match
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    await checkAdmin()
    const { matchId } = await params
    const body = await req.json()
    const { position, newTeamId } = body

    if (!position || !["team1", "team2"].includes(position)) {
      return NextResponse.json(
        { error: "Position must be 'team1' or 'team2'" },
        { status: 400 }
      )
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status === "completed") {
      return NextResponse.json(
        { error: "Cannot edit a completed match" },
        { status: 400 }
      )
    }

    // Update the specified team position
    const updateData: any = {}
    if (position === "team1") {
      updateData.team1Id = newTeamId || null
    } else {
      updateData.team2Id = newTeamId || null
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: updateData,
      include: {
        team1: true,
        team2: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Team updated successfully",
      match: updatedMatch,
    })
  } catch (error: any) {
    console.error("Replace team error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update team" },
      { status: 500 }
    )
  }
}
