import { requireAdmin } from "@/lib/auth-utils"
import TournamentForm from "@/components/admin/TournamentForm"

export default async function NewTournamentPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Create New Tournament</h1>
        <p className="text-gray-400 mt-1">
          Fill in the details to create a new tournament
        </p>
      </div>

      <TournamentForm />
    </div>
  )
}
