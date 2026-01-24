import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params
    const body = await req.json()
    const { teamName, username, password, captainEmail, captainDiscord } = body

    // Validation
    if (!teamName || !username || !password || !captainEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Check tournament exists and is open
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        _count: {
          select: {
            signups: {
              where: {
                status: "approved"
              }
            }
          }
        }
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      )
    }

    if (tournament.status !== "open") {
      return NextResponse.json(
        { error: "Tournament registration is not open" },
        { status: 400 }
      )
    }

    // Check registration deadline
    if (new Date() > new Date(tournament.registrationDeadline)) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      )
    }

    // Check if tournament is full
    if (tournament._count.signups >= (tournament.maxTeams ?? Infinity)) {
      return NextResponse.json(
        { error: "Tournament is full" },
        { status: 400 }
      )
    }

    // Check for duplicate team name
    const existingTeamName = await prisma.tournamentSignup.findFirst({
      where: {
        tournamentId,
        teamName: {
          equals: teamName,
          mode: "insensitive"
        }
      }
    })

    if (existingTeamName) {
      return NextResponse.json(
        { error: "Team name already taken for this tournament" },
        { status: 400 }
      )
    }

    // Check for duplicate username
    const existingUsername = await prisma.tournamentSignup.findFirst({
      where: {
        tournamentId,
        username: {
          equals: username,
          mode: "insensitive"
        }
      }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken for this tournament" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create signup
    const signup = await prisma.tournamentSignup.create({
      data: {
        tournamentId,
        teamName,
        username,
        password: hashedPassword,
        captainEmail,
        captainDiscord: captainDiscord || null,
        status: "pending",
        isVerified: false,
        playersInfo: [],
      }
    })

    return NextResponse.json({
      success: true,
      signupId: signup.id,
      message: "Registration submitted successfully. Please wait for admin approval."
    })
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to register" },
      { status: 500 }
    )
  }
}
