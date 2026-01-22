import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdmin()
    const { id } = await params
    const body = await req.json()

    // Create signup for existing team or create new signup manually
    const signup = await prisma.tournamentSignup.create({
      data: {
        tournamentId: id,
        teamId: body.teamId || null,
        teamName: body.teamName,
        captainEmail: body.captainEmail,
        captainDiscord: body.captainDiscord,
        playersInfo: body.playersInfo || [],
        status: "approved", // Manually added teams are auto-approved
        isVerified: true,
        password: body.password || "", // Admin-added teams may not need password
        username: body.username || null, // Optional username
      },
    })

    return NextResponse.json(signup)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to add team" },
      { status: 500 }
    )
  }
}
