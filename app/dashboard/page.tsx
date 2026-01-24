import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserSession } from "@/lib/user-auth"
import { prisma } from "@/lib/prisma"
import SignOutButton from "@/components/auth/SignOutButton"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getUserSession()

  if (!session) {
    redirect("/signin?returnUrl=/dashboard")
  }

  const { user } = session

  // Fetch user's tournament registrations
  const registrations = await prisma.tournamentSignup.findMany({
    where: {
      userId: user.id,
    },
    include: {
      tournament: {
        select: {
          id: true,
          name: true,
          startDate: true,
          status: true,
          bannerImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/50",
    approved: "bg-green-500/10 text-green-500 border-green-500/50",
    rejected: "bg-red-500/10 text-red-500 border-red-500/50",
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back, <span className="text-white font-semibold">{user.username}</span>
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]">
              Profile
            </h2>
            <SignOutButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Username</p>
              <p className="text-white font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Member Since</p>
              <p className="text-white font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Discord</p>
              <p className="text-white font-medium">
                {user.discordId ? "Linked" : "Not linked"}
              </p>
            </div>
          </div>
        </div>

        {/* Tournament Registrations */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]">
            Tournament Registrations
          </h2>

          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">You haven&apos;t registered for any tournaments yet.</p>
              <Link
                href="/tournaments"
                className="inline-block bg-[#77010F] hover:bg-[#5A010C] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse Tournaments
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-black rounded-lg p-4 border border-zinc-800">
                  <p className="text-gray-400 text-sm mb-1">Total</p>
                  <p className="text-2xl font-bold text-white">{registrations.length}</p>
                </div>
                <div className="bg-black rounded-lg p-4 border border-zinc-800">
                  <p className="text-gray-400 text-sm mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-500">
                    {registrations.filter((r) => r.status === "approved").length}
                  </p>
                </div>
                <div className="bg-black rounded-lg p-4 border border-zinc-800">
                  <p className="text-gray-400 text-sm mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {registrations.filter((r) => r.status === "pending").length}
                  </p>
                </div>
              </div>

              {/* Registration List */}
              <div className="space-y-3">
                {registrations.map((registration) => (
                  <Link
                    key={registration.id}
                    href={`/tournaments/${registration.tournament.id}`}
                    className="block bg-black rounded-lg border border-zinc-800 hover:border-[#77010F] transition-colors p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {registration.tournament.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          Team: <span className="text-white font-medium">{registration.teamName}</span>
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">
                            Registered{" "}
                            {new Date(registration.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {registration.tournament.startDate && (
                            <span className="text-gray-500">
                              Starts{" "}
                              {new Date(registration.tournament.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                            statusColors[registration.status as keyof typeof statusColors]
                          }`}
                        >
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4 flex-wrap">
          <Link
            href="/tournaments"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Tournaments
          </Link>
          <Link
            href="/support"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  )
}
