import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/user-auth"
import { generateVerificationToken, sendVerificationEmail } from "@/lib/email"

const signupSchema = z.object({
  teamName: z.string().min(1, "Team name is required").max(100),
  captainDiscord: z.string().optional(),
  playersInfo: z.array(z.any()).optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user session
    const session = await getUserSession()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to register for tournaments" },
        { status: 401 }
      )
    }

    const { id: tournamentId } = await params
    const body = await req.json()

    // Validate input
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const { teamName, captainDiscord, playersInfo } = validation.data

    // Validate tournament exists and is open for registration
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        name: true,
        status: true,
        registrationDeadline: true,
        maxTeams: true,
        _count: {
          select: {
            signups: {
              where: {
                status: {
                  in: ["pending", "approved"],
                },
              },
            },
          },
        },
      },
    })

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      )
    }

    // Check if tournament is open
    if (tournament.status !== "open") {
      return NextResponse.json(
        { error: "Tournament registration is not open" },
        { status: 400 }
      )
    }

    // Check registration deadline
    if (tournament.registrationDeadline && new Date() > new Date(tournament.registrationDeadline)) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      )
    }

    // Check if tournament is full
    if (tournament.maxTeams && tournament._count.signups >= tournament.maxTeams) {
      return NextResponse.json(
        { error: "Tournament is full" },
        { status: 400 }
      )
    }

    // Check if user has already registered
    const existingSignup = await prisma.tournamentSignup.findFirst({
      where: {
        tournamentId,
        userId: session.user.id,
      },
    })

    if (existingSignup) {
      return NextResponse.json(
        { error: "You have already registered for this tournament" },
        { status: 400 }
      )
    }

    // Create signup with verification token
    const verificationToken = generateVerificationToken()
    
    const signup = await prisma.tournamentSignup.create({
      data: {
        tournamentId,
        userId: session.user.id,
        teamName,
        captainEmail: session.user.email,
        captainDiscord: captainDiscord || null,
        playersInfo: playersInfo || [],
        status: "pending",
        isVerified: false,
        verificationToken,
      },
    })

    // Send verification email
    await sendVerificationEmail(
      session.user.email,
      teamName,
      tournament.name,
      verificationToken
    )

    // Fetch tournament name for response
    const tournamentData = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { name: true },
    })

    return NextResponse.json(
      {
        message: "Registration successful! Please check your email to verify your registration.",
        signup: {
          id: signup.id,
          teamName: signup.teamName,
          status: signup.status,
          tournament: tournamentData?.name || "Tournament",
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Tournament signup error:", error)
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
