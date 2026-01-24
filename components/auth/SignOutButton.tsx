"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Signing Out..." : "Sign Out"}
    </button>
  )
}
