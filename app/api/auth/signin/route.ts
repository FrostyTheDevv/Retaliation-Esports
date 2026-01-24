import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { generateToken, setAuthCookie } from "@/lib/user-auth"

const signinSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validation = signinSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        {
          error: firstError.message,
          field: firstError.path[0],
        },
        { status: 400 }
      )
    }

    const { usernameOrEmail, password } = validation.data

    // Find user by username or email (case insensitive)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: usernameOrEmail,
              mode: "insensitive",
            },
          },
          {
            email: {
              equals: usernameOrEmail,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        discordId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid username/email or password",
          field: "general",
        },
        { status: 401 }
      )
    }

    // Check if user has a password (not Discord OAuth only)
    if (!user.password) {
      return NextResponse.json(
        {
          error: "This account uses Discord OAuth. Please sign in with Discord.",
          field: "general",
        },
        { status: 400 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: "Invalid username/email or password",
          field: "general",
        },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email || "",
    })

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json(
      {
        message: "Signed in successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
