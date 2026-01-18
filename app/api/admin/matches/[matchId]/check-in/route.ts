import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    await checkAdmin()
    const { matchId } = await params
    const body = await req.json()

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    const updateData: any = { checkInTime: new Date() }

    if (body.teamId === match.team1Id) {
      updateData.team1CheckedIn = true
    } else if (body.teamId === match.team2Id) {
      updateData.team2CheckedIn = true
    } else {
      return NextResponse.json({ error: "Invalid team" }, { status: 400 })
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: updateData,
    })

    // If both teams checked in, mark as ready
    if (updatedMatch.team1CheckedIn && updatedMatch.team2CheckedIn) {
      await prisma.match.update({
        where: { id: matchId },
        data: { status: "ready" },
      })
    }

    return NextResponse.json(updatedMatch)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to check in" },
      { status: 500 }
    )
  }
}
