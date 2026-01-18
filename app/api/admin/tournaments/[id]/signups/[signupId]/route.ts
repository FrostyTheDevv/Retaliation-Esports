import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; signupId: string }> }
) {
  try {
    await checkAdmin()
    const { signupId } = await params
    const body = await req.json()

    const signup = await prisma.tournamentSignup.update({
      where: { id: signupId },
      data: {
        status: body.status,
      },
    })

    return NextResponse.json(signup)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update signup" },
      { status: 500 }
    )
  }
}
