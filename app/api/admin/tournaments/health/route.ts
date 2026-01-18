import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { getTournamentHealth, getAllTournamentsHealth } from "@/lib/tournament-health"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    // @ts-ignore - Prisma client generation issue
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tournamentId = searchParams.get("tournamentId")

    if (tournamentId) {
      const health = await getTournamentHealth(tournamentId)
      if (!health) {
        return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
      }
      return NextResponse.json(health)
    }

    // Get health for all active tournaments
    const healthData = await getAllTournamentsHealth()
    return NextResponse.json(healthData)
  } catch (error: any) {
    console.error("Failed to get tournament health:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get tournament health" },
      { status: 500 }
    )
  }
}
