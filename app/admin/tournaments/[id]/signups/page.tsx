import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import { format } from "date-fns"
import { ArrowLeft, CheckCircle, XCircle, Mail, Users, AlertCircle } from "lucide-react"
import SignupActions from "@/components/admin/SignupActions"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TournamentSignupsPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      signups: {
        include: {
          team: {
            include: {
              members: true,
              captain: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!tournament) {
    notFound()
  }

  const pendingSignups = tournament.signups.filter((s: any) => s.status === "pending")
  const approvedSignups = tournament.signups.filter((s: any) => s.status === "approved")
  const rejectedSignups = tournament.signups.filter((s: any) => s.status === "rejected")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/tournaments/${id}`}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Tournament Signups</h1>
          <p className="text-gray-400 mt-1">{tournament.name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Signups</p>
              <p className="text-3xl font-bold text-white mt-1">{tournament.signups.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-white mt-1">{pendingSignups.length}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-3xl font-bold text-white mt-1">{approvedSignups.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-white mt-1">{rejectedSignups.length}</p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Pending Signups */}
      {pendingSignups.length > 0 && (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-yellow-900/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">
                Pending Approval ({pendingSignups.length})
              </h2>
            </div>
          </div>
          <div className="divide-y divide-zinc-800">
            {pendingSignups.map((signup: any) => (
              <div key={signup.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{signup.teamName}</h3>
                      {!signup.isVerified && tournament.requireEmailVerification && (
                        <span className="px-2 py-1 bg-red-900/30 border border-red-700 rounded text-xs text-red-300 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email not verified
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{signup.captainEmail}</span>
                      </div>
                      {signup.captainDiscord && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <span>Discord: {signup.captainDiscord}</span>
                        </div>
                      )}
                      <div className="text-gray-400">
                        Players: {Array.isArray(signup.playersInfo) ? signup.playersInfo.length : 0}
                      </div>
                      <div className="text-gray-500 text-xs">
                        Submitted {format(new Date(signup.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                  </div>
                  <SignupActions signupId={signup.id} tournamentId={id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Signups */}
      {approvedSignups.length > 0 && (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold text-white">
                Approved Teams ({approvedSignups.length})
              </h2>
            </div>
          </div>
          <div className="divide-y divide-zinc-800">
            {approvedSignups.map((signup: any) => (
              <div key={signup.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{signup.teamName}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{signup.captainEmail}</span>
                      </div>
                      {signup.captainDiscord && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <span>Discord: {signup.captainDiscord}</span>
                        </div>
                      )}
                      <div className="text-gray-400">
                        Players: {Array.isArray(signup.playersInfo) ? signup.playersInfo.length : 0}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-900/30 border border-green-700 rounded-full text-sm font-semibold text-green-300">
                    Approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Signups */}
      {rejectedSignups.length > 0 && (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-semibold text-white">
                Rejected ({rejectedSignups.length})
              </h2>
            </div>
          </div>
          <div className="divide-y divide-zinc-800">
            {rejectedSignups.map((signup: any) => (
              <div key={signup.id} className="p-6 opacity-60">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{signup.teamName}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{signup.captainEmail}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-900/30 border border-red-700 rounded-full text-sm font-semibold text-red-300">
                    Rejected
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tournament.signups.length === 0 && (
        <div className="bg-zinc-900 rounded-lg p-12 border border-zinc-800 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Signups Yet</h3>
          <p className="text-gray-400">
            Teams will appear here once they register for this tournament
          </p>
        </div>
      )}
    </div>
  )
}
