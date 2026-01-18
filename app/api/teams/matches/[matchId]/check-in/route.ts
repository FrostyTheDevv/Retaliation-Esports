import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth()
    // @ts-ignore - Prisma client generation issue
    if (!session?.user?.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId } = await params

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        team1: true,
        team2: true,
      },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    // Verify team is in this match
    // @ts-ignore - Prisma client generation issue
    if (match.team1Id !== session.user.teamId && match.team2Id !== session.user.teamId) {
      return NextResponse.json({ error: "Not authorized for this match" }, { status: 403 })
    }

    // Check if already checked in
    // @ts-ignore - Prisma client generation issue
    const isTeam1 = match.team1Id === session.user.teamId
    if (isTeam1 && match.team1CheckedIn) {
      return NextResponse.json({ error: "Already checked in" }, { status: 400 })
    }
    if (!isTeam1 && match.team2CheckedIn) {
      return NextResponse.json({ error: "Already checked in" }, { status: 400 })
    }

    // Update check-in status
    const updated = await prisma.match.update({
      where: { id: matchId },
      data: isTeam1
        ? { team1CheckedIn: true, team1CheckInTime: new Date() }
        : { team2CheckedIn: true, team2CheckInTime: new Date() },
      include: {
        team1: true,
        team2: true,
      },
    })

    // Update team status to "ready"
    // @ts-ignore - Prisma client generation issue
    await prisma.teamStatus.upsert({
      // @ts-ignore - Prisma client generation issue
      where: { teamId: session.user.teamId },
      create: {
        // @ts-ignore - Prisma client generation issue
        teamId: session.user.teamId,
        status: "ready",
        currentMatchId: matchId,
        lastSeenAt: new Date(),
      },
      update: {
        status: "ready",
        currentMatchId: matchId,
        lastSeenAt: new Date(),
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Failed to check in:", error)
    return NextResponse.json(
      { error: error.message || "Failed to check in" },
      { status: 500 }
    )
  }
}
