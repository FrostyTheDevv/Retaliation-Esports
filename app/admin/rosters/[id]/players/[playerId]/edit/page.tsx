import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import PlayerEditForm from "@/components/admin/player/PlayerEditForm"

async function getPlayer(rosterId: string, playerId: string) {
  try {
    const player = await prisma.player.findUnique({
      where: { 
        id: playerId,
        rosterId,
      },
      include: {
        roster: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return player
  } catch (error) {
    console.error("Failed to fetch player:", error)
    return null
  }
}

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string; playerId: string }>
}) {
  const user = await requireAdmin()
  if (!user) {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  const { id: rosterId, playerId } = await params

  const player = await getPlayer(rosterId, playerId)

  if (!player) {
    notFound()
  }

  return <PlayerEditForm player={player} />
}
