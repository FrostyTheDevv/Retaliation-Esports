import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import BracketGenerator from "@/components/admin/BracketGenerator"
import BracketVisualization from "@/components/admin/BracketVisualization"

export default async function BracketManagementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      bracket: true,
      matches: {
        include: {
          team1: true,
          team2: true,
        },
        orderBy: {
          matchNumber: "asc",
        },
      },
      signups: {
        where: { status: "approved" },
        include: {
          team: true,
        },
      },
    },
  })

  if (!tournament) {
    notFound()
  }

  const hasBracket = !!tournament.bracket
  const approvedTeamCount = tournament.signups.length

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
            <p className="text-gray-400 mt-1">Bracket Management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-gray-400 text-sm">Approved Teams</div>
            <div className="text-3xl font-bold mt-2">{approvedTeamCount}</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-gray-400 text-sm">Total Matches</div>
            <div className="text-3xl font-bold mt-2">{tournament.matches.length}</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-gray-400 text-sm">Completed</div>
            <div className="text-3xl font-bold mt-2">
              {tournament.matches.filter((m: any) => m.status === "completed").length}
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-gray-400 text-sm">Active</div>
            <div className="text-3xl font-bold mt-2">
              {tournament.matches.filter((m: any) => m.status === "live").length}
            </div>
          </div>
        </div>

        {/* Bracket Generation or Visualization */}
        {!hasBracket ? (
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Generate Bracket</h2>
            {approvedTeamCount < 2 ? (
              <div className="bg-yellow-900/30 border border-yellow-600 rounded p-4">
                <p className="text-yellow-400">
                  You need at least 2 approved teams to generate a bracket.
                </p>
                <Link
                  href={`/admin/tournaments/${id}/signups`}
                  className="text-white underline mt-2 inline-block"
                >
                  Manage Signups →
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-6">
                  Generate the tournament bracket from {approvedTeamCount} approved teams.
                  This will create all matches for the tournament.
                </p>
                <BracketGenerator
                  tournamentId={id}
                  format={tournament.format}
                  teamCount={approvedTeamCount}
                />
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Bracket Generated</h2>
                  <p className="text-gray-400 mt-1">
                    Format: {tournament.format} • {tournament.matches.length} matches
                  </p>
                </div>
                <BracketGenerator
                  tournamentId={id}
                  format={tournament.format}
                  teamCount={approvedTeamCount}
                  isRegenerate
                />
              </div>
            </div>

            {/* Bracket Visualization */}
            <BracketVisualization
              matches={tournament.matches}
              format={tournament.format}
              bracketData={tournament.bracket?.bracketData || {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}
