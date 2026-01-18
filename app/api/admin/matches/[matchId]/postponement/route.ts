import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createNotification } from "@/lib/notifications"
import { createMatchHistory } from "@/lib/match-history"

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
    const { approved, reason } = body

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

    if (!match.postponementRequested) {
      return NextResponse.json({ error: "No postponement request pending" }, { status: 400 })
    }

    if (approved) {
      await prisma.match.update({
        where: { id: matchId },
        data: {
          postponementApproved: true,
          status: "pending", // Reset to pending for rescheduling
        },
      })

      await createMatchHistory({
        matchId,
        action: "status_changed",
        // @ts-ignore - Prisma client generation issue
        performedBy: session.user.id,
        performedByRole: "admin",
        previousState: { status: match.status },
        newState: { status: "pending", postponementApproved: true },
        reason: `Postponement approved: ${reason || "No reason provided"}`,
      })

      // Notify requesting team
      if (match.postponementRequestedBy) {
        await createNotification({
          recipientType: "team",
          recipientId: match.postponementRequestedBy,
          type: "postponement_approved",
          title: "Postponement Approved",
          message: `Your postponement request for Match ${match.matchNumber} has been approved. ${reason || ""}`,
          priority: "high",
          tournamentId: match.tournamentId,
          matchId: match.id,
        })
      }

      // Notify opponent
      const opponentId = match.postponementRequestedBy === match.team1Id ? match.team2Id : match.team1Id
      if (opponentId) {
        await createNotification({
          recipientType: "team",
          recipientId: opponentId,
          type: "match_postponed",
          title: "Match Postponed",
          message: `Match ${match.matchNumber} has been postponed. You will be notified of the new schedule.`,
          priority: "high",
          tournamentId: match.tournamentId,
          matchId: match.id,
        })
      }
    } else {
      // Deny postponement
      await prisma.match.update({
        where: { id: matchId },
        data: {
          postponementRequested: false,
          postponementApproved: false,
          postponementReason: null,
          postponementRequestedBy: null,
        },
      })

      await createMatchHistory({
        matchId,
        action: "status_changed",
        // @ts-ignore - Prisma client generation issue
        performedBy: session.user.id,
        performedByRole: "admin",
        previousState: { postponementRequested: true },
        newState: { postponementRequested: false },
        reason: `Postponement denied: ${reason || "No reason provided"}`,
      })

      // Notify requesting team
      if (match.postponementRequestedBy) {
        await createNotification({
          recipientType: "team",
          recipientId: match.postponementRequestedBy,
          type: "postponement_denied",
          title: "Postponement Request Denied",
          message: `Your postponement request for Match ${match.matchNumber} has been denied. ${reason || ""}`,
          priority: "high",
          tournamentId: match.tournamentId,
          matchId: match.id,
        })
      }
    }

    const updated = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        team1: true,
        team2: true,
        tournament: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Failed to handle postponement:", error)
    return NextResponse.json(
      { error: error.message || "Failed to handle postponement" },
      { status: 500 }
    )
  }
}
