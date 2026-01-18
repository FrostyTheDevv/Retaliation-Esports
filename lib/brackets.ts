import { prisma } from "./prisma"

interface Team {
  id: string
  name: string
}

interface BracketMatch {
  matchNumber: number
  roundNumber: number
  team1Id: string | null
  team2Id: string | null
  nextMatchNumber: number | null
  position: string // "winners" | "losers" | "grand-final"
}

/**
 * Calculate the next power of 2 for bracket size
 */
function nextPowerOfTwo(n: number): number {
  return Math.pow(2, Math.ceil(Math.log2(n)))
}

/**
 * Calculate number of byes needed
 */
function calculateByes(teamCount: number): number {
  const bracketSize = nextPowerOfTwo(teamCount)
  return bracketSize - teamCount
}

/**
 * Shuffle array for random seeding
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate single elimination bracket
 */
export async function generateSingleEliminationBracket(
  tournamentId: string,
  teams: Team[],
  randomize: boolean = false
): Promise<{ success: boolean; matchCount: number }> {
  try {
    // Shuffle teams if randomization is enabled
    const orderedTeams = randomize ? shuffleArray(teams) : teams

    const teamCount = orderedTeams.length
    const bracketSize = nextPowerOfTwo(teamCount)
    const byeCount = calculateByes(teamCount)

    // Create array of team IDs with nulls for byes
    const bracketTeams: (string | null)[] = []
    for (let i = 0; i < bracketSize; i++) {
      if (i < byeCount) {
        bracketTeams.push(null) // Bye
      } else {
        bracketTeams.push(orderedTeams[i - byeCount]?.id || null)
      }
    }

    // Calculate total rounds
    const totalRounds = Math.log2(bracketSize)

    // Generate all matches
    const matches: BracketMatch[] = []
    let matchNumber = 1

    // Round 1 matches
    for (let i = 0; i < bracketSize / 2; i++) {
      const team1Id = bracketTeams[i * 2]
      const team2Id = bracketTeams[i * 2 + 1]

      matches.push({
        matchNumber,
        roundNumber: 1,
        team1Id,
        team2Id,
        nextMatchNumber: Math.floor(bracketSize / 2) + Math.floor(i / 2) + 1,
        position: "winners",
      })
      matchNumber++
    }

    // Subsequent rounds
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round)
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          matchNumber,
          roundNumber: round,
          team1Id: null, // Will be filled by winners
          team2Id: null,
          nextMatchNumber: round < totalRounds ? matchNumber + matchesInRound : null,
          position: round === totalRounds ? "grand-final" : "winners",
        })
        matchNumber++
      }
    }

    // Save bracket to database
    const bracketData = {
      structure: matches,
      format: "single-elimination",
      totalRounds,
      byeCount,
    }

    await prisma.bracket.upsert({
      where: { tournamentId },
      update: { 
        format: "single-elimination",
        bracketData: bracketData as any 
      },
      create: {
        tournamentId,
        format: "single-elimination",
        bracketData: bracketData as any,
      },
    })

    // Create match records
    await prisma.match.deleteMany({ where: { tournamentId } })

    for (const match of matches) {
      await prisma.match.create({
        data: {
          tournamentId,
          matchNumber: match.matchNumber,
          round: match.roundNumber,
          team1Id: match.team1Id,
          team2Id: match.team2Id,
          status: match.team1Id && match.team2Id ? "pending" : "ready",
        },
      })
    }

    return { success: true, matchCount: matches.length }
  } catch (error) {
    console.error("Failed to generate single elimination bracket:", error)
    throw error
  }
}

/**
 * Generate double elimination bracket
 */
