import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tournamentId: string; matchId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId } = await params
    const body = await req.json()

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    const dispute = await prisma.dispute.create({
      data: {
        matchId,
        reportedByTeamId: body.reportedByTeamId,
        category: body.category,
        description: body.description,
        evidence: body.evidence || [],
        originalTeam1Score: match.team1Score,
        originalTeam2Score: match.team2Score,
        originalWinnerId: match.winnerId,
      },
    })

    // Update match status
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "disputed" },
    })

    return NextResponse.json(dispute)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create dispute" },
      { status: 500 }
    )
  }
}
