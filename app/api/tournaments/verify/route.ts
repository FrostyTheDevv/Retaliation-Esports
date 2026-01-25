import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendRegistrationConfirmationEmail } from "@/lib/email"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(
        new URL("/tournaments?error=missing_token", req.url)
      )
    }

    // Find signup with this token
    const signup = await prisma.tournamentSignup.findUnique({
      where: { verificationToken: token },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            startDate: true,
          },
        },
      },
    })

    if (!signup) {
      return NextResponse.redirect(
        new URL("/tournaments?error=invalid_token", req.url)
      )
    }

    if (signup.isVerified) {
      return NextResponse.redirect(
        new URL(`/tournaments/${signup.tournamentId}?verified=already`, req.url)
      )
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - signup.createdAt.getTime()
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    if (tokenAge > twentyFourHours) {
      return NextResponse.redirect(
        new URL("/tournaments?error=token_expired", req.url)
      )
    }

    // Verify the signup
    await prisma.tournamentSignup.update({
      where: { id: signup.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verificationToken: null, // Clear the token after use
      },
    })

    // Send confirmation email
    await sendRegistrationConfirmationEmail(
      signup.captainEmail,
      signup.teamName,
      signup.tournament.name,
      signup.tournament.startDate,
      signup.tournament.id
    )

    // Redirect to tournament page with success message
    return NextResponse.redirect(
      new URL(`/tournaments/${signup.tournamentId}?verified=success`, req.url)
    )
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.redirect(
      new URL("/tournaments?error=verification_failed", req.url)
    )
  }
}
