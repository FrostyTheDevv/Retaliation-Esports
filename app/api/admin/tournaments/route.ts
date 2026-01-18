import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await checkAdmin()

    const body = await req.json()

    const tournament = await prisma.tournament.create({
      data: {
        name: body.name,
        description: body.description,
        gameMode: body.gameMode,
        format: body.format,
        maxTeams: body.maxTeams,
        minTeamSize: body.minTeamSize,
        maxTeamSize: body.maxTeamSize,
        bestOf: body.bestOf,
        startDate: new Date(body.startDate),
        registrationDeadline: new Date(body.registrationDeadline),
        bannerImage: body.bannerImage || body.bannerUrl,
        prizeInfo: body.prizeInfo,
        discordLink: body.discordLink,
        rulesLink: body.rulesLink,
        streamLink: body.streamLink,
        requireEmailVerification: body.requireEmailVerification ?? false,
        allowRandomize: body.allowRandomize ?? false,
        manualSeeding: body.manualSeeding ?? false,
        thirdPlaceMatch: body.thirdPlaceMatch ?? false,
        checkInEnabled: body.checkInEnabled ?? true,
        emailReminders: body.emailReminders ?? true,
        reminderHours: body.reminderHours ?? 24,
        discordReminders: body.discordReminders ?? false,
        status: body.status || "draft",
      },
    })

    return NextResponse.json(tournament)
  } catch (error: any) {
    console.error("Failed to create tournament:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create tournament" },
      { status: error.message?.includes("Unauthorized") ? 401 : 500 }
    )
  }
}

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            signups: true,
            matches: true,
          },
        },
      },
    })

    return NextResponse.json(tournaments)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    )
  }
}
