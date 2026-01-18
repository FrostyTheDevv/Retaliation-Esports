import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import { Plus, Calendar, Users, Trophy } from "lucide-react"
import { format } from "date-fns"

export default async function AdminTournamentsPage() {
  await requireAdmin()

  // Fetch all tournaments
  const tournaments = await prisma.tournament.findMany({
    include: {
      _count: {
        select: {
          signups: true,
          matches: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Group by status
  const tournamentsByStatus = {
    draft: tournaments.filter((t: any) => t.status === "draft"),
    open: tournaments.filter((t: any) => t.status === "open"),
    closed: tournaments.filter((t: any) => t.status === "closed"),
    ongoing: tournaments.filter((t: any) => t.status === "ongoing"),
    completed: tournaments.filter((t: any) => t.status === "completed"),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tournament Management</h1>
          <p className="text-gray-400 mt-1">
            Create and manage tournaments with bracket generation
          </p>
        </div>
        <Link
          href="/admin/tournaments/new"
          className="bg-[#77010F] hover:bg-[#5A010C] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Tournament
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tournaments</p>
              <p className="text-3xl font-bold text-white mt-1">{tournaments.length}</p>
            </div>
            <Trophy className="w-10 h-10 text-[#77010F]" />
          </div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Open for Registration</p>
              <p className="text-3xl font-bold text-white mt-1">
                {tournamentsByStatus.open.length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ongoing</p>
              <p className="text-3xl font-bold text-white mt-1">
                {tournamentsByStatus.ongoing.length}
              </p>
            </div>
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Signups</p>
              <p className="text-3xl font-bold text-white mt-1">
                {tournaments.reduce((acc: any, t: any) => acc + t._count.signups, 0)}
              </p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="space-y-4">
        {tournaments.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg p-12 border border-zinc-800 text-center">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tournaments Yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first tournament to get started
            </p>
            <Link
              href="/admin/tournaments/new"
              className="inline-flex items-center gap-2 bg-[#77010F] hover:bg-[#5A010C] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Tournament
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800 border-b border-zinc-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm">
                      Tournament
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm">
                      Start Date
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm">
                      Game Mode
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm">
                      Signups
                    </th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm">
                      Matches
                    </th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {tournaments.map((tournament: any) => (
                    <tr key={tournament.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/tournaments/${tournament.id}`}
                          className="font-semibold text-white hover:text-[#77010F] transition-colors"
                        >
                          {tournament.name}
                        </Link>
                        <p className="text-sm text-gray-400 mt-1">{tournament.gameMode}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
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
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {format(new Date(tournament.startDate), "MMM d, yyyy")}
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(tournament.startDate), "h:mm a")}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{tournament.gameMode}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-white font-semibold">
                            {tournament._count.signups}
                          </span>
                          {tournament.maxTeams && (
                            <span className="text-gray-400">/ {tournament.maxTeams}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{tournament._count.matches}</td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/tournaments/${tournament.id}/edit`}
                          className="text-blue-400 hover:text-blue-300 font-semibold text-sm mr-4"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/tournaments/${tournament.id}`}
                          className="text-[#77010F] hover:text-[#5A010C] font-semibold text-sm"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
