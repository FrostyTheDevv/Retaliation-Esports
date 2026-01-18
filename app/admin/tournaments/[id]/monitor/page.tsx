import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import LiveMatchMonitor from "@/components/admin/LiveMatchMonitor"

export default async function LiveMonitorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      matches: {
        where: {
          status: {
            in: ["pending", "ready", "live"],
          },
        },
        include: {
          team1: true,
          team2: true,
        },
        orderBy: {
          matchNumber: "asc",
        },
      },
    },
  })

  if (!tournament) {
    notFound()
  }

  const allMatches = await prisma.match.findMany({
    where: { tournamentId: id },
  })

  const activeMatches = tournament.matches.length
  const completedMatches = allMatches.filter((m: { status: string }) => m.status === "completed").length
  const totalMatches = allMatches.length
  const liveMatches = tournament.matches.filter((m: { status: string }) => m.status === "live").length

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/admin/tournaments/${id}`}
              className="text-gray-400 hover:text-white mb-2 inline-block"
            >
              ← Back to Tournament
            </Link>
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            <p className="text-gray-400 mt-1">Live Tournament Monitor</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Auto-refreshing</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-gray-400 text-sm">Total Matches</div>
            <div className="text-3xl font-bold mt-2">{totalMatches}</div>
          </div>

          <div className="bg-green-900/30 border border-green-600 p-6 rounded-lg">
            <div className="text-green-400 text-sm">Live Now</div>
            <div className="text-3xl font-bold mt-2">{liveMatches}</div>
          </div>

          <div className="bg-blue-900/30 border border-blue-600 p-6 rounded-lg">
            <div className="text-blue-400 text-sm">Active Matches</div>
            <div className="text-3xl font-bold mt-2">{activeMatches}</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-gray-400 text-sm">Completed</div>
            <div className="text-3xl font-bold mt-2">
              {completedMatches}/{totalMatches}
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full mt-2 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-[#77010F] transition-all"
                style={totalMatches > 0 ? { width: `${(completedMatches / totalMatches) * 100}%` } : { width: '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Live Match Monitor */}
        <LiveMatchMonitor
          tournamentId={id}
          matches={tournament.matches}
          checkInEnabled={tournament.checkInEnabled}
        />
      </div>
    </div>
  )
}
