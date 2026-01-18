"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface SignupActionsProps {
  signupId: string
  tournamentId: string
}

export default function SignupActions({ signupId, tournamentId }: SignupActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: "approve" | "reject") => {
    if (isLoading) return

    try {
      setIsLoading(true)

      const response = await fetch(`/api/admin/tournaments/${tournamentId}/signups/${signupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${action} signup`)
      }

      router.refresh()
    } catch (error) {
      console.error(`Failed to ${action} signup:`, error)
      alert(error instanceof Error ? error.message : `Failed to ${action} signup`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction("approve")}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-700 text-green-300 font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        Approve
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-700 text-red-300 font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <XCircle className="w-4 h-4" />
        )}
        Reject
      </button>
    </div>
  )
}
