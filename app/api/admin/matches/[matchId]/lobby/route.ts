import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    await checkAdmin()
    const { matchId } = await params
    const body = await req.json()

    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        lobbyCode: body.lobbyCode,
        serverInfo: body.serverInfo,
      },
    })

    return NextResponse.json(match)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update lobby" },
      { status: 500 }
    )
  }
}
