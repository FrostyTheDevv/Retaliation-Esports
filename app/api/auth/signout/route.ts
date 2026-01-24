import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/user-auth"

export async function POST() {
  try {
    await clearAuthCookie()

    return NextResponse.json(
      { message: "Signed out successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Signout error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
