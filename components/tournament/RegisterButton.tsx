"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2 } from "lucide-react"

interface RegisterButtonProps {
  tournamentId: string
}

export default function RegisterButton({ tournamentId }: RegisterButtonProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    teamName: "",
    username: "",
    password: "",
    confirmPassword: "",
    captainEmail: "",
    captainDiscord: "",
    acceptTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

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
          username: formData.username,
          password: formData.password,
          captainEmail: formData.captainEmail,
          captainDiscord: formData.captainDiscord,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register")
      }

      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-[#77010F] hover:bg-[#550008] text-white font-bold py-3 px-8 rounded-lg transition-colors"
      >
        Register Now
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

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                    placeholder="Choose a username"
                  />
                  <p className="text-xs text-gray-400 mt-1">Use this to log in and manage your registration</p>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                    placeholder="Re-enter password"
                  />
                </div>

                {/* Captain Email */}
                <div>
                  <label htmlFor="captainEmail" className="block text-sm font-medium text-gray-300 mb-2">
                    Captain Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="captainEmail"
                    required
                    value={formData.captainEmail}
                    onChange={(e) => setFormData({ ...formData, captainEmail: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                    placeholder="captain@example.com"
                  />
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
