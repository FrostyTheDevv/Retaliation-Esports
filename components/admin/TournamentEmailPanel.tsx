"use client"

import { useState } from "react"
import { Mail, Send, Clock, Users, AlertCircle, CheckCircle } from "lucide-react"

interface EmailPanelProps {
  tournamentId: string
  tournamentName: string
  signupCounts: {
    total: number
    approved: number
    pending: number
    verified: number
  }
}

type ReminderType = "24h" | "1h" | "starting"
type RecipientFilter = "all" | "approved" | "verified"

export function TournamentEmailPanel({
  tournamentId,
  tournamentName,
  signupCounts,
}: EmailPanelProps) {
  const [activeTab, setActiveTab] = useState<"reminder" | "custom">("reminder")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Reminder form state
  const [reminderType, setReminderType] = useState<ReminderType>("24h")
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>("approved")

  // Custom email form state
  const [customSubject, setCustomSubject] = useState("")
  const [customMessage, setCustomMessage] = useState("")

  const handleSendReminder = async () => {
    setSending(true)
    setResult(null)

    try {
      const response = await fetch(`/api/admin/tournaments/${tournamentId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reminder",
          reminderType,
          recipientFilter,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.error || "Failed to send emails" })
      }
    } catch (error) {
      setResult({ success: false, message: "Network error occurred" })
    } finally {
      setSending(false)
    }
  }

  const handleSendCustom = async () => {
    if (!customSubject.trim() || !customMessage.trim()) {
      setResult({ success: false, message: "Please fill in both subject and message" })
      return
    }

    setSending(true)
    setResult(null)

    try {
      const response = await fetch(`/api/admin/tournaments/${tournamentId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          subject: customSubject,
          message: customMessage,
          recipientFilter,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
        setCustomSubject("")
        setCustomMessage("")
      } else {
        setResult({ success: false, message: data.error || "Failed to send emails" })
      }
    } catch (error) {
      setResult({ success: false, message: "Network error occurred" })
    } finally {
      setSending(false)
    }
  }

  const getRecipientCount = () => {
    switch (recipientFilter) {
      case "approved":
        return signupCounts.approved
      case "verified":
        return signupCounts.verified
      default:
        return signupCounts.total
    }
  }

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Participants
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Send reminders or custom announcements to registered teams
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("reminder")}
          className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === "reminder"
              ? "text-white bg-zinc-800 border-b-2 border-[#77010F]"
              : "text-gray-400 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Send Reminder
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === "custom"
              ? "text-white bg-zinc-800 border-b-2 border-[#77010F]"
              : "text-gray-400 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          <Send className="w-4 h-4 inline mr-2" />
          Custom Email
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Recipient Filter - Shared */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Recipients
          </label>
          <div className="flex gap-2">
            {[
              { value: "approved", label: "Approved", count: signupCounts.approved },
              { value: "verified", label: "Verified", count: signupCounts.verified },
              { value: "all", label: "All Signups", count: signupCounts.total },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setRecipientFilter(option.value as RecipientFilter)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  recipientFilter === option.value
                    ? "bg-[#77010F] text-white"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {activeTab === "reminder" && (
          <>
            {/* Reminder Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reminder Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "24h", label: "24 Hours", emoji: "⏰" },
                  { value: "1h", label: "1 Hour", emoji: "🔔" },
                  { value: "starting", label: "Starting Now", emoji: "🎮" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setReminderType(option.value as ReminderType)}
                    className={`p-4 rounded-lg text-center transition-colors ${
                      reminderType === option.value
                        ? "bg-[#77010F] text-white border-2 border-[#77010F]"
                        : "bg-zinc-800 text-gray-300 border-2 border-transparent hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{option.emoji}</span>
                    <span className="text-sm font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSendReminder}
              disabled={sending || getRecipientCount() === 0}
              className="w-full bg-[#77010F] hover:bg-[#5A010C] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Reminder to {getRecipientCount()} Recipients
                </>
              )}
            </button>
          </>
        )}

        {activeTab === "custom" && (
          <>
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder={`Update: ${tournamentName}`}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#77010F]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={6}
                placeholder="Write your announcement here..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#77010F] resize-none"
              />
            </div>

            <button
              onClick={handleSendCustom}
              disabled={sending || getRecipientCount() === 0 || !customSubject.trim() || !customMessage.trim()}
              className="w-full bg-[#77010F] hover:bg-[#5A010C] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send to {getRecipientCount()} Recipients
                </>
              )}
            </button>
          </>
        )}

        {/* Result Message */}
        {result && (
          <div
            className={`flex items-center gap-2 p-4 rounded-lg ${
              result.success
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : "bg-red-900/30 border border-red-700 text-red-300"
            }`}
          >
            {result.success ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            {result.message}
          </div>
        )}
      </div>
    </div>
  )
}
