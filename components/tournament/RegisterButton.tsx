"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2 } from "lucide-react"
import { useUser } from "@/contexts/UserContext"

interface RegisterButtonProps {
  tournamentId: string
}

export default function RegisterButton({ tournamentId }: RegisterButtonProps) {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    teamName: "",
    captainDiscord: "",
    playersInfo: "",
    acceptTerms: false,
  })

  const handleButtonClick = () => {
    if (!user) {
      // Redirect to signin with return URL
      router.push(`/signin?returnUrl=/tournaments/${tournamentId}`)
      return
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamName: formData.teamName,
          captainDiscord: formData.captainDiscord,
          playersInfo: formData.playersInfo ? JSON.parse(formData.playersInfo) : [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register")
      }

      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) {
    return (
      <button
        disabled
        className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg cursor-not-allowed"
      >
        Loading...
      </button>
    )
  }

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="bg-[#77010F] hover:bg-[#550008] text-white font-bold py-3 px-8 rounded-lg transition-colors"
      >
        {user ? "Register Now" : "Sign In to Register"}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Register Team</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close registration modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            {success ? (
              <div className="p-6">
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 text-center">
                  <h3 className="text-green-400 font-bold text-lg mb-2">✓ Registration Successful!</h3>
                  <p className="text-gray-300">
                    Your team has been registered. Please wait for admin approval.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Team Name */}
                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    required
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                    placeholder="Enter team name"
                  />
                </div>

                {/* Captain Email (Pre-filled) */}
                <div>
                  <label htmlFor="captainEmail" className="block text-sm font-medium text-gray-300 mb-2">
                    Captain Email
                  </label>
                  <input
                    type="email"
                    id="captainEmail"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Using your account email</p>
                </div>

                {/* Captain Discord */}
                <div>
                  <label htmlFor="captainDiscord" className="block text-sm font-medium text-gray-300 mb-2">
                    Captain Discord (Optional)
                  </label>
                  <input
                    type="text"
                    id="captainDiscord"
                    value={formData.captainDiscord}
                    onChange={(e) => setFormData({ ...formData, captainDiscord: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                    placeholder="username#1234"
                  />
                </div>

                {/* Players Info */}
                <div>
                  <label htmlFor="playersInfo" className="block text-sm font-medium text-gray-300 mb-2">
                    Player Information (Optional)
                  </label>
                  <textarea
                    id="playersInfo"
                    value={formData.playersInfo}
                    onChange={(e) => setFormData({ ...formData, playersInfo: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#77010F] min-h-25"
                    placeholder='Optional: Add player names and info as JSON array, e.g., [{"name": "Player1", "discord": "player1#1234"}]'
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave blank if not needed</p>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-700 bg-black mt-0.5"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-300">
                    I accept the tournament rules and terms & conditions
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#77010F] hover:bg-[#550008] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
