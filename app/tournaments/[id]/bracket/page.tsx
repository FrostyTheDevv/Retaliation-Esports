import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

interface BracketPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BracketPage({ params }: BracketPageProps) {
  const { id } = await params

  // Fetch tournament
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      status: true,
    },
  })

  if (!tournament) {
    notFound()
  }

  // Fetch bracket
  const bracket = await prisma.bracket.findUnique({
    where: { tournamentId: id },
  })

  // Fetch matches with teams
  const matches = await prisma.match.findMany({
    where: { tournamentId: id },
    include: {
      team1: {
        select: {
          id: true,
          name: true,
        },
      },
      team2: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ round: "asc" }, { matchNumber: "asc" }],
  })

  // Group matches by round
  const matchesByRound = matches.reduce((acc: Record<number, typeof matches>, match) => {
    if (!acc[match.round]) {
      acc[match.round] = []
    }
    acc[match.round].push(match)
    return acc
  }, {} as Record<number, typeof matches>)

  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b)

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return "Finals"
    if (round === totalRounds - 1) return "Semi-Finals"
    if (round === totalRounds - 2) return "Quarter-Finals"
    return `Round ${round}`
  }

  const getMatchStatus = (match: typeof matches[0]) => {
    if (match.winnerId) return "completed"
    if (match.team1 && match.team2) return "ready"
    return "pending"
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/tournaments/${id}`}
            className="text-[#77010F] hover:text-[#5A010C] transition-colors mb-4 inline-block"
          >
            ← Back to Tournament
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
            {tournament.name} - Bracket
          </h1>
          {bracket && (
            <p className="text-gray-400">
              Format:{" "}
              <span className="text-white font-semibold">
                {bracket.format === "single_elimination"
                  ? "Single Elimination"
                  : "Double Elimination"}
              </span>
            </p>
          )}
        </div>

        {/* Bracket Content */}
        {!bracket ? (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
            <p className="text-gray-400 mb-4">Bracket has not been generated yet.</p>
            <p className="text-gray-500 text-sm">
              The bracket will be available once the tournament admin creates it.
            </p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
            <p className="text-gray-400 mb-4">No matches found in this tournament.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Bracket Visualization */}
            <div className="overflow-x-auto">
              <div className="inline-flex gap-8 min-w-full pb-4">
                {rounds.map((round) => (
                  <div key={round} className="shrink-0 min-w-75">
                    {/* Round Header */}
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-3 mb-4 sticky top-0 z-10">
                      <h3 className="text-lg font-bold text-white text-center drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]">
                        {getRoundName(round, rounds.length)}
                      </h3>
                      <p className="text-gray-400 text-sm text-center">
                        {matchesByRound[round].filter((m: any) => getMatchStatus(m) === "completed").length}/
                        {matchesByRound[round].length} Complete
                      </p>
                    </div>

                    {/* Matches in Round */}
                    <div className="space-y-4">
                      {matchesByRound[round].map((match: any) => {
                        const status = getMatchStatus(match)
                        const isCompleted = status === "completed"

                        return (
                          <div
                            key={match.id}
                            className={`bg-zinc-900 rounded-lg border transition-colors ${
                              isCompleted
                                ? "border-zinc-700"
                                : status === "ready"
                                ? "border-[#77010F]/50"
                                : "border-zinc-800"
                            }`}
                          >
                            {/* Match Number */}
                            <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                              <p className="text-gray-400 text-sm">Match {match.matchNumber}</p>
                              {match.bracketType && (
                                <span className="text-xs text-gray-500 uppercase">
                                  {match.bracketType.replace("_", " ")}
                                </span>
                              )}
                            </div>

                            {/* Team 1 */}
                            <div
                              className={`px-4 py-3 flex items-center justify-between ${
                                match.winnerId === match.team1Id ? "bg-green-500/10" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {match.winnerId === match.team1Id && (
                                  <span className="text-green-500 font-bold">✓</span>
                                )}
                                <span className={`font-medium ${match.team1 ? "text-white" : "text-gray-500"}`}>
                                  {match.team1 ? match.team1.name : "TBD"}
                                </span>
                              </div>
                              {isCompleted && (
                                <span className="text-white font-bold text-lg">{match.team1Score ?? 0}</span>
                              )}
                            </div>

                            {/* Divider */}
                            <div className="border-b border-zinc-800" />

                            {/* Team 2 */}
                            <div
                              className={`px-4 py-3 flex items-center justify-between ${
                                match.winnerId === match.team2Id ? "bg-green-500/10" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {match.winnerId === match.team2Id && (
                                  <span className="text-green-500 font-bold">✓</span>
                                )}
                                <span className={`font-medium ${match.team2 ? "text-white" : "text-gray-500"}`}>
                                  {match.team2 ? match.team2.name : "TBD"}
                                </span>
                              </div>
                              {isCompleted && (
                                <span className="text-white font-bold text-lg">{match.team2Score ?? 0}</span>
                              )}
                            </div>

                            {/* Match Status */}
                            {!isCompleted && (
                              <div className="px-4 py-2 border-t border-zinc-800">
                                <p className="text-xs text-gray-500 text-center">
                                  {status === "ready" ? "Match Ready" : "Waiting for teams"}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winner Display */}
            {matches.some((m: any) => m.winnerId) && (
              <div className="bg-linear-to-r from-[#77010F]/20 to-black rounded-xl border border-[#77010F] p-8 text-center">
                <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Tournament Champion</p>
                <h2 className="text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {matches.find((m: any) => m.winnerId)?.team1?.name ||
                    matches.find((m: any) => m.winnerId)?.team2?.name ||
                    "Winner"}
                </h2>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Bracket Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Matches</p>
                  <p className="text-white font-semibold text-2xl">{matches.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Completed</p>
                  <p className="text-green-500 font-semibold text-2xl">
                    {matches.filter((m: any) => getMatchStatus(m) === "completed").length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Remaining</p>
                  <p className="text-yellow-500 font-semibold text-2xl">
                    {matches.filter((m: any) => getMatchStatus(m) !== "completed").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
