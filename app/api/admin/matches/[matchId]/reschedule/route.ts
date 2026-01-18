import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createNotification } from "@/lib/notifications"
import { createMatchHistory } from "@/lib/match-history"
import { isTimeConflict } from "@/lib/timezone"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth()
    // @ts-ignore - Prisma client generation issue
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId } = await params
    const body = await req.json()
    const { scheduledAt } = body

    if (!scheduledAt) {
      return NextResponse.json({ error: "scheduledAt is required" }, { status: 400 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        team1: true,
        team2: true,
        tournament: true,
      },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    const newScheduledAt = new Date(scheduledAt)

    // Check for timezone conflicts if teams have timezone set
    if (match.team1?.timezone && match.team2?.timezone) {
      const conflict = isTimeConflict(
        newScheduledAt,
        match.team1.timezone,
        match.team2.timezone
      )

      if (conflict.conflict) {
        return NextResponse.json(
          {
            error: "Timezone conflict detected",
            details: conflict.reason,
            team1Local: conflict.team1Local,
            team2Local: conflict.team2Local,
          },
          { status: 400 }
        )
      }
    }

    // Check for overlapping matches for both teams
    const overlappingMatches = await prisma.match.findMany({
      where: {
        OR: [
          { team1Id: match.team1Id },
          { team2Id: match.team1Id },
          { team1Id: match.team2Id },
          { team2Id: match.team2Id },
        ],
        status: { in: ["pending", "ready", "live"] },
        scheduledAt: {
          gte: new Date(newScheduledAt.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
          lte: new Date(newScheduledAt.getTime() + 2 * 60 * 60 * 1000), // 2 hours after
        },
        id: { not: matchId },
      },
    })

    if (overlappingMatches.length > 0) {
      return NextResponse.json(
        {
          error: "Schedule conflict detected",
          details: `One or both teams have matches scheduled within 2 hours of this time`,
          overlappingMatches: overlappingMatches.map((m: any) => ({
            id: m.id,
            matchNumber: m.matchNumber,
            scheduledAt: m.scheduledAt,
          })),
        },
        { status: 400 }
      )
    }

    const previousState = {
      scheduledAt: match.scheduledAt,
    }

    const updated = await prisma.match.update({
      where: { id: matchId },
      data: {
        scheduledAt: newScheduledAt,
        // Set check-in deadline to 15 minutes before match
        checkInDeadline: new Date(newScheduledAt.getTime() - 15 * 60 * 1000),
      },
      include: {
        team1: true,
        team2: true,
        tournament: true,
      },
    })

    await createMatchHistory({
      matchId,
      action: "status_changed",
      // @ts-ignore - Prisma client generation issue
      performedBy: session.user.id,
      performedByRole: "admin",
      previousState,
      newState: { scheduledAt: newScheduledAt },
      reason: "Match rescheduled by admin",
    })

    // Notify both teams
    if (match.team1Id) {
      await createNotification({
        recipientType: "team",
        recipientId: match.team1Id,
        type: "match_rescheduled",
        title: "Match Rescheduled",
        message: `Match ${match.matchNumber} has been rescheduled to ${newScheduledAt.toLocaleString()}`,
        priority: "high",
        tournamentId: match.tournamentId,
        matchId: match.id,
      })
    }

    if (match.team2Id) {
      await createNotification({
        recipientType: "team",
        recipientId: match.team2Id,
        type: "match_rescheduled",
        title: "Match Rescheduled",
        message: `Match ${match.matchNumber} has been rescheduled to ${newScheduledAt.toLocaleString()}`,
        priority: "high",
        tournamentId: match.tournamentId,
        matchId: match.id,
      })
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Failed to reschedule match:", error)
    return NextResponse.json(
      { error: error.message || "Failed to reschedule match" },
      { status: 500 }
    )
  }
}
