import { getCurrentUser } from "@/lib/auth-utils"

export default async function AdminTeamsPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 mt-1">
            View and manage tournament teams and signups
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
        <p className="text-gray-400 text-lg">
          Team management will be implemented in Phase 4
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This page will display all teams that have signed up for tournaments, including their rosters and captain information.
        </p>
      </div>
    </div>
  )
}
