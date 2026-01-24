import { getCurrentUser } from "@/lib/auth-utils"

export const dynamic = 'force-dynamic'

export default async function AdminTicketsPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
        <p className="text-gray-400 mt-1">
          Manage user support requests and help tickets
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
        <p className="text-gray-400 text-lg">
          Support ticket system will be implemented in Phase 10
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This page will allow you to view, respond to, and resolve user support tickets.
        </p>
      </div>
    </div>
  )
}
