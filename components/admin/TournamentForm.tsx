"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, Loader2 } from "lucide-react"
import { put } from "@vercel/blob"

const tournamentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().min(1, "Start date is required"),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  gameMode: z.enum(["1v1", "2v2", "3v3", "5v5"]),
  format: z.enum(["single-elimination", "double-elimination"]),
  maxTeams: z.number().min(2, "Must have at least 2 teams").max(128, "Maximum 128 teams"),
  bestOf: z.number().min(1).max(7),
  minTeamSize: z.number().min(1).optional(),
  maxTeamSize: z.number().min(1).optional(),
  prizeInfo: z.string().optional(),
  discordLink: z.string().url().optional().or(z.literal("")),
  rulesLink: z.string().url().optional().or(z.literal("")),
  streamLink: z.string().url().optional().or(z.literal("")),
  requireEmailVerification: z.boolean(),
  allowRandomize: z.boolean(),
  manualSeeding: z.boolean(),
  thirdPlaceMatch: z.boolean(),
  checkInEnabled: z.boolean(),
  emailReminders: z.boolean(),
  reminderHours: z.number().min(1).max(168),
  discordReminders: z.boolean(),
  status: z.enum(["draft", "open"]),
})

type TournamentFormData = z.infer<typeof tournamentSchema>

interface TournamentFormProps {
  initialData?: TournamentFormData & { id: string; bannerUrl?: string | null }
}

