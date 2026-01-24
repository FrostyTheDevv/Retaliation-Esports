import { NextResponse } from "next/server"
import { getUserSession } from "@/lib/user-auth"

export async function GET() {
  try {
    const session = await getUserSession()

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json(
      {
        user: {
          id: session.user.id,
          username: session.user.username,
          email: session.user.email,
          discordId: session.user.discordId,
          createdAt: session.user.createdAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
