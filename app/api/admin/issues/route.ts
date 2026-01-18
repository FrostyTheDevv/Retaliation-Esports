import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    // @ts-ignore - Prisma client generation issue
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tournamentId = searchParams.get("tournamentId")
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")

    const where: any = {}

    if (tournamentId) {
      where.match = { tournamentId }
    }

    if (status) {
      where.status = status
    }

    if (severity) {
      where.severity = severity
    }

    const issues = await prisma.technicalIssue.findMany({
      where,
      include: {
        match: {
          include: {
            team1: true,
            team2: true,
            tournament: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // Open issues first
        { severity: "desc" }, // Critical first
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json(issues)
  } catch (error: any) {
    console.error("Failed to get issues:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get issues" },
      { status: 500 }
    )
  }
}
