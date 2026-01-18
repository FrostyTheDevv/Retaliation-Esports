import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; signupId: string }> }
) {
  try {
    await checkAdmin()
    const { signupId } = await params

    await prisma.tournamentSignup.delete({
      where: { id: signupId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to remove team" },
      { status: 500 }
    )
  }
}
