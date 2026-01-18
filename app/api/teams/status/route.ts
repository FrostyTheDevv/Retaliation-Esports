import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { teamId, status, currentMatchId } = body

    if (!teamId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["offline", "online", "ready", "in_match", "away"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update or create team status
    const teamStatus = await prisma.teamStatus.upsert({
      where: { teamId },
      create: {
        teamId,
        status,
        currentMatchId: currentMatchId || null,
        lastSeenAt: new Date(),
      },
      update: {
        status,
        currentMatchId: currentMatchId || null,
        lastSeenAt: new Date(),
      },
    })

    return NextResponse.json(teamStatus)
  } catch (error: any) {
    console.error("Failed to update team status:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update team status" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId")
    const tournamentId = searchParams.get("tournamentId")

    if (teamId) {
      // Get specific team status
      const teamStatus = await prisma.teamStatus.findUnique({
        where: { teamId },
        include: { team: true },
      })

      return NextResponse.json(teamStatus)
    }

    if (tournamentId) {
      // Get all team statuses for tournament
      const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: {
          signups: {
            include: {
              team: {
                include: {
                  teamStatus: true,
                },
              },
            },
          },
        },
      })

      if (!tournament) {
        return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
      }

      const teamStatuses = tournament.signups
        .filter((s: any) => s.team?.teamStatus)
        .map((s: any) => ({
          ...s.team.teamStatus,
          teamName: s.team.name,
        }))

      return NextResponse.json(teamStatuses)
    }

    return NextResponse.json({ error: "teamId or tournamentId required" }, { status: 400 })
  } catch (error: any) {
    console.error("Failed to get team status:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get team status" },
      { status: 500 }
    )
  }
}
