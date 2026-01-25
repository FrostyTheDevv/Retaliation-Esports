"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Match {
  id: string
  matchNumber: number
  team1Id: string | null
  team2Id: string | null
  team1Score: number | null
  team2Score: number | null
  winnerId: string | null
  status: string
  team1?: {
    id: string
    name: string
  } | null
  team2?: {
    id: string
    name: string
  } | null
}

interface BracketVisualizationProps {
  matches: Match[]
  format: string
  bracketData: any
}

export default function BracketVisualization({
  matches,
  format,
  bracketData,
}: BracketVisualizationProps) {
  const router = useRouter()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [score1, setScore1] = useState("")
  const [score2, setScore2] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [dqReason, setDqReason] = useState("")

  // Group matches by round
  const structure = bracketData.structure || []
  const rounds = new Map<number, Match[]>()

  matches.forEach((match) => {
    const matchStructure = structure.find(
      (s: any) => s.matchNumber === match.matchNumber
    )
    if (matchStructure) {
      const round = matchStructure.roundNumber
      if (!rounds.has(round)) {
        rounds.set(round, [])
      }
      rounds.get(round)!.push(match)
    }
  })

  async function handleScoreSubmit(matchId: string) {
    if (!score1 || !score2) {
      alert("Please enter both scores")
      return
    }

    const s1 = parseInt(score1)
    const s2 = parseInt(score2)

    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      alert("Invalid scores")
      return
    }

    if (s1 === s2) {
      alert("Scores cannot be tied")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/matches/${matchId}/score`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team1Score: s1,
          team2Score: s2,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit score")
      }

      alert("Score submitted successfully")
      setSelectedMatch(null)
      setScore1("")
      setScore2("")
      router.refresh()
    } catch (error) {
      alert("Failed to submit score")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSwapTeams(matchId: string) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/matches/${matchId}/swap`, {
        method: "PATCH",
      })
      if (!response.ok) throw new Error("Failed to swap teams")
      alert("Teams swapped successfully")
      setSelectedMatch(null)
      router.refresh()
    } catch (error) {
      alert("Failed to swap teams")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDisqualify(matchId: string, teamId: string) {
    if (!confirm("Are you sure you want to disqualify this team?")) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/matches/${matchId}/disqualify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, reason: dqReason }),
      })
      if (!response.ok) throw new Error("Failed to disqualify team")
      alert("Team disqualified")
      setSelectedMatch(null)
      setDqReason("")
      router.refresh()
    } catch (error) {
      alert("Failed to disqualify team")
    } finally {
      setIsSubmitting(false)
    }
  }

  function getStatusBadge(status: string) {
    const colors: Record<string, string> = {
      pending: "bg-yellow-600",
      ready: "bg-blue-600",
      live: "bg-green-600",
      completed: "bg-gray-600",
      disputed: "bg-red-600",
      postponed: "bg-orange-600",
    }

    return (
      <span
        className={`${colors[status] || "bg-gray-600"} text-white text-xs px-2 py-1 rounded`}
      >
        {status}
      </span>
    )
  }

  return (
    <div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-6">Bracket Structure</h2>

        {/* Rounds */}
        <div className="space-y-8">
          {Array.from(rounds.entries())
            .sort(([a], [b]) => a - b)
            .map(([roundNumber, roundMatches]) => (
              <div key={roundNumber}>
                <h3 className="text-lg font-bold mb-4">
                  Round {roundNumber}
                  {roundNumber === rounds.size && format === "single-elimination"
                    ? " (Finals)"
                    : ""}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roundMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-gray-700 p-4 rounded-lg border-2 border-gray-600 hover:border-[#77010F] transition cursor-pointer"
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">
                          Match {match.matchNumber}
                        </span>
                        {getStatusBadge(match.status)}
                      </div>

                      {/* Team 1 */}
                      <div
                        className={`flex items-center justify-between p-2 rounded mb-2 ${
                          match.winnerId === match.team1Id
                            ? "bg-green-900/30 border border-green-600"
                            : "bg-gray-800"
                        }`}
                      >
                        <span className="font-medium">
                          {match.team1?.name || "TBD"}
                        </span>
                        {match.team1Score !== null && (
                          <span className="font-bold">{match.team1Score}</span>
                        )}
                      </div>

                      {/* Team 2 */}
                      <div
                        className={`flex items-center justify-between p-2 rounded ${
                          match.winnerId === match.team2Id
                            ? "bg-green-900/30 border border-green-600"
                            : "bg-gray-800"
                        }`}
                      >
                        <span className="font-medium">
                          {match.team2?.name || "TBD"}
                        </span>
                        {match.team2Score !== null && (
                          <span className="font-bold">{match.team2Score}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Score Entry Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Match {selectedMatch.matchNumber}
            </h3>

            {selectedMatch.status === "completed" ? (
              <div>
                <p className="text-gray-400 mb-4">This match is complete</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{selectedMatch.team1?.name}</span>
                    <span className="font-bold">{selectedMatch.team1Score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{selectedMatch.team2?.name}</span>
                    <span className="font-bold">{selectedMatch.team2Score}</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-900/30 border border-green-600 rounded">
                    <span className="text-green-400">
                      Winner: {
                        selectedMatch.winnerId === selectedMatch.team1Id
                          ? selectedMatch.team1?.name
                          : selectedMatch.winnerId === selectedMatch.team2Id
                            ? selectedMatch.team2?.name
                            : "Unknown"
                      }
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {!showActions ? (
                  <>
                    {/* Team 1 Score */}
                    <div className="mb-4">
                      <label className="block text-sm text-gray-400 mb-2">
                        {selectedMatch.team1?.name || "Team 1"} Score
                      </label>
                      <input
                        type="number"
                        value={score1}
                        onChange={(e) => setScore1(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {/* Team 2 Score */}
                    <div className="mb-6">
                      <label className="block text-sm text-gray-400 mb-2">
                        {selectedMatch.team2?.name || "Team 2"} Score
                      </label>
                      <input
                        type="number"
                        value={score2}
                        onChange={(e) => setScore2(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => handleScoreSubmit(selectedMatch.id)}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-[#77010F] text-white rounded hover:bg-[#5a0008] disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Score"}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMatch(null)
                          setScore1("")
                          setScore2("")
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setShowActions(true)}
                      className="w-full px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 text-sm"
                    >
                      More Actions (Swap, DQ, Edit)
                    </button>
                  </>
                ) : (
                  <>
                    {/* More Actions Panel */}
                    <div className="space-y-4">
                      {/* Swap Teams */}
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Swap Teams</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Switch the positions of {selectedMatch.team1?.name || "Team 1"} and {selectedMatch.team2?.name || "Team 2"}
                        </p>
                        <button
                          onClick={() => handleSwapTeams(selectedMatch.id)}
                          disabled={isSubmitting}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          Swap Teams
                        </button>
                      </div>

                      {/* Disqualify Team */}
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Disqualify Team</h4>
                        <input
                          type="text"
                          value={dqReason}
                          onChange={(e) => setDqReason(e.target.value)}
                          placeholder="Reason for disqualification"
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded mb-3"
                        />
                        <div className="flex gap-2">
                          {selectedMatch.team1Id && (
                            <button
                              onClick={() => handleDisqualify(selectedMatch.id, selectedMatch.team1Id!)}
                              disabled={isSubmitting}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                            >
                              DQ {selectedMatch.team1?.name}
                            </button>
                          )}
                          {selectedMatch.team2Id && (
                            <button
                              onClick={() => handleDisqualify(selectedMatch.id, selectedMatch.team2Id!)}
                              disabled={isSubmitting}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                            >
                              DQ {selectedMatch.team2?.name}
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setShowActions(false)}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Back to Scores
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
