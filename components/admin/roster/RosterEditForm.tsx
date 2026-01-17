"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, X, Plus, Trash2, Edit2, GripVertical } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import styles from "./RosterEditForm.module.css"

type Player = {
  id: string
  name: string
  inGameName: string | null
  role: string | null
  image: string | null
  imageUrl?: string | null
  displayOrder: number
}

type Roster = {
  id: string
  name: string
  tag: string | null
  primaryColor: string
  secondaryColor: string | null
  image: string | null
  description: string | null
  isActive: boolean
}

type RosterWithPlayers = Roster & {
  players: Player[]
}

interface RosterEditFormProps {
  roster: RosterWithPlayers
}

export default function RosterEditForm({ roster: initialRoster }: RosterEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const [formData, setFormData] = useState({
    name: initialRoster.name,
    primaryColor: initialRoster.primaryColor,
    secondaryColor: initialRoster.secondaryColor,
    description: initialRoster.description || "",
    isActive: initialRoster.isActive,
    image: initialRoster.image || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/rosters/${initialRoster.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update roster")
      }

      router.refresh()
      alert("Roster updated successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/rosters/${initialRoster.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete roster")
      }

      router.push("/admin/rosters")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
      setDeleteConfirm(false)
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
            <h1 className="text-3xl font-bold text-white">Edit Roster</h1>
            <p className="text-gray-400 mt-1">
              Update roster information and manage players
            </p>
          </div>
        </div>
        <button
          onClick={() => setDeleteConfirm(true)}
          className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500 text-red-500 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete Roster</span>
        </button>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
          <h3 className="text-red-500 font-bold text-lg mb-2">⚠️ Delete Roster?</h3>
          <p className="text-gray-300 mb-4">
            This will permanently delete <strong>{initialRoster.name}</strong> and all {initialRoster.players.length} players. This action cannot be undone.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              {loading ? "Deleting..." : "Yes, Delete Forever"}
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-400 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    aria-label="Select primary color"
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#FF4655"
                    aria-label="Primary color hex value"
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-400 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={formData.secondaryColor || ""}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    aria-label="Select secondary color"
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor || ""}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="#00D9FF"
                    aria-label="Secondary color hex value"
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Color Preview
              </label>
              {/* eslint-disable-next-line no-inline-styles */}
              <div
                className={styles.colorPreview}
                style={{
                  '--primary-color': formData.primaryColor,
                  '--secondary-color': formData.secondaryColor,
                } as React.CSSProperties}
              >
                {formData.name}
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
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-400 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-gray-900"
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
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>

      {/* Players Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Players ({initialRoster.players.length})</h2>
          <Link
            href={`/admin/rosters/${initialRoster.id}/players/new`}
            className="flex items-center space-x-2 bg-brand-secondary hover:bg-brand-secondary/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Player</span>
          </Link>
        </div>

        {initialRoster.players.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Players Yet</h3>
            <p className="text-gray-400 mb-4">
              Add players to this roster with their profiles, stats, and social links.
            </p>
            <Link
              href={`/admin/rosters/${initialRoster.id}/players/new`}
              className="inline-flex items-center space-x-2 bg-brand-secondary hover:bg-brand-secondary/80 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Player</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {initialRoster.players.map((player: Player) => (
              <div
                key={player.id}
                className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-850 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="cursor-move">
                    <GripVertical className="w-5 h-5 text-gray-500" />
                  </div>
                  {player.imageUrl && (
                    <Image
                      src={player.imageUrl}
                      alt={player.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h4 className="text-white font-semibold">{player.name}</h4>
                    {player.role && (
                      <p className="text-gray-400 text-sm">{player.role}</p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/rosters/${initialRoster.id}/players/${player.id}/edit`}
                  className="flex items-center space-x-2 text-brand-secondary hover:text-brand-secondary/80 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