export default function TournamentForm({ initialData }: TournamentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    initialData?.bannerUrl || null
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      startDate: "",
      registrationDeadline: "",
      gameMode: "2v2" as const,
      format: "single-elimination" as const,
      maxTeams: 16,
      bestOf: 1,
      minTeamSize: undefined,
      maxTeamSize: undefined,
      requireEmailVerification: false,
      allowRandomize: false,
      manualSeeding: false,
      thirdPlaceMatch: false,
      checkInEnabled: true,
      emailReminders: true,
      reminderHours: 24,
      discordReminders: false,
      status: "draft",
    },
  })

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: TournamentFormData) => {
    try {
      setIsSubmitting(true)

      // Upload banner if new file selected
      let bannerUrl = initialData?.bannerUrl
      if (bannerFile) {
        const blob = await put(bannerFile.name, bannerFile, {
          token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN!,
        })
        bannerUrl = blob.url
      }

      const payload = {
        ...data,
        bannerUrl,
        bannerImage: bannerUrl, // Map to schema field name
        maxTeams: Number(data.maxTeams),
        bestOf: Number(data.bestOf),
      }

      const url = initialData?.id
        ? `/api/admin/tournaments/${initialData.id}`
        : "/api/admin/tournaments"

      const method = initialData?.id ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save tournament")
      }

      const tournament = await response.json()
      router.push(`/admin/tournaments/${tournament.id}`)
      router.refresh()
    } catch (error) {
      console.error("Failed to save tournament:", error)
      alert(error instanceof Error ? error.message : "Failed to save tournament")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Banner Image */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Tournament Banner</h2>
        <div className="space-y-4">
          {bannerPreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={bannerPreview}
                alt="Tournament banner preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <label className="flex items-center justify-center w-full h-32 px-4 transition bg-zinc-800 border-2 border-zinc-700 border-dashed rounded-lg appearance-none cursor-pointer hover:border-[#77010F] focus:outline-none">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-400">
                {bannerFile ? bannerFile.name : "Click to upload banner image"}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
            />
          </label>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Name *
            </label>
            <input
              {...register("name")}
              type="text"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
              placeholder="e.g., Summer Championship 2024"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
              placeholder="Describe your tournament..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
              >
                <option value="draft">Draft (Hidden)</option>
                <option value="open">Open (Public)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dates & Times */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Dates & Times</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Start Date *
            </label>
            <input
              {...register("startDate")}
              type="datetime-local"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-400">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Registration Deadline *
            </label>
            <input
              {...register("registrationDeadline")}
              type="datetime-local"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
            />
            {errors.registrationDeadline && (
              <p className="mt-1 text-sm text-red-400">{errors.registrationDeadline.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Configuration */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Tournament Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Game Mode *</label>
            <select
              {...register("gameMode")}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
            >
              <option value="">Select game mode</option>
              <option value="1v1">1v1</option>
              <option value="2v2">2v2</option>
              <option value="3v3">3v3</option>
              <option value="5v5">5v5</option>
            </select>
            {errors.gameMode && (
              <p className="mt-1 text-sm text-red-400">{errors.gameMode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Format *</label>
            <select
              {...register("format")}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
            >
              <option value="">Select format</option>
              <option value="single-elimination">Single Elimination</option>
              <option value="double-elimination">Double Elimination</option>
            </select>
            {errors.format && (
              <p className="mt-1 text-sm text-red-400">{errors.format.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Teams *
            </label>
            <input
              {...register("maxTeams", { valueAsNumber: true })}
              type="number"
              min="2"
              max="128"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
            />
            {errors.maxTeams && (
              <p className="mt-1 text-sm text-red-400">{errors.maxTeams.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Best Of</label>
            <select
              {...register("bestOf", { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
            >
              <option value="1">Best of 1</option>
              <option value="3">Best of 3</option>
              <option value="5">Best of 5</option>
              <option value="7">Best of 7</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prize Pool</label>
            <textarea
              {...register("prizeInfo")}
              rows={3}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
              placeholder="e.g., 1st: $500, 2nd: $300, 3rd: $200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Discord Link
              </label>
              <input
                {...register("discordLink")}
                type="url"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                placeholder="https://discord.gg/..."
              />
              {errors.discordLink && (
                <p className="mt-1 text-sm text-red-400">{errors.discordLink.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rules Link</label>
              <input
                {...register("rulesLink")}
                type="url"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                placeholder="https://..."
              />
              {errors.rulesLink && (
                <p className="mt-1 text-sm text-red-400">{errors.rulesLink.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stream Link</label>
              <input
                {...register("streamLink")}
                type="url"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                placeholder="https://twitch.tv/..."
              />
              {errors.streamLink && (
                <p className="mt-1 text-sm text-red-400">{errors.streamLink.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Basic Settings</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("checkInEnabled")}
              type="checkbox"
              className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded text-[#77010F] focus:ring-[#77010F]"
            />
            <span className="text-gray-300">Enable team check-in before matches</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("requireEmailVerification")}
              type="checkbox"
              className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded text-[#77010F] focus:ring-[#77010F]"
            />
            <span className="text-gray-300">Require email verification to signup</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("allowRandomize")}
              type="checkbox"
              className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded text-[#77010F] focus:ring-[#77010F]"
            />
            <span className="text-gray-300">Allow random seeding (instead of manual)</span>
          </label>
        </div>
      </div>

      {/* Advanced Bracket Settings */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Advanced Bracket Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("manualSeeding")}
              type="checkbox"
              className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded text-[#77010F] focus:ring-[#77010F]"
            />
            <span className="text-gray-300">Enable manual seeding (admin can set seed positions)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("thirdPlaceMatch")}
              type="checkbox"
              className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded text-[#77010F] focus:ring-[#77010F]"
            />
            <span className="text-gray-300">Include 3rd place match</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Team Size
              </label>
              <input
                {...register("minTeamSize", { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                placeholder="e.g., 2"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for no minimum</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Team Size
              </label>
              <input
                {...register("maxTeamSize", { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
                placeholder="e.g., 5"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for no maximum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("emailReminders")}
              type="checkbox"
              className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded text-[#77010F] focus:ring-[#77010F]"
            />
            <span className="text-gray-300">Send email reminders to participants</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("discordReminders")}
              type="checkbox"
              className="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded text-[#77010F] focus:ring-[#77010F]"
            />
            <span className="text-gray-300">Send Discord DM reminders (requires Discord integration)</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reminder Timing (hours before tournament)
            </label>
            <select
              {...register("reminderHours", { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#77010F]"
            >
              <option value="1">1 hour before</option>
              <option value="3">3 hours before</option>
              <option value="6">6 hours before</option>
              <option value="12">12 hours before</option>
              <option value="24">24 hours before</option>
              <option value="48">48 hours before</option>
              <option value="72">3 days before</option>
              <option value="168">1 week before</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#77010F] hover:bg-[#5A010C] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{initialData ? "Update Tournament" : "Create Tournament"}</>
          )}
        </button>
      </div>
    </form>
  )
}
