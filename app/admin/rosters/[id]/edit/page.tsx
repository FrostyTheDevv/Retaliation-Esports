import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import RosterEditForm from "@/components/admin/roster/RosterEditForm"

async function getRoster(id: string) {
  try {
    const roster = await prisma.roster.findUnique({
      where: { id },
      include: {
        players: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    })
    return roster
  } catch (error) {
    console.error("Failed to fetch roster:", error)
    return null
  }
}

export default async function EditRosterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    await requireAdmin()
  } catch (error) {
    redirect("/auth/signin")
  }

  const { id } = await params
  const roster = await getRoster(id)

  if (!roster) {
    notFound()
  }

  return <RosterEditForm roster={roster} />
}
