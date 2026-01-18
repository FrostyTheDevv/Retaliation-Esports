import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"
import {
  generateSingleEliminationBracket,
  generateDoubleEliminationBracket,
} from "@/lib/brackets"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdmin()
    const { id } = await params
    const body = await req.json()

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        signups: {
          where: { status: "approved" },
          include: { team: true },
        },
      },
    })

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      )
    }

    const teams = tournament.signups.map((s: any) => s.team).filter((t: any): t is NonNullable<typeof t> => t !== null)

    if (teams.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 approved teams" },
        { status: 400 }
      )
    }

    let result
    if (body.format === "single-elimination") {
      result = await generateSingleEliminationBracket(
        id,
        teams,
        body.randomize || false
      )
    } else if (body.format === "double-elimination") {
      result = await generateDoubleEliminationBracket(
        id,
        teams,
        body.randomize || false
      )
    } else {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Failed to generate bracket:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate bracket" },
      { status: 500 }
    )
  }
}
