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
 * Check if user has admin access based on Discord roles
 */
export async function isAdmin() {
  const session = await auth()
  
  if (!session?.user?.guildRoles) {
    return false
  }

  const userRoles = session.user.guildRoles as string[]
  return userRoles.some((roleId) => ADMIN_ROLE_IDS.includes(roleId))
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
  
  if (!session.user?.guildRoles) {
    throw new Error("Forbidden: Admin access required")
  }

  const userRoles = session.user.guildRoles as string[]
  const hasAdminRole = userRoles.some((roleId) => ADMIN_ROLE_IDS.includes(roleId))
  
  if (!hasAdminRole) {
    throw new Error("Forbidden: Admin access required")
  }
  
  return session
}
