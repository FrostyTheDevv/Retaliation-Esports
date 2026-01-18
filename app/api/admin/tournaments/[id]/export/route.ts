import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdmin()
    const { id } = await params

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        signups: {
          where: { status: "approved" },
          include: {
            team: true,
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

    // Generate CSV
    const headers = [
      "Team Name",
      "Captain Email",
      "Captain Discord",
      "Players",
      "Status",
      "Verified",
      "Signup Date",
    ]

    const rows = tournament.signups.map((signup: any) => {
      const players =
        Array.isArray(signup.playersInfo) && signup.playersInfo.length > 0
          ? signup.playersInfo.map((p: any) => p.name || "Unknown").join("; ")
          : "N/A"

      return [
        signup.teamName,
        signup.captainEmail,
        signup.captainDiscord || "N/A",
        players,
        signup.status,
        signup.isVerified ? "Yes" : "No",
        new Date(signup.createdAt).toLocaleString(),
      ]
    })

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="tournament-${tournament.name.replace(/[^a-z0-9]/gi, "-")}-participants.csv"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to export participants" },
      { status: 500 }
    )
  }
}
