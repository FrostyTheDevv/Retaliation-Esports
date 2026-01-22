import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import { z } from "zod"

const signupUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
})

// PATCH /api/admin/tournaments/[id]/signups/[signupId] - Update signup status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; signupId: string }> }
) {
  try {
    await requireAdmin()
    const { id, signupId } = await params

    const body = await request.json()
    const validated = signupUpdateSchema.parse(body)

    // Verify signup belongs to tournament
    const signup = await prisma.tournamentSignup.findFirst({
      where: {
        id: signupId,
        tournamentId: id,
      },
    })

    if (!signup) {
      return NextResponse.json({ error: "Signup not found" }, { status: 404 })
    }

    const updatedSignup = await prisma.tournamentSignup.update({
      where: { id: signupId },
      data: { status: validated.status },
    })

    return NextResponse.json(updatedSignup)
  } catch (error) {
    console.error("Failed to update signup:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Failed to update signup" }, { status: 500 })
  }
}

// DELETE /api/admin/tournaments/[id]/signups/[signupId] - Delete signup
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; signupId: string }> }
) {
  try {
    await requireAdmin()
    const { id, signupId } = await params

    // Verify signup belongs to tournament
    const signup = await prisma.tournamentSignup.findFirst({
      where: {
        id: signupId,
        tournamentId: id,
      },
    })

    if (!signup) {
      return NextResponse.json({ error: "Signup not found" }, { status: 404 })
    }

    await prisma.tournamentSignup.delete({
      where: { id: signupId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete signup:", error)
    return NextResponse.json({ error: "Failed to delete signup" }, { status: 500 })
  }
}
