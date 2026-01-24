"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function NewPlayerPage() {
  const router = useRouter()
  const params = useParams()
  const rosterId = params.id as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    inGameName: "",
    role: "",
    bio: "",
    image: "",
    // Stats
    goals: "",
    assists: "",
    saves: "",
    // Social Links
    twitter: "",
    twitch: "",
    youtube: "",
    instagram: "",
    discord: "",
    steam: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const payload = {
        name: formData.name,
        inGameName: formData.inGameName || null,
        role: formData.role || null,
        bio: formData.bio || null,
        image: formData.image || null,
        goals: formData.goals ? parseInt(formData.goals) : null,
        assists: formData.assists ? parseInt(formData.assists) : null,
        saves: formData.saves ? parseInt(formData.saves) : null,
        twitter: formData.twitter || null,
        twitch: formData.twitch || null,
        youtube: formData.youtube || null,
        instagram: formData.instagram || null,
        discord: formData.discord || null,
        steam: formData.steam || null,
      }

      const response = await fetch(`/api/admin/rosters/${rosterId}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create player")
      }

      router.push(`/admin/rosters/${rosterId}/edit`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/rosters/${rosterId}/edit`}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Player</h1>
            <p className="text-gray-400 mt-1">
              Add a player with profile, stats, and social links
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>

          <div className="space-y-6">
            {/* Player Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Player Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="Enter player's full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* In-Game Name */}
              <div>
                <label htmlFor="inGameName" className="block text-sm font-medium text-gray-400 mb-2">
                  In-Game Name
                </label>
                <input
                  type="text"
                  id="inGameName"
                  value={formData.inGameName}
                  onChange={(e) => setFormData({ ...formData, inGameName: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                  placeholder="e.g., ProPlayer123"
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-2">
                  Role/Position
                </label>
                <input
                  type="text"
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                  placeholder="e.g., Forward, Mid, Defense"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary resize-none"
                placeholder="Write a brief bio about the player..."
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-400 mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="https://example.com/player-photo.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Image upload feature coming soon. For now, enter a URL.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Statistics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Goals */}
            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-400 mb-2">
                Goals
              </label>
              <input
                type="number"
                id="goals"
                min="0"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="0"
              />
            </div>

            {/* Assists */}
            <div>
              <label htmlFor="assists" className="block text-sm font-medium text-gray-400 mb-2">
                Assists
              </label>
              <input
                type="number"
                id="assists"
                min="0"
                value={formData.assists}
                onChange={(e) => setFormData({ ...formData, assists: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="0"
              />
            </div>

            {/* Saves */}
            <div>
              <label htmlFor="saves" className="block text-sm font-medium text-gray-400 mb-2">
                Saves
              </label>
              <input
                type="number"
                id="saves"
                min="0"
                value={formData.saves}
                onChange={(e) => setFormData({ ...formData, saves: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Social Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Twitter */}
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-400 mb-2">
                Twitter/X
              </label>
              <input
                type="url"
                id="twitter"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="https://twitter.com/username"
              />
            </div>

            {/* Twitch */}
            <div>
              <label htmlFor="twitch" className="block text-sm font-medium text-gray-400 mb-2">
                Twitch
              </label>
              <input
                type="url"
                id="twitch"
                value={formData.twitch}
                onChange={(e) => setFormData({ ...formData, twitch: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="https://twitch.tv/username"
              />
            </div>

            {/* YouTube */}
            <div>
              <label htmlFor="youtube" className="block text-sm font-medium text-gray-400 mb-2">
                YouTube
              </label>
              <input
                type="url"
                id="youtube"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="https://youtube.com/@username"
              />
            </div>

            {/* Instagram */}
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-400 mb-2">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="https://instagram.com/username"
              />
            </div>

            {/* Discord */}
            <div>
              <label htmlFor="discord" className="block text-sm font-medium text-gray-400 mb-2">
                Discord
              </label>
              <input
                type="text"
                id="discord"
                value={formData.discord}
                onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="username#1234"
              />
            </div>

            {/* Steam */}
            <div>
              <label htmlFor="steam" className="block text-sm font-medium text-gray-400 mb-2">
                Steam
              </label>
              <input
                type="url"
                id="steam"
                value={formData.steam}
                onChange={(e) => setFormData({ ...formData, steam: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="https://steamcommunity.com/id/username"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href={`/admin/rosters/${rosterId}/edit`}
            className="px-6 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary/80 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? "Creating..." : "Create Player"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
