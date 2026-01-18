import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import TournamentForm from "@/components/admin/TournamentForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditTournamentPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params

  const tournament = await prisma.tournament.findUnique({
    where: { id },
  })

  if (!tournament) {
    notFound()
  }

  // Convert dates to string format for form
  const formData = {
    id: tournament.id,
    name: tournament.name,
    description: tournament.description,
    gameMode: tournament.gameMode as "1v1" | "2v2" | "3v3" | "5v5",
    format: tournament.format as "single-elimination" | "double-elimination",
    maxTeams: tournament.maxTeams || 16,
    bestOf: tournament.bestOf,
    startDate: new Date(tournament.startDate).toISOString().slice(0, 16),
    registrationDeadline: new Date(tournament.registrationDeadline).toISOString().slice(0, 16),
    discordLink: tournament.discordLink || "",
    rulesLink: tournament.rulesLink || "",
    streamLink: tournament.streamLink || "",
    prizeInfo: tournament.prizeInfo || "",
    requireEmailVerification: tournament.requireEmailVerification,
    allowRandomize: tournament.allowRandomize,
    checkInEnabled: tournament.checkInEnabled,
    status: tournament.status as "draft" | "open",
    bannerUrl: tournament.bannerImage,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Tournament</h1>
        <p className="text-gray-400 mt-1">
          Update tournament details and settings
        </p>
      </div>

      <TournamentForm initialData={formData} />
    </div>
  )
}
