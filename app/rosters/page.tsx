import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Users } from "lucide-react"
import { DynamicColor } from "@/components/ui/DynamicColor"
import styles from "./page.module.css"

async function getRosters() {
  try {
    const rosters = await prisma.roster.findMany({
      where: { isActive: true },
      include: {
        players: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return rosters
  } catch (error) {
    console.error("Failed to fetch rosters:", error)
    return []
  }
}

export default async function RostersPage() {
  const rosters = await getRosters()

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black pointer-events-none" />

      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-[#77010F]/20 to-[#77010F]/10 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#77010F]">Our</span>
            <span className="text-white"> Rosters</span>
          </h1>
          <p className="text-xl text-gray-300">
            Meet the talented players representing Retaliation Esports
          </p>
        </div>
      </div>

      {/* Rosters Grid */}
      <div className="relative container mx-auto px-4 py-12">
        {rosters.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Active Rosters</h2>
            <p className="text-gray-400">Check back soon for our team rosters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rosters.map((roster: typeof rosters[0]) => (
              <Link
                key={roster.id}
                href={`/rosters/${roster.id}`}
                className="group bg-zinc-900 rounded-xl border border-zinc-800 hover:border-[#77010F] transition-all overflow-hidden"
              >
                {/* Roster Header with Colors */}
                <DynamicColor
                  primaryColor={roster.primaryColor}
                  secondaryColor={roster.secondaryColor || roster.primaryColor}
                  className={styles.rosterHeader}
                >
                  <div className="text-5xl font-bold text-white opacity-90 group-hover:opacity-100 transition-opacity">
                    {roster.name.charAt(0)}
                  </div>
                </DynamicColor>

                {/* Roster Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#77010F] transition-colors">
                    {roster.name}
                  </h3>
                  
                  {roster.description && (
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {roster.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {roster.players.length} {roster.players.length === 1 ? 'Player' : 'Players'}
                      </span>
                    </div>
                    <span className="text-[#77010F] group-hover:text-[#5A010C] font-medium transition-colors">
                      View Roster →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
