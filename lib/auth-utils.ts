import { auth } from "@/lib/auth"
import { ADMIN_ROLE_IDS } from "@/lib/constants"

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

/**
 * Check if user has admin access based on Discord user ID
 */
export async function isAdmin() {
  const session = await auth()
  
  if (!session?.user?.discordId) {
    return false
  }

  // ADMIN_ROLE_IDS contains Discord user IDs, not role IDs
  const userDiscordId = session.user.discordId as string
  return ADMIN_ROLE_IDS.includes(userDiscordId)
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  return await auth()
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

/**
 * Require authentication - throw error if not authenticated
 */
export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required")
  }
  
  return session
}

/**
 * Require admin access - throw error if not admin
 */
export async function requireAdmin() {
  const session = await requireAuth()
  
  if (!session.user?.discordId) {
    throw new Error("Forbidden: Admin access required")
  }

  // ADMIN_ROLE_IDS contains Discord user IDs, not role IDs
  const userDiscordId = session.user.discordId as string
  const hasAdminAccess = ADMIN_ROLE_IDS.includes(userDiscordId)
  
  if (!hasAdminAccess) {
    throw new Error("Forbidden: Admin access required")
  }
  
  return session
}
