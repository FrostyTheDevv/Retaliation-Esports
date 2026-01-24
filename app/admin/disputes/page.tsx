import Link from "next/link"
import { prisma } from "@/lib/prisma"
import DisputeCard from "@/components/admin/DisputeCard"

export const dynamic = 'force-dynamic'

export default async function DisputesPage() {
  const disputes = await prisma.dispute.findMany({
    include: {
      match: {
        include: {
          tournament: true,
          team1: true,
          team2: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const pending = disputes.filter((d: any) => d.status === "pending")
  const underReview = disputes.filter((d: any) => d.status === "under_review")
  const resolved = disputes.filter((d: any) => d.status === "resolved")
  const dismissed = disputes.filter((d: any) => d.status === "dismissed")

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dispute Resolution</h1>
            <p className="text-gray-400 mt-1">
              Review and resolve match disputes
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-yellow-900/30 border border-yellow-600 p-6 rounded-lg">
            <div className="text-yellow-400 text-sm">Pending Review</div>
            <div className="text-3xl font-bold mt-2">{pending.length}</div>
          </div>

          <div className="bg-blue-900/30 border border-blue-600 p-6 rounded-lg">
            <div className="text-blue-400 text-sm">Under Review</div>
            <div className="text-3xl font-bold mt-2">{underReview.length}</div>
          </div>

          <div className="bg-green-900/30 border border-green-600 p-6 rounded-lg">
            <div className="text-green-400 text-sm">Resolved</div>
            <div className="text-3xl font-bold mt-2">{resolved.length}</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-gray-400 text-sm">Dismissed</div>
            <div className="text-3xl font-bold mt-2">{dismissed.length}</div>
          </div>
        </div>

        {/* Pending Disputes */}
        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">⚠️ Pending Review</h2>
            <div className="space-y-4">
              {pending.map((dispute: any) => (
                <DisputeCard key={dispute.id} dispute={dispute} />
              ))}
            </div>
          </div>
        )}

        {/* Under Review */}
        {underReview.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">🔍 Under Review</h2>
            <div className="space-y-4">
              {underReview.map((dispute: any) => (
                <DisputeCard key={dispute.id} dispute={dispute} />
              ))}
            </div>
          </div>
        )}

        {/* Resolved */}
        {resolved.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">✅ Resolved</h2>
            <div className="space-y-4">
              {resolved.map((dispute: any) => (
                <DisputeCard key={dispute.id} dispute={dispute} />
              ))}
            </div>
          </div>
        )}

        {/* Dismissed */}
        {dismissed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">❌ Dismissed</h2>
            <div className="space-y-4">
              {dismissed.map((dispute: any) => (
                <DisputeCard key={dispute.id} dispute={dispute} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {disputes.length === 0 && (
          <div className="bg-gray-800 p-12 rounded-lg text-center">
            <p className="text-gray-400 text-lg">No disputes to review</p>
          </div>
        )}
      </div>
    </div>
  )
}
