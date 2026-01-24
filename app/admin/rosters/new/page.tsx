"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import styles from "./page.module.css"

export default function NewRosterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    primaryColor: "#FF4655",
    secondaryColor: "#00D9FF",
    description: "",
    isActive: true,
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/rosters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create roster")
      }

      const roster = await response.json()
      router.push(`/admin/rosters/${roster.id}/edit`)
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
            href="/admin/rosters"
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Roster</h1>
            <p className="text-gray-400 mt-1">
              Add a new team roster to your organization
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Roster Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Roster Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="Enter roster name (e.g., Rocket League Main Team)"
              />
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-400 mb-2">
                  Primary Color <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 bg-black border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-brand-primary"
                    placeholder="#FF4655"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-400 mb-2">
                  Secondary Color <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 bg-black border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-brand-primary"
                    placeholder="#00D9FF"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Color Preview
              </label>
              <div
                className={styles.colorPreview}
                data-primary-color={formData.primaryColor}
                data-secondary-color={formData.secondaryColor}
              >
                {formData.name || "Team Name"}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary resize-none"
                placeholder="Enter a brief description of this roster..."
              />
            </div>

            {/* Image URL (temporary until upload is implemented) */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-400 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-sm text-gray-500 mt-1">
                Image upload feature coming soon. For now, enter a URL.
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-black text-brand-primary focus:ring-brand-primary focus:ring-offset-gray-800"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                Active (visible on public roster page)
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/admin/rosters"
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
            <span>{loading ? "Creating..." : "Create Roster"}</span>
          </button>
        </div>
      </form>

      {/* Next Steps Notice */}
      <div className="bg-brand-secondary/10 border border-brand-secondary rounded-lg p-4">
        <p className="text-brand-secondary text-sm">
          <strong>Next Step:</strong> After creating the roster, you'll be able to add players with their profiles, stats, and social links.
        </p>
      </div>
    </div>
  )
}
