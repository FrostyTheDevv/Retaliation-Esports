"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface DisputeCardProps {
  dispute: any
}

export default function DisputeCard({ dispute }: DisputeCardProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [action, setAction] = useState<string>("")
  const [resolution, setResolution] = useState("")
  const [reviewNotes, setReviewNotes] = useState("")

  async function handleReview(newStatus: string) {
    try {
      const response = await fetch(`/api/admin/disputes/${dispute.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update dispute status")
      }

      router.refresh()
    } catch (error) {
      alert("Failed to update dispute")
    }
  }

  async function handleResolve() {
    if (!action || !resolution) {
      alert("Please select an action and provide resolution details")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/admin/disputes/${dispute.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "resolved",
          action,
          resolution,
          reviewNotes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to resolve dispute")
      }

      alert("Dispute resolved successfully")
      setShowModal(false)
      router.refresh()
    } catch (error) {
      alert("Failed to resolve dispute")
    } finally {
      setIsProcessing(false)
    }
  }

  function getCategoryLabel(category: string) {
    const labels: Record<string, string> = {
      score_incorrect: "Incorrect Score",
      no_show: "No Show",
      technical_issue: "Technical Issue",
      rule_violation: "Rule Violation",
      other: "Other",
    }
    return labels[category] || category
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      pending: "bg-yellow-600",
      under_review: "bg-blue-600",
      resolved: "bg-green-600",
      dismissed: "bg-gray-600",
    }
    return colors[status] || "bg-gray-600"
  }

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700 hover:border-[#77010F] transition">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`${getStatusColor(dispute.status)} text-white text-xs px-3 py-1 rounded-full uppercase font-semibold`}
              >
                {dispute.status.replace("_", " ")}
              </span>
              <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded">
                {getCategoryLabel(dispute.category)}
              </span>
            </div>

            <h3 className="text-lg font-bold">
              {dispute.match.tournament.name} - Match {dispute.match.matchNumber}
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              {dispute.match.team1?.name} vs {dispute.match.team2?.name}
            </p>

            <p className="text-gray-400 text-sm">
              Filed by: {
                dispute.reportedByTeamId === dispute.match.team1Id 
                  ? dispute.match.team1?.name 
                  : dispute.reportedByTeamId === dispute.match.team2Id
                    ? dispute.match.team2?.name
                    : "Unknown Team"
              }
            </p>

            <p className="text-gray-400 text-sm">
              Filed: {format(new Date(dispute.createdAt), "MMM d, yyyy h:mm a")}
            </p>
          </div>

          {dispute.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleReview("under_review")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Review
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-[#77010F] text-white rounded hover:bg-[#5a0008]"
              >
                Resolve
              </button>
            </div>
          )}

          {dispute.status === "under_review" && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-[#77010F] text-white rounded hover:bg-[#5a0008]"
            >
              Resolve
            </button>
          )}
        </div>

        {/* Dispute Details */}
        <div className="bg-gray-700 p-4 rounded mb-4">
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-gray-300 whitespace-pre-wrap">
            {dispute.description}
          </p>
        </div>

        {/* Original Match Result */}
        <div className="bg-gray-700 p-4 rounded mb-4">
          <h4 className="font-semibold mb-2">Original Result</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">
                {dispute.match.team1?.name}
              </p>
              <p className="text-2xl font-bold">
                {dispute.originalTeam1Score}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {dispute.match.team2?.name}
              </p>
              <p className="text-2xl font-bold">
                {dispute.originalTeam2Score}
              </p>
            </div>
          </div>
          <p className="text-green-400 mt-2">
            Winner: {
              dispute.match.winnerId === dispute.match.team1Id 
                ? dispute.match.team1?.name 
                : dispute.match.winnerId === dispute.match.team2Id
                  ? dispute.match.team2?.name
                  : "None"
            }
          </p>
        </div>

        {/* Evidence */}
        {dispute.evidence && dispute.evidence.length > 0 && (
          <div className="bg-gray-700 p-4 rounded">
            <h4 className="font-semibold mb-2">Evidence</h4>
            <div className="flex gap-2 flex-wrap">
              {dispute.evidence.map((url: string, idx: number) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Evidence {idx + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Resolution (if resolved) */}
        {dispute.status === "resolved" && dispute.resolution && (
          <div className="bg-green-900/30 border border-green-600 p-4 rounded mt-4">
            <h4 className="font-semibold text-green-400 mb-2">Resolution</h4>
            <p className="text-sm mb-2">
              <strong>Action:</strong> {dispute.action}
            </p>
            <p className="text-gray-300">{dispute.resolution}</p>
            {dispute.reviewNotes && (
              <p className="text-sm text-gray-400 mt-2">
                Notes: {dispute.reviewNotes}
              </p>
            )}
            <p className="text-sm text-gray-400 mt-2">
              Resolved:{" "}
              {format(new Date(dispute.reviewedAt), "MMM d, yyyy h:mm a")}
            </p>
          </div>
        )}

        {dispute.status === "dismissed" && (
          <div className="bg-gray-700 p-4 rounded mt-4">
            <p className="text-gray-400">
              This dispute was dismissed
              {dispute.reviewNotes && `: ${dispute.reviewNotes}`}
            </p>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Resolve Dispute</h3>

            {/* Action Selection */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Action *
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                aria-label="Dispute action"
              >
                <option value="">Select action...</option>
                <option value="overturn">Overturn Result</option>
                <option value="uphold">Uphold Original Result</option>
                <option value="rematch">Schedule Rematch</option>
                <option value="disqualify">Disqualify Team</option>
                <option value="no_action">No Action Required</option>
              </select>
            </div>

            {/* Resolution */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Resolution Details *
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded h-32"
                placeholder="Explain the resolution..."
              />
            </div>

            {/* Review Notes */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Internal Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded h-24"
                placeholder="Internal notes for admin records..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleResolve}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-[#77010F] text-white rounded hover:bg-[#5a0008] disabled:opacity-50"
              >
                {isProcessing ? "Resolving..." : "Resolve Dispute"}
              </button>
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to dismiss this dispute?")) {
                    await handleReview("dismissed")
                    setShowModal(false)
                  }
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Dismiss
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
