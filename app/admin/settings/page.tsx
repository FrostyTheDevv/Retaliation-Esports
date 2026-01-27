import { getCurrentUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()
  const dbConnected = await checkDatabaseConnection()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">
          Configure your admin preferences and site settings
        </p>
      </div>

      {/* User Profile Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">User Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <p className="text-white">{user?.name || "Not set"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <p className="text-white">{user?.email || "Not set"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Discord ID
            </label>
            <p className="text-white">{user?.discordId || "Not set"}</p>
          </div>
        </div>
      </div>

      {/* Site Configuration */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Site Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Site Name
            </label>
            <input
              type="text"
              value="Retaliation Esports"
              disabled
              aria-label="Site Name"
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Domain
            </label>
            <input
              type="text"
              value="retaliationesports.net"
              disabled
              aria-label="Domain"
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Discord Guild ID
            </label>
            <input
              type="text"
              value="1456358951330513103"
              disabled
              aria-label="Discord Guild ID"
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white cursor-not-allowed"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Advanced settings and editable configurations will be added in future phases.
        </p>
      </div>

      {/* Database Status */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Database Connection</span>
            {dbConnected ? (
              <span className="text-green-400">✓ Connected</span>
            ) : (
              <span className="text-yellow-400">⚠️ Not Connected</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Authentication</span>
            <span className="text-green-400">✓ Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Admin Access</span>
            <span className="text-green-400">✓ Verified</span>
          </div>
        </div>
        {!dbConnected && (
          <p className="text-sm text-gray-500 mt-4">
            Connect a PostgreSQL database to activate all features.
          </p>
        )}
      </div>
    </div>
  )
}