export async function generateDoubleEliminationBracket(
  tournamentId: string,
  teams: Team[],
  randomize: boolean = false
): Promise<{ success: boolean; matchCount: number }> {
  try {
    // Shuffle teams if randomization is enabled
    const orderedTeams = randomize ? shuffleArray(teams) : teams

    const teamCount = orderedTeams.length
    const bracketSize = nextPowerOfTwo(teamCount)
    const byeCount = calculateByes(teamCount)

    // Create array of team IDs with nulls for byes
    const bracketTeams: (string | null)[] = []
    for (let i = 0; i < bracketSize; i++) {
      if (i < byeCount) {
        bracketTeams.push(null) // Bye
      } else {
        bracketTeams.push(orderedTeams[i - byeCount]?.id || null)
      }
    }

    const totalRounds = Math.log2(bracketSize)
    const matches: BracketMatch[] = []
    let matchNumber = 1

    // WINNERS BRACKET - Round 1
    for (let i = 0; i < bracketSize / 2; i++) {
      matches.push({
        matchNumber,
        roundNumber: 1,
        team1Id: bracketTeams[i * 2],
        team2Id: bracketTeams[i * 2 + 1],
        nextMatchNumber: null, // Will be set later
        position: "winners",
      })
      matchNumber++
    }

    // WINNERS BRACKET - Subsequent rounds
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round)
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          matchNumber,
          roundNumber: round,
          team1Id: null,
          team2Id: null,
          nextMatchNumber: null,
          position: "winners",
        })
        matchNumber++
      }
    }

    // LOSERS BRACKET - Multiple rounds (2 * totalRounds - 1)
    const losersRounds = 2 * totalRounds - 1
    for (let round = 1; round <= losersRounds; round++) {
      let matchesInRound: number
      if (round === 1) {
        matchesInRound = bracketSize / 4
      } else if (round % 2 === 1) {
        matchesInRound = Math.pow(2, Math.floor((losersRounds - round) / 2))
      } else {
        matchesInRound = Math.pow(2, Math.floor((losersRounds - round + 1) / 2))
      }

      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          matchNumber,
          roundNumber: round,
          team1Id: null,
          team2Id: null,
          nextMatchNumber: null,
          position: "losers",
        })
        matchNumber++
      }
    }

    // GRAND FINALS (2 matches - initial + bracket reset if needed)
    matches.push({
      matchNumber,
      roundNumber: 1,
      team1Id: null, // Winners bracket champion
      team2Id: null, // Losers bracket champion
      nextMatchNumber: matchNumber + 1,
      position: "grand-final",
    })
    matchNumber++

    matches.push({
      matchNumber,
      roundNumber: 2,
      team1Id: null, // Winner of first grand final
      team2Id: null, // Loser of first grand final (if from winners)
      nextMatchNumber: null,
      position: "grand-final",
    })

    // Save bracket to database
    const bracketData = {
      structure: matches,
      format: "double-elimination",
      totalRounds,
      byeCount,
      winnersRounds: totalRounds,
      losersRounds,
    }

    await prisma.bracket.upsert({
      where: { tournamentId },
      update: { 
        format: "double-elimination",
        bracketData: bracketData as any 
      },
      create: {
        tournamentId,
        format: "double-elimination",
        bracketData: bracketData as any,
      },
    })

    // Create match records
    await prisma.match.deleteMany({ where: { tournamentId } })

    for (const match of matches) {
      await prisma.match.create({
        data: {
          tournamentId,
          matchNumber: match.matchNumber,
          round: match.roundNumber,
          team1Id: match.team1Id,
          team2Id: match.team2Id,
          status: match.team1Id && match.team2Id ? "pending" : "ready",
        },
      })
    }

    return { success: true, matchCount: matches.length }
  } catch (error) {
    console.error("Failed to generate double elimination bracket:", error)
    throw error
  }
}

/**
 * Advance winner to next match
 */
export async function advanceWinner(
  matchId: string,
  winnerId: string,
  score1: number,
  score2: number
): Promise<void> {
  try {
    // Update current match
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        winnerId,
        team1Score: score1,
        team2Score: score2,
        status: "completed",
      },
      include: {
        tournament: {
          include: {
            bracket: true,
          },
        },
      },
    })

    if (!match.tournament.bracket) {
      throw new Error("Bracket not found")
    }

    const bracketData = match.tournament.bracket.bracketData as any
    const currentMatch = bracketData.structure.find(
      (m: BracketMatch) => m.matchNumber === match.matchNumber
    )

    if (!currentMatch || !currentMatch.nextMatchNumber) {
      return // Final match, no next match
    }

    // Find next match
    const nextMatch = await prisma.match.findFirst({
      where: {
        tournamentId: match.tournamentId,
        matchNumber: currentMatch.nextMatchNumber,
      },
    })

    if (nextMatch) {
      // Determine which slot to fill (team1 or team2)
      if (!nextMatch.team1Id) {
        await prisma.match.update({
          where: { id: nextMatch.id },
          data: {
            team1Id: winnerId,
            status: nextMatch.team2Id ? "pending" : "ready",
          },
        })
      } else if (!nextMatch.team2Id) {
        await prisma.match.update({
          where: { id: nextMatch.id },
          data: {
            team2Id: winnerId,
            status: "pending",
          },
        })
      }
    }
  } catch (error) {
    console.error("Failed to advance winner:", error)
    throw error
  }
}
