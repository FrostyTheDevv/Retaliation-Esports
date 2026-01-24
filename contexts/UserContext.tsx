"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  discordId: string | null
  createdAt: Date
}

interface UserContextType {
  user: User | null
  loading: boolean
  signout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      setUser(data.user || null)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const signout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  return (
    <UserContext.Provider value={{ user, loading, signout, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
