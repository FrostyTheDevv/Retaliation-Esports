import { NextRequest, NextResponse } from "next/server"
// @ts-ignore - TypeScript cache issue
import { prisma } from "@/lib/prisma"
// @ts-ignore - TypeScript cache issue
import { requireAdmin } from "@/lib/auth-utils"
import { z } from "zod"

const rosterUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  isActive: z.boolean().optional(),
})

// GET /api/admin/rosters/[id] - Get single roster
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const roster = await prisma.roster.findUnique({
      where: { id },
      include: {
        players: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    })

    if (!roster) {
      return NextResponse.json(
        { error: "Roster not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(roster)
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Failed to fetch roster:", error)
    return NextResponse.json(
      { error: "Failed to fetch roster" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/rosters/[id] - Update roster
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await request.json()
    const validatedData = rosterUpdateSchema.parse(body)

    // Check if roster exists
    const existing = await prisma.roster.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Roster not found" },
        { status: 404 }
      )
    }

    // Update roster
    const roster = await prisma.roster.update({
      where: { id },
      data: validatedData,
      include: {
        players: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    })

    return NextResponse.json(roster)
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }
    console.error("Failed to update roster:", error)
    return NextResponse.json(
      { error: "Failed to update roster" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/rosters/[id] - Delete roster
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // Check if roster exists
    const existing = await prisma.roster.findUnique({
      where: { id },
      include: {
        players: true,
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Roster not found" },
        { status: 404 }
      )
    }

    // Delete all players first (cascade)
    await prisma.player.deleteMany({
      where: { rosterId: id },
    })

    // Delete roster
    await prisma.roster.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "Roster deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Failed to delete roster:", error)
    return NextResponse.json(
      { error: "Failed to delete roster" },
      { status: 500 }
    )
  }
}
