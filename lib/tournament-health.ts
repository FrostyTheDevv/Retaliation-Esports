import { prisma } from "@/lib/prisma"

export interface TournamentHealth {
  tournamentId: string
  tournamentName: string
  status: "healthy" | "warning" | "critical"
  metrics: {
    totalMatches: number
    completedMatches: number
    liveMatches: number
    pendingMatches: number
    pausedMatches: number
    completionRate: number
    averageMatchDuration: number // in minutes
    onSchedule: boolean
    delayedMatches: number
  }
  teams: {
    totalTeams: number
    activeTeams: number
    onlineTeams: number
    bannedTeams: number
    teamsWithIssues: number
  }
  issues: {
    openIssues: number
    criticalIssues: number
    unresolvedIssues: number
    averageResolutionTime: number // in minutes
  }
  alerts: string[]
}

export async function getTournamentHealth(tournamentId: string): Promise<TournamentHealth | null> {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        matches: {
          include: {
            technicalIssues: true,
          },
        },
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
      return null
    }

    const alerts: string[] = []
    
    // Calculate match metrics
    const totalMatches = tournament.matches.length
    const completedMatches = tournament.matches.filter((m: any) => m.status === "completed").length
    const liveMatches = tournament.matches.filter((m: any) => m.status === "live").length
    const pendingMatches = tournament.matches.filter((m: any) => m.status === "pending").length
    const pausedMatches = tournament.matches.filter((m: any) => m.pausedAt !== null).length
    const completionRate = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0

    // Calculate average match duration
    const completedMatchesWithTimes = tournament.matches.filter(
      (m: any) => m.status === "completed" && m.startedAt && m.completedAt
    )
    const totalDuration = completedMatchesWithTimes.reduce((acc: number, m: any) => {
      const duration = m.completedAt.getTime() - m.startedAt.getTime()
      return acc + duration
    }, 0)
    const averageMatchDuration = completedMatchesWithTimes.length > 0
      ? totalDuration / completedMatchesWithTimes.length / 60000
      : 0

    // Check if on schedule
    const now = new Date()
    const delayedMatches = tournament.matches.filter((m: any) => {
      return m.scheduledAt && m.scheduledAt < now && m.status === "pending"
    }).length

    const onSchedule = delayedMatches === 0

    // Team metrics
    const totalTeams = tournament.signups.length
    const activeTeams = tournament.signups.filter((s: any) => s.status === "approved").length
    const onlineTeams = tournament.signups.filter(
      (s: any) => s.team?.teamStatus?.status === "online" || s.team?.teamStatus?.status === "ready"
    ).length
    const bannedTeams = tournament.signups.filter(
      (s: any) => s.team?.teamStatus?.isBanned
    ).length
    const teamsWithIssues = tournament.signups.filter(
      (s: any) => s.team?.teamStatus?.warningCount > 0 || s.team?.teamStatus?.noShowCount > 0
    ).length

    // Issue metrics
    const allIssues = tournament.matches.flatMap((m: any) => m.technicalIssues)
    const openIssues = allIssues.filter((i: any) => i.status === "open" || i.status === "investigating").length
    const criticalIssues = allIssues.filter((i: any) => i.severity === "critical" && i.status !== "closed").length
    const unresolvedIssues = allIssues.filter((i: any) => i.status !== "resolved" && i.status !== "closed").length

    // Calculate average resolution time
    const resolvedIssues = allIssues.filter((i: any) => i.resolvedAt)
    const totalResolutionTime = resolvedIssues.reduce((acc: number, i: any) => {
      const duration = i.resolvedAt.getTime() - i.createdAt.getTime()
      return acc + duration
    }, 0)
    const averageResolutionTime = resolvedIssues.length > 0
      ? totalResolutionTime / resolvedIssues.length / 60000
      : 0

    // Generate alerts
    if (delayedMatches > 0) {
      alerts.push(`${delayedMatches} match(es) behind schedule`)
    }
    if (pausedMatches > 0) {
      alerts.push(`${pausedMatches} match(es) currently paused`)
    }
    if (criticalIssues > 0) {
      alerts.push(`${criticalIssues} critical technical issue(s) pending`)
    }
    if (bannedTeams > 0) {
      alerts.push(`${bannedTeams} team(s) currently banned`)
    }
    if (liveMatches > 5) {
      alerts.push(`High concurrent matches: ${liveMatches}`)
    }
    if (completionRate < 50 && totalMatches > 10) {
      alerts.push(`Low completion rate: ${completionRate.toFixed(1)}%`)
    }

    // Determine overall health status
    let status: "healthy" | "warning" | "critical" = "healthy"
    if (criticalIssues > 0 || delayedMatches > 5 || pausedMatches > 3) {
      status = "critical"
    } else if (alerts.length > 2 || unresolvedIssues > 5 || delayedMatches > 0) {
      status = "warning"
    }

    return {
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      status,
      metrics: {
        totalMatches,
        completedMatches,
        liveMatches,
        pendingMatches,
        pausedMatches,
        completionRate,
        averageMatchDuration,
        onSchedule,
        delayedMatches,
      },
      teams: {
        totalTeams,
        activeTeams,
        onlineTeams,
        bannedTeams,
        teamsWithIssues,
      },
      issues: {
        openIssues,
        criticalIssues,
        unresolvedIssues,
        averageResolutionTime,
      },
      alerts,
    }
  } catch (error) {
    console.error("Failed to get tournament health:", error)
    return null
  }
}

export async function getAllTournamentsHealth(): Promise<TournamentHealth[]> {
  try {
    const tournaments = await prisma.tournament.findMany({
      where: {
        status: { in: ["upcoming", "live"] },
      },
    })

    const healthData = await Promise.all(
      tournaments.map((t: any) => getTournamentHealth(t.id))
    )

    return healthData.filter((h: any): h is TournamentHealth => h !== null)
  } catch (error) {
    console.error("Failed to get all tournaments health:", error)
    return []
  }
}
