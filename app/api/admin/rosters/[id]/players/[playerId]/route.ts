import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
// @ts-ignore - TypeScript cache issue
import { prisma } from "@/lib/prisma"
// @ts-ignore - TypeScript cache issue
import { requireAdmin } from "@/lib/auth-utils"

const playerSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  inGameName: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  image: z.string().url().nullable().optional().or(z.literal("")),
  goals: z.number().int().min(0).nullable().optional(),
  assists: z.number().int().min(0).nullable().optional(),
  saves: z.number().int().min(0).nullable().optional(),
  twitter: z.string().url().nullable().optional().or(z.literal("")),
  twitch: z.string().url().nullable().optional().or(z.literal("")),
  youtube: z.string().url().nullable().optional().or(z.literal("")),
  instagram: z.string().url().nullable().optional().or(z.literal("")),
  discord: z.string().nullable().optional(),
  steam: z.string().url().nullable().optional().or(z.literal("")),
  displayOrder: z.number().int().min(0).optional(),
})

// GET /api/admin/rosters/[id]/players/[playerId] - Get single player
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; playerId: string }> }
) {
  try {
    await requireAdmin()
    const { id: rosterId, playerId } = await params

    const player = await prisma.player.findUnique({
      where: { 
        id: playerId,
        rosterId,
      },
    })

    if (!player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(player)
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error fetching player:", error)
    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/rosters/[id]/players/[playerId] - Update player
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; playerId: string }> }
) {
  try {
    await requireAdmin()
    const { id: rosterId, playerId } = await params

    // Verify player exists and belongs to roster
    const existingPlayer = await prisma.player.findUnique({
      where: { 
        id: playerId,
        rosterId,
      },
    })

    if (!existingPlayer) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = playerSchema.parse(body)

    // Convert empty strings to null for URLs
    const updateData: Record<string, unknown> = {}
    
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value === "") {
        updateData[key] = null
      } else if (value !== undefined) {
        updateData[key] = value
      }
    })

    const player = await prisma.player.update({
      where: { id: playerId },
      data: updateData,
    })

    return NextResponse.json(player)
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
    console.error("Error updating player:", error)
    return NextResponse.json(
      { error: "Failed to update player" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/rosters/[id]/players/[playerId] - Delete player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; playerId: string }> }
) {
  try {
    await requireAdmin()
    const { id: rosterId, playerId } = await params

    // Verify player exists and belongs to roster
    const player = await prisma.player.findUnique({
      where: { 
        id: playerId,
        rosterId,
      },
    })

    if (!player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      )
    }

    await prisma.player.delete({
      where: { id: playerId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error deleting player:", error)
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    )
  }
}
