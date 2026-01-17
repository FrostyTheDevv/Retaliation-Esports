import { getCurrentUser } from "@/lib/auth-utils"

export default async function AdminTournamentsPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tournament Management</h1>
          <p className="text-gray-400 mt-1">
            Create and manage tournaments with bracket generation
          </p>
        </div>
        <button className="bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Create New Tournament
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
        <p className="text-gray-400 text-lg">
          Tournament management will be implemented in Phase 4
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This page will allow you to create tournaments, manage signups, generate brackets, and track match results.
        </p>
      </div>
    </div>
  )
}
