import { getCurrentUser } from "@/lib/auth-utils"

export default async function AdminFAQPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">FAQ Management</h1>
          <p className="text-gray-400 mt-1">
            Create and manage frequently asked questions
          </p>
        </div>
        <button className="bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Add New FAQ
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
        <p className="text-gray-400 text-lg">
          FAQ management will be implemented in Phase 10
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This page will allow you to create, edit, and organize FAQ entries for the public support page.
        </p>
      </div>
    </div>
  )
}
