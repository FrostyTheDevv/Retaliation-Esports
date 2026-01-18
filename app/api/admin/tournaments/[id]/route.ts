import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdmin()
    const { id } = await params
    const body = await req.json()

    const tournament = await prisma.tournament.update({
      where: { id },
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
        requireEmailVerification: body.requireEmailVerification,
        allowRandomize: body.allowRandomize,
        manualSeeding: body.manualSeeding,
        thirdPlaceMatch: body.thirdPlaceMatch,
        checkInEnabled: body.checkInEnabled,
        emailReminders: body.emailReminders,
        reminderHours: body.reminderHours,
        discordReminders: body.discordReminders,
        status: body.status,
      },
    })

    return NextResponse.json(tournament)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update tournament" },
      { status: 500 }
    )
  }
}
