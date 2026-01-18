import { prisma } from "@/lib/prisma"

interface CreateMatchHistoryParams {
  matchId: string
  action: string
  performedBy: string
  performedByRole: "admin" | "team_captain"
  previousState?: any
  newState?: any
  reason?: string
}

export async function createMatchHistory(params: CreateMatchHistoryParams) {
  try {
    return await prisma.matchHistory.create({
      data: {
        matchId: params.matchId,
        action: params.action,
        performedBy: params.performedBy,
        performedByRole: params.performedByRole,
        previousState: params.previousState || null,
        newState: params.newState || null,
        reason: params.reason || null,
      },
    })
  } catch (error) {
    console.error("Failed to create match history:", error)
    return null
  }
}

export async function getMatchHistory(matchId: string) {
  try {
    return await prisma.matchHistory.findMany({
      where: { matchId },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Failed to get match history:", error)
    return []
  }
}
