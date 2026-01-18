import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"

interface CheckInResult {
  hasNoShows: boolean
  team1NoShow: boolean
  team2NoShow: boolean
  disqualifiedTeams: string[]
}

/**
 * Check for no-shows and auto-disqualify teams
 */
export async function checkForNoShows(matchId: string): Promise<CheckInResult> {
  const result: CheckInResult = {
    hasNoShows: false,
    team1NoShow: false,
    team2NoShow: false,
    disqualifiedTeams: [],
  }

  try {
    const match: any = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        team1: true,
        team2: true,
        tournament: true,
      },
    })

    if (!match || !match.checkInDeadline) {
      return result
    }

    const now = new Date()
    
    // Check if deadline passed
    if (now < match.checkInDeadline) {
      return result
    }

    // Check team1 no-show
    if (match.team1Id && !match.team1CheckedIn && !match.team1NoShow) {
      result.team1NoShow = true
      result.hasNoShows = true
      result.disqualifiedTeams.push(match.team1Id)

      await prisma.match.update({
        where: { id: matchId },
        data: {
          team1NoShow: true,
          winnerId: match.team2Id, // Award win to team2
          status: "completed",
          completedAt: new Date(),
        },
      })

      // Update team status - increment no-show count
      await prisma.teamStatus.upsert({
        where: { teamId: match.team1Id },
        create: {
          teamId: match.team1Id,
          noShowCount: 1,
          warningCount: 1,
          status: "offline",
        },
        update: {
          noShowCount: { increment: 1 },
          warningCount: { increment: 1 },
        },
      })

      // Check if team should be banned (3+ no-shows)
      const teamStatus = await prisma.teamStatus.findUnique({
        where: { teamId: match.team1Id },
      })

      if (teamStatus && teamStatus.noShowCount >= 3) {
        await prisma.teamStatus.update({
          where: { teamId: match.team1Id },
          data: {
            isBanned: true,
            banReason: "Multiple no-shows (3+)",
            bannedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        })

        await createNotification({
          recipientType: "admin",
          type: "team_banned",
          title: "Team Auto-Banned",
          message: `${match.team1?.name} has been automatically banned for 30 days due to multiple no-shows (${teamStatus.noShowCount + 1} total)`,
          priority: "high",
          tournamentId: match.tournamentId,
        })
      }

      // Notify admins and teams
      await createNotification({
        recipientType: "admin",
        type: "no_show_detected",
        title: "No-Show Detected",
        message: `${match.team1?.name} did not check in for Match ${match.matchNumber}. Team2 awarded win.`,
        priority: "normal",
        tournamentId: match.tournamentId,
        matchId: match.id,
      })

      if (match.team2Id) {
        await createNotification({
          recipientType: "team",
          recipientId: match.team2Id,
          type: "opponent_no_show",
          title: "Opponent No-Show - Win Awarded",
          message: `Your opponent did not check in for Match ${match.matchNumber}. You have been awarded the win.`,
          priority: "normal",
          tournamentId: match.tournamentId,
          matchId: match.id,
        })
      }
    }

    // Check team2 no-show
    if (match.team2Id && !match.team2CheckedIn && !match.team2NoShow) {
      result.team2NoShow = true
      result.hasNoShows = true
      result.disqualifiedTeams.push(match.team2Id)

      await prisma.match.update({
        where: { id: matchId },
        data: {
          team2NoShow: true,
          winnerId: match.team1Id, // Award win to team1
          status: "completed",
          completedAt: new Date(),
        },
      })

      // Update team status
      await prisma.teamStatus.upsert({
        where: { teamId: match.team2Id },
        create: {
          teamId: match.team2Id,
          noShowCount: 1,
          warningCount: 1,
          status: "offline",
        },
        update: {
          noShowCount: { increment: 1 },
          warningCount: { increment: 1 },
        },
      })

      const teamStatus = await prisma.teamStatus.findUnique({
        where: { teamId: match.team2Id },
      })

      if (teamStatus && teamStatus.noShowCount >= 3) {
        await prisma.teamStatus.update({
          where: { teamId: match.team2Id },
          data: {
            isBanned: true,
            banReason: "Multiple no-shows (3+)",
            bannedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })

        await createNotification({
          recipientType: "admin",
          type: "team_banned",
          title: "Team Auto-Banned",
          message: `${match.team2?.name} has been automatically banned for 30 days due to multiple no-shows (${teamStatus.noShowCount + 1} total)`,
          priority: "high",
          tournamentId: match.tournamentId,
        })
      }

      await createNotification({
        recipientType: "admin",
        type: "no_show_detected",
        title: "No-Show Detected",
        message: `${match.team2?.name} did not check in for Match ${match.matchNumber}. Team1 awarded win.`,
        priority: "normal",
        tournamentId: match.tournamentId,
        matchId: match.id,
      })

      if (match.team1Id) {
        await createNotification({
          recipientType: "team",
          recipientId: match.team1Id,
          type: "opponent_no_show",
          title: "Opponent No-Show - Win Awarded",
          message: `Your opponent did not check in for Match ${match.matchNumber}. You have been awarded the win.`,
          priority: "normal",
          tournamentId: match.tournamentId,
          matchId: match.id,
        })
      }
    }

    return result
  } catch (error) {
    console.error("Failed to check for no-shows:", error)
    return result
  }
}

/**
 * Set check-in deadline for a match (typically 15 minutes before scheduled time)
 */
export async function setCheckInDeadline(matchId: string, minutesBeforeMatch = 15) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match || !match.scheduledAt) {
      return null
    }

    const deadline = new Date(match.scheduledAt.getTime() - minutesBeforeMatch * 60 * 1000)

    return await prisma.match.update({
      where: { id: matchId },
      data: { checkInDeadline: deadline },
    })
  } catch (error) {
    console.error("Failed to set check-in deadline:", error)
    return null
  }
}

/**
 * Run no-show check for all matches in a tournament
 */
export async function runNoShowCheckForTournament(tournamentId: string) {
  try {
    const matches = await prisma.match.findMany({
      where: {
        tournamentId,
        status: { in: ["pending", "ready"] },
        checkInDeadline: {
          lte: new Date(),
        },
      },
    })

    const results = []
    for (const match of matches) {
      const result = await checkForNoShows(match.id)
      if (result.hasNoShows) {
        results.push({ matchId: match.id, ...result })
      }
    }

    return results
  } catch (error) {
    console.error("Failed to run no-show check:", error)
    return []
  }
}
