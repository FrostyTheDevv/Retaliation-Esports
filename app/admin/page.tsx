import { getCurrentUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { 
  Users, 
  Trophy, 
  Shield, 
  Calendar,
  TrendingUp 
} from "lucide-react"

export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  const [
    totalRosters,
    totalTournaments,
    activeTournaments,
    totalSignups,
  ] = await Promise.all([
    prisma.roster.count({ where: { isActive: true } }),
    prisma.tournament.count(),
    prisma.tournament.count({ where: { status: { in: ['open', 'ongoing'] } } }),
    prisma.tournamentSignup.count(),
  ])

  return {
    totalRosters,
    totalTournaments,
    activeTournaments,
    totalSignups,
  }
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Active Rosters",
      value: stats.totalRosters,
      icon: Shield,
      color: "bg-brand-primary",
      trend: "+2 this month",
    },
    {
      title: "Total Tournaments",
      value: stats.totalTournaments,
      icon: Trophy,
      color: "bg-brand-secondary",
      trend: "+1 this week",
    },
    {
      title: "Active Tournaments",
      value: stats.activeTournaments,
      icon: Calendar,
      color: "bg-brand-accent",
      trend: "Ongoing",
    },
    {
      title: "Total Signups",
      value: stats.totalSignups,
      icon: Users,
      color: "bg-green-500",
      trend: `+${stats.totalSignups} all time`,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name || "Admin"}!
        </h1>
        <p className="text-gray-400 mt-1">
          Here's what's happening with Retaliation Esports today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/rosters"
            className="bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
          >
            Manage Rosters
          </a>
          <a
            href="/admin/tournaments"
            className="bg-brand-secondary hover:bg-brand-secondary/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
          >
            Create Tournament
          </a>
          <a
            href="/admin/teams"
            className="bg-brand-accent hover:bg-brand-accent/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
          >
            View Teams
          </a>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <p className="text-gray-400 text-center py-8">
          No recent activity to display
        </p>
      </div>
    </div>
  )
}
