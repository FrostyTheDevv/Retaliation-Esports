import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Twitter, Twitch as TwitchIcon, Youtube, Instagram, MessageCircle, Gamepad2 } from "lucide-react"
import styles from "./page.module.css"

async function getRoster(id: string) {
  try {
    const roster = await prisma.roster.findUnique({
      where: { id, isActive: true },
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

export default async function RosterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const roster = await getRoster(id)

  if (!roster) {
    notFound()
  }

  return (
    /* eslint-disable-next-line suggestCanonicalClasses */
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black">
      {/* Hero Section with Roster Colors */}
      {/* eslint-disable-next-line no-inline-styles */}
      <div
        className={styles.rosterHero}
        style={{
          '--primary-color': roster.primaryColor,
          '--secondary-color': roster.secondaryColor || roster.primaryColor,
        } as React.CSSProperties}
      >
        <div className="container mx-auto px-4 py-16">
          <Link
            href="/rosters"
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Rosters</span>
          </Link>

          <div className="flex items-center space-x-6">
            {roster.image && (
              <Image
                src={roster.image}
                alt={roster.name}
                width={120}
                height={120}
                className="rounded-xl object-cover"
              />
            )}
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">{roster.name}</h1>
              {roster.description && (
                <p className="text-xl text-white/90 max-w-3xl">
                  {roster.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Players Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">
          Team Roster ({roster.players.length})
        </h2>

        {roster.players.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No players on this roster yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roster.players.map((player) => (
              <div
                key={player.id}
                className="bg-gray-800/50 rounded-xl border border-gray-700 hover:border-brand-primary transition-all overflow-hidden"
              >
                {/* Player Image */}
                {player.image && (
                  <div className="aspect-square relative bg-gray-900">
                    <Image
                      src={player.image}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Player Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{player.name}</h3>
                  
                  {player.inGameName && (
                    <p className="text-brand-primary font-semibold mb-2">
                      {player.inGameName}
                    </p>
                  )}

                  {player.role && (
                    <p className="text-gray-400 text-sm mb-4">
                      {player.role}
                    </p>
                  )}

                  {player.bio && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {player.bio}
                    </p>
                  )}

                  {/* Stats */}
                  {(player.goals !== null || player.assists !== null || player.saves !== null) && (
                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg">
                      {player.goals !== null && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-primary">{player.goals}</div>
                          <div className="text-xs text-gray-400">Goals</div>
                        </div>
                      )}
                      {player.assists !== null && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-secondary">{player.assists}</div>
                          <div className="text-xs text-gray-400">Assists</div>
                        </div>
                      )}
                      {player.saves !== null && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">{player.saves}</div>
                          <div className="text-xs text-gray-400">Saves</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {player.twitter && (
                      <a
                        href={player.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-900 hover:bg-blue-500 rounded-lg transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {player.twitch && (
                      <a
                        href={player.twitch}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-900 hover:bg-purple-500 rounded-lg transition-colors"
                        aria-label="Twitch"
                      >
                        <TwitchIcon className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {player.youtube && (
                      <a
                        href={player.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-900 hover:bg-red-500 rounded-lg transition-colors"
                        aria-label="YouTube"
                      >
                        <Youtube className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {player.instagram && (
                      <a
                        href={player.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-900 hover:bg-pink-500 rounded-lg transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {player.discord && (
                      <div
                        className="p-2 bg-gray-900 rounded-lg flex items-center gap-2"
                        title={player.discord}
                      >
                        <MessageCircle className="w-4 h-4 text-white" />
                        <span className="text-xs text-gray-400">{player.discord}</span>
                      </div>
                    )}
                    {player.steam && (
                      <a
                        href={player.steam}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-900 hover:bg-blue-600 rounded-lg transition-colors"
                        aria-label="Steam"
                      >
                        <Gamepad2 className="w-4 h-4 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
