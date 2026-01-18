import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    await checkAdmin()
    const { matchId } = await params

    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: "live",
        startedAt: new Date(),
      },
    })

    return NextResponse.json(match)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to start match" },
      { status: 500 }
    )
  }
}
