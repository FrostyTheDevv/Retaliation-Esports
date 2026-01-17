import { getCurrentUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import styles from "./page.module.css"

async function getRosters() {
  try {
    const rosters = await prisma.roster.findMany({
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

export default async function AdminRostersPage() {
  const user = await getCurrentUser()
  const rosters = await getRosters()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Roster Management</h1>
          <p className="text-gray-400 mt-1">
            Create and manage team rosters with player details
          </p>
        </div>
        <Link
          href="/admin/rosters/new"
          className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Roster</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rosters..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
            />
          </div>
          <select 
            aria-label="Filter by status"
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select 
            aria-label="Sort by"
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Rosters Grid */}
      {rosters.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Rosters Yet</h3>
            <p className="text-gray-400 mb-6">
              Get started by creating your first team roster. Add players, customize colors, and showcase your teams.
            </p>
            <Link
              href="/admin/rosters/new"
              className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Roster</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rosters.map((roster: typeof rosters[0]) => (
            <Link
              key={roster.id}
              href={`/admin/rosters/${roster.id}/edit`}
              className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden group"
            >
              {/* Roster Header with Colors */}
              {/* eslint-disable-next-line no-inline-styles */}
              <div
                className={styles.rosterHeader}
                style={
                  {
                    '--primary-color': roster.primaryColor,
                    '--secondary-color': roster.secondaryColor || roster.primaryColor,
                  } as React.CSSProperties
                }
              >
                {roster.image ? (
                  <Image
                    src={roster.image}
                    alt={roster.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-4xl font-bold text-white opacity-50">
                    {roster.name.charAt(0)}
                  </div>
                )}
                {!roster.isActive && (
                  <div className="absolute top-2 right-2 bg-gray-900/80 text-gray-400 text-xs px-2 py-1 rounded">
                    Inactive
                  </div>
                )}
              </div>

              {/* Roster Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                  {roster.name}
                </h3>
                {roster.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {roster.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {roster.players.length} {roster.players.length === 1 ? 'Player' : 'Players'}
                  </span>
                  <span className="text-brand-secondary font-medium">
                    Edit →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

