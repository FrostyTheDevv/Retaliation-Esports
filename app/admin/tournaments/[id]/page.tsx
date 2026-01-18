import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import { format } from "date-fns"
import {
  Calendar,
  Users,
  Trophy,
  Settings,
  Play,
  FileText,
  AlertCircle,
  Edit,
} from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TournamentDetailPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      signups: {
        include: {
          team: true,
        },
      },
      matches: {
        include: {
          team1: true,
          team2: true,
        },
        orderBy: {
          matchNumber: "asc",
        },
      },
      _count: {
        select: {
          signups: true,
          matches: true,
        },
      },
    },
  })

  if (!tournament) {
    notFound()
  }

  const approvedSignups = tournament.signups.filter((s: any) => s.status === "approved")
  const pendingSignups = tournament.signups.filter((s: any) => s.status === "pending")
  const completedMatches = tournament.matches.filter((m: any) => m.status === "completed")
  const activeMatches = tournament.matches.filter((m: any) =>
    ["ready", "live"].includes(m.status)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                tournament.status === "draft"
                  ? "bg-gray-700 text-gray-300"
                  : tournament.status === "open"
                  ? "bg-green-900/50 text-green-300"
                  : tournament.status === "closed"
                  ? "bg-yellow-900/50 text-yellow-300"
                  : tournament.status === "ongoing"
                  ? "bg-blue-900/50 text-blue-300"
                  : "bg-purple-900/50 text-purple-300"
              }`}
            >
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-400">{tournament.description}</p>
        </div>
        <Link
          href={`/admin/tournaments/${id}/edit`}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Signups</p>
              <p className="text-3xl font-bold text-white mt-1">{approvedSignups.length}</p>
              {tournament.maxTeams && (
                <p className="text-gray-500 text-sm mt-1">of {tournament.maxTeams} max</p>
              )}
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Signups</p>
              <p className="text-3xl font-bold text-white mt-1">{pendingSignups.length}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Matches</p>
              <p className="text-3xl font-bold text-white mt-1">{tournament.matches.length}</p>
              <p className="text-gray-500 text-sm mt-1">
                {completedMatches.length} completed
              </p>
            </div>
            <Trophy className="w-10 h-10 text-[#77010F]" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Matches</p>
              <p className="text-3xl font-bold text-white mt-1">{activeMatches.length}</p>
            </div>
            <Play className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tournament Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Tournament Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Game Mode:</span>
              <span className="text-white font-semibold">{tournament.gameMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Format:</span>
              <span className="text-white font-semibold">{tournament.format}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Best Of:</span>
              <span className="text-white font-semibold">{tournament.bestOf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Start Date:</span>
              <span className="text-white font-semibold">
                {format(new Date(tournament.startDate), "MMM d, yyyy h:mm a")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Registration Deadline:</span>
              <span className="text-white font-semibold">
                {format(new Date(tournament.registrationDeadline), "MMM d, yyyy h:mm a")}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  tournament.checkInEnabled ? "bg-green-500" : "bg-gray-500"
                }`}
              />
              <span className="text-gray-300">Check-in Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  tournament.requireEmailVerification ? "bg-green-500" : "bg-gray-500"
                }`}
              />
              <span className="text-gray-300">Email Verification Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  tournament.allowRandomize ? "bg-green-500" : "bg-gray-500"
                }`}
              />
              <span className="text-gray-300">Random Seeding Allowed</span>
            </div>
            {tournament.prizeInfo && (
              <div className="pt-3 border-t border-zinc-800">
                <span className="text-gray-400 block mb-2">Prize Pool:</span>
                <p className="text-white whitespace-pre-line">{tournament.prizeInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/admin/tournaments/${id}/signups`}
          className="bg-zinc-900 hover:bg-zinc-800 rounded-lg p-6 border border-zinc-800 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Manage Signups</h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-gray-400 text-sm">
            Review and approve team registrations
          </p>
          {pendingSignups.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-900/30 border border-yellow-700 rounded-full">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-300 text-sm font-semibold">
                {pendingSignups.length} pending
              </span>
            </div>
          )}
        </Link>

        <Link
          href={`/admin/tournaments/${id}/bracket`}
          className="bg-zinc-900 hover:bg-zinc-800 rounded-lg p-6 border border-zinc-800 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Bracket Management</h3>
            <Trophy className="w-6 h-6 text-[#77010F]" />
          </div>
          <p className="text-gray-400 text-sm">
            Generate and manage tournament bracket
          </p>
        </Link>

        <Link
          href={`/admin/tournaments/${id}/monitor`}
          className="bg-zinc-900 hover:bg-zinc-800 rounded-lg p-6 border border-zinc-800 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Live Monitor</h3>
            <Play className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-gray-400 text-sm">
            Monitor active matches and enter results
          </p>
          {activeMatches.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-700 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-300 text-sm font-semibold">
                {activeMatches.length} live
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Recent Activity / Matches */}
      {tournament.matches.length > 0 && (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white">Recent Matches</h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {tournament.matches.slice(0, 5).map((match: any) => (
              <div key={match.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">Match</span>
                      <span className="text-white font-semibold">
                        {match.team1?.name || "TBD"} vs {match.team2?.name || "TBD"}
                      </span>
                    </div>
                    {match.status === "completed" && match.team1Score !== null && match.team2Score !== null && (
                      <div className="mt-2 text-sm text-gray-400">
                        Score: <span className="text-white font-semibold">{match.team1Score} - {match.team2Score}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.status === "pending"
                        ? "bg-gray-700 text-gray-300"
                        : match.status === "ready"
                        ? "bg-yellow-900/50 text-yellow-300"
                        : match.status === "live"
                        ? "bg-green-900/50 text-green-300"
                        : "bg-purple-900/50 text-purple-300"
                    }`}
                  >
                    {match.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
