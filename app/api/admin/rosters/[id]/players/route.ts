import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
// @ts-ignore - TypeScript cache issue
import { prisma } from "@/lib/prisma"
// @ts-ignore - TypeScript cache issue
import { requireAdmin } from "@/lib/auth-utils"

const playerSchema = z.object({
  name: z.string().min(1, "Name is required"),
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
})

// POST /api/admin/rosters/[id]/players - Create new player
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: rosterId } = await params

    // Verify roster exists
    const roster = await prisma.roster.findUnique({
      where: { id: rosterId },
    })

    if (!roster) {
      return NextResponse.json(
        { error: "Roster not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = playerSchema.parse(body)

    // Get the highest displayOrder for this roster
    const lastPlayer = await prisma.player.findFirst({
      where: { rosterId },
      orderBy: { displayOrder: 'desc' },
    })

    const displayOrder = lastPlayer ? lastPlayer.displayOrder + 1 : 0

    // Convert empty strings to null for URLs
    const playerData = {
      ...validatedData,
      image: validatedData.image || null,
      twitter: validatedData.twitter || null,
      twitch: validatedData.twitch || null,
      youtube: validatedData.youtube || null,
      instagram: validatedData.instagram || null,
      steam: validatedData.steam || null,
      rosterId,
      displayOrder,
    }

    const player = await prisma.player.create({
      data: playerData,
    })

    return NextResponse.json(player, { status: 201 })
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
    console.error("Error creating player:", error)
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    )
  }
}
