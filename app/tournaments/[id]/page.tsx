import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Users, Trophy, ExternalLink, Clock, Award } from "lucide-react"
import RegisterButton from "@/components/tournament/RegisterButton"

async function getTournament(id: string) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
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
      }
    })

    return tournament
  } catch (error) {
    console.error("Failed to fetch tournament:", error)
    return null
  }
}

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tournament = await getTournament(id)

  if (!tournament) {
    notFound()
  }

  const registeredTeams = tournament._count.signups
  const spotsLeft = (tournament.maxTeams ?? Infinity) - registeredTeams
  const isFull = spotsLeft <= 0
  const isOpen = tournament.status === "open"
  const registrationClosed = new Date() > new Date(tournament.registrationDeadline)
  const canRegister = isOpen && !registrationClosed && !isFull

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black pointer-events-none" />
      
      {/* Hero Section with Banner */}
      <div className="relative">
        {tournament.bannerImage ? (
          <div className="relative h-96 w-full">
            <Image
              src={tournament.bannerImage}
              alt={tournament.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          </div>
        ) : (
          <div className="h-96 bg-linear-to-b from-[#77010F]/20 via-black to-black">
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          </div>
        )}

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4 py-8">
            <Link
              href="/tournaments"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              ← Back to Tournaments
            </Link>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    tournament.status === "open" 
                      ? "bg-[#77010F]/20 text-[#77010F] border border-[#77010F]/30"
                      : tournament.status === "ongoing"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                  }`}>
                    {tournament.status === "open" ? "Registration Open" : tournament.status === "ongoing" ? "In Progress" : "Completed"}
                  </span>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-zinc-800 text-gray-300">
                    {tournament.gameMode.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-zinc-800 text-gray-300">
                    {tournament.format === "single-elimination" ? "Single Elim" : "Double Elim"}
                  </span>
                </div>

                <h1 className="text-5xl font-bold mb-2">
                  <span className="text-[#77010F]">{tournament.name.split(' ')[0]}</span>
                  <span className="text-white"> {tournament.name.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-xl text-gray-300">
                  {registeredTeams}/{tournament.maxTeams} Teams Registered
                </p>
              </div>

              {canRegister && (
                <RegisterButton tournamentId={tournament.id} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About Tournament</h2>
              <div 
                className="text-gray-300 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: tournament.description }}
              />
            </div>

            {/* Gallery */}
            {tournament.images && (tournament.images as string[]).length > 0 && (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(tournament.images as string[]).map((imageUrl, index) => (
                    <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prize Information */}
            {tournament.prizeInfo && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  <h2 className="text-2xl font-bold text-white">Prize Pool</h2>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{tournament.prizeInfo}</p>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Tournament Info */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Tournament Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-white font-medium">
                      {new Date(tournament.startDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Registration Deadline</p>
                    <p className="text-white font-medium">
                      {new Date(tournament.registrationDeadline).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Teams</p>
                    <p className="text-white font-medium">
                      {registeredTeams}/{tournament.maxTeams}
                      {!isFull && canRegister && (
                        <span className="text-green-400 text-sm ml-2">({spotsLeft} spots left)</span>
                      )}
                      {isFull && <span className="text-red-400 text-sm ml-2">(Full)</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Trophy className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Format</p>
                    <p className="text-white font-medium">
                      {tournament.format === "single-elimination" ? "Single Elimination" : "Double Elimination"}
                      {" "}(BO{tournament.bestOf})
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* External Links */}
            {(tournament.discordLink || tournament.rulesLink || tournament.streamLink) && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Links</h3>
                <div className="space-y-3">
                  {tournament.discordLink && (
                    <a
                      href={tournament.discordLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span>Discord Server</span>
                    </a>
                  )}
                  {tournament.rulesLink && (
                    <a
                      href={tournament.rulesLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span>Rules Document</span>
                    </a>
                  )}
                  {tournament.streamLink && (
                    <a
                      href={tournament.streamLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span>Live Stream</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Registration Status */}
            {!canRegister && (
              <div className={`rounded-xl border p-6 ${
                isFull 
                  ? "bg-red-500/10 border-red-500/30"
                  : registrationClosed
                  ? "bg-yellow-500/10 border-yellow-500/30"
                  : "bg-gray-800/50 border-gray-700"
              }`}>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isFull ? "Tournament Full" : registrationClosed ? "Registration Closed" : "Registration Not Available"}
                </h3>
                <p className="text-gray-300 text-sm">
                  {isFull 
                    ? "All spots have been filled for this tournament."
                    : registrationClosed
                    ? "Registration period has ended."
                    : "Registration is not currently open."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
