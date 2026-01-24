import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Users, Trophy, Clock } from "lucide-react"

async function getTournaments() {
  try {
    const tournaments = await prisma.tournament.findMany({
      where: {
        status: {
          in: ["open", "ongoing"]
        }
      },
      include: {
        _count: {
          select: {
            signups: {
              where: {
                status: "approved"
              }
            }
          }
        }
      },
      orderBy: [
        { status: "asc" },
        { startDate: "asc" }
      ]
    })

    return tournaments
  } catch (error) {
    console.error("Failed to fetch tournaments:", error)
    return []
  }
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments()

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black pointer-events-none" />
      
      {/* Header */}
      <div className="relative bg-zinc-900/50 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-white mb-4">Tournaments</h1>
          <p className="text-xl text-gray-400">
            Join competitive tournaments and prove your skills
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {tournaments.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Active Tournaments</h2>
            <p className="text-gray-400">
              Check back soon for upcoming tournaments!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => {
              const registeredTeams = tournament._count.signups
              const spotsLeft = (tournament.maxTeams ?? Infinity) - registeredTeams
              const isFull = spotsLeft <= 0
              const isOpen = tournament.status === "open"
              const registrationClosed = new Date() > new Date(tournament.registrationDeadline)

              return (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                  className="group bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-all overflow-hidden"
                >
                  {/* Banner */}
                  {tournament.bannerImage ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={tournament.bannerImage}
                        alt={tournament.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-linear-to-b from-[#77010F]/20 via-black to-black flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-white/50" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        tournament.status === "open" 
                          ? "bg-[#77010F]/20 text-[#77010F] border border-[#77010F]/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}>
                        {tournament.status === "open" ? "Registration Open" : "Ongoing"}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-gray-300">
                        {tournament.gameMode.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#77010F] transition-colors">
                      {tournament.name}
                    </h3>

                    {/* Description Preview */}
                    {tournament.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {tournament.description.replace(/<[^>]*>/g, '')}
                      </p>
                    )}

                    {/* Info Grid */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{registeredTeams}/{tournament.maxTeams} Teams</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          Registration closes {new Date(tournament.registrationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isOpen && !registrationClosed && !isFull ? (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <span className="text-green-400 font-medium text-sm">
                          {spotsLeft} spots left
                        </span>
                        <span className="text-[#77010F] group-hover:text-white font-semibold transition-colors">
                          Register Now →
                        </span>
                      </div>
                    ) : isFull ? (
                      <div className="pt-4 border-t border-gray-700">
                        <span className="text-gray-500 font-medium text-sm">Tournament Full</span>
                      </div>
                    ) : registrationClosed ? (
                      <div className="pt-4 border-t border-gray-700">
                        <span className="text-gray-500 font-medium text-sm">Registration Closed</span>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-gray-700">
                        <span className="text-gray-400 font-medium text-sm">View Details →</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
