"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface BracketGeneratorProps {
  tournamentId: string
  format: string
  teamCount: number
  isRegenerate?: boolean
}

export default function BracketGenerator({
  tournamentId,
  format,
  teamCount,
  isRegenerate = false,
}: BracketGeneratorProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [randomize, setRandomize] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleGenerate() {
    if (isRegenerate && !showConfirm) {
      setShowConfirm(true)
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch(
        `/api/admin/tournaments/${tournamentId}/generate-bracket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            format,
            randomize,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate bracket")
      }

      alert(
        `Bracket generated successfully! Created ${data.matchCount} matches.`
      )
      router.refresh()
      setShowConfirm(false)
    } catch (error: any) {
      alert(error.message || "Failed to generate bracket")
    } finally {
      setIsGenerating(false)
    }
  }

  if (isRegenerate) {
    return (
      <div>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            disabled={isGenerating}
          >
            Regenerate Bracket
          </button>
        ) : (
          <div className="bg-red-900/30 border border-red-600 rounded p-4">
            <p className="text-red-400 mb-4">
              Are you sure? This will delete all existing matches and scores.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isGenerating ? "Regenerating..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gray-700 p-6 rounded-lg mb-6">
        <h3 className="font-bold mb-4">Bracket Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Format</label>
            <div className="text-white font-medium capitalize">
              {format.replace("-", " ")}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Teams</label>
            <div className="text-white font-medium">{teamCount} approved teams</div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="randomize"
              checked={randomize}
              onChange={(e) => setRandomize(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="randomize" className="text-white cursor-pointer">
              Randomize team seeding
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full px-6 py-3 bg-[#77010F] text-white rounded-lg hover:bg-[#5a0008] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? "Generating Bracket..." : "Generate Bracket"}
      </button>
    </div>
  )
}
