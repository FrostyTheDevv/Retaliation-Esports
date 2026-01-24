import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables")
}

export interface TokenPayload {
  userId: string
  username: string
  email: string
}

export interface UserSession {
  user: {
    id: string
    username: string
    email: string
    discordId: string | null
    createdAt: Date
  }
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: {
  id: string
  username: string
  email: string
}): string {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Get the current user session from cookies (server-side)
 * Call this in Server Components, Server Actions, or Route Handlers
 */
export async function getUserSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)

    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        discordId: true,
        createdAt: true,
      },
    })

    if (!user) {
      return null
    }

    return { 
      user: {
        ...user,
        email: user.email || "",
      }
    }
  } catch (error) {
    console.error("Error getting user session:", error)
    return null
  }
}

/**
 * Set the auth token cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

/**
 * Clear the auth token cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
