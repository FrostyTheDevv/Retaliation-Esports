import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await checkAdmin()
    const { id } = await params
    const body = await req.json()

    const updateData: any = {
      status: body.status,
    }

    if (body.status === "resolved") {
      updateData.action = body.action
      updateData.resolution = body.resolution
      updateData.reviewNotes = body.reviewNotes
      updateData.reviewedBy = session.user.id
      updateData.reviewedAt = new Date()
    } else if (body.status === "under_review") {
      updateData.reviewedBy = session.user.id
    }

    const dispute = await prisma.dispute.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(dispute)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update dispute" },
      { status: 500 }
    )
  }
}
