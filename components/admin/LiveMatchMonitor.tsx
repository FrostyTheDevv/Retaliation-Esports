"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Match {
  id: string
  matchNumber: number
  status: string
  team1Id: string | null
  team2Id: string | null
  team1CheckedIn: boolean
  team2CheckedIn: boolean
  lobbyCode: string | null
  serverInfo: string | null
  team1?: {
    id: string
    name: string
  } | null
  team2?: {
    id: string
    name: string
  } | null
}

interface LiveMatchMonitorProps {
  tournamentId: string
  matches: Match[]
  checkInEnabled: boolean
}

export default function LiveMatchMonitor({
  tournamentId,
  matches: initialMatches,
  checkInEnabled,
}: LiveMatchMonitorProps) {
  const router = useRouter()
  const [matches, setMatches] = useState(initialMatches)

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 15000)

    return () => clearInterval(interval)
  }, [router])

  async function handleStartMatch(matchId: string) {
    try {
      const response = await fetch(`/api/admin/matches/${matchId}/start`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to start match")
      }

      alert("Match started successfully")
      router.refresh()
    } catch (error) {
      alert("Failed to start match")
    }
  }

  async function handleCheckIn(matchId: string, teamId: string) {
    try {
      const response = await fetch(`/api/admin/matches/${matchId}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId }),
      })

      if (!response.ok) {
        throw new Error("Failed to check in")
      }

      router.refresh()
    } catch (error) {
      alert("Failed to check in team")
    }
  }

  async function handleUpdateLobby(
    matchId: string,
    lobbyCode: string,
    serverInfo: string
  ) {
    try {
      const response = await fetch(`/api/admin/matches/${matchId}/lobby`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lobbyCode, serverInfo }),
      })

      if (!response.ok) {
        throw new Error("Failed to update lobby")
      }

      alert("Lobby information updated")
      router.refresh()
    } catch (error) {
      alert("Failed to update lobby")
    }
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      pending: "bg-yellow-600",
      ready: "bg-blue-600",
      live: "bg-green-600",
      completed: "bg-gray-600",
      disputed: "bg-red-600",
      postponed: "bg-orange-600",
    }
    return colors[status] || "bg-gray-600"
  }

  if (matches.length === 0) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <p className="text-gray-400">No active matches at the moment</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {matches.map((match) => (
        <div key={match.id} className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Match {match.matchNumber}</span>
              <span
                className={`${getStatusColor(match.status)} text-white text-xs px-3 py-1 rounded-full uppercase font-semibold`}
              >
                {match.status}
              </span>
            </div>

            {match.status === "ready" && (
              <button
                onClick={() => handleStartMatch(match.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Start Match
              </button>
            )}
          </div>

          {/* Teams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Team 1 */}
            <div className="bg-gray-700 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">
                  {match.team1?.name || "TBD"}
                </span>
                {checkInEnabled && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        match.team1CheckedIn ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        match.team1CheckedIn ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {match.team1CheckedIn ? "Checked In" : "Not Checked In"}
                    </span>
                  </div>
                )}
              </div>
              {checkInEnabled &&
                !match.team1CheckedIn &&
                match.team1Id &&
                match.status === "pending" && (
                  <button
                    onClick={() => handleCheckIn(match.id, match.team1Id!)}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mark Checked In
                  </button>
                )}
            </div>

            {/* Team 2 */}
            <div className="bg-gray-700 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">
                  {match.team2?.name || "TBD"}
                </span>
                {checkInEnabled && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        match.team2CheckedIn ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        match.team2CheckedIn ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {match.team2CheckedIn ? "Checked In" : "Not Checked In"}
                    </span>
                  </div>
                )}
              </div>
              {checkInEnabled &&
                !match.team2CheckedIn &&
                match.team2Id &&
                match.status === "pending" && (
                  <button
                    onClick={() => handleCheckIn(match.id, match.team2Id!)}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mark Checked In
                  </button>
                )}
            </div>
          </div>

          {/* Lobby Info */}
          {match.status === "live" && (
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-2">Lobby Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Lobby Code</label>
                  <p className="font-mono">{match.lobbyCode || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Server Info</label>
                  <p className="font-mono">{match.serverInfo || "Not set"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                const lobbyCode = prompt("Enter lobby code:")
                const serverInfo = prompt("Enter server info:")
                if (lobbyCode && serverInfo) {
                  handleUpdateLobby(match.id, lobbyCode, serverInfo)
                }
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Update Lobby
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
