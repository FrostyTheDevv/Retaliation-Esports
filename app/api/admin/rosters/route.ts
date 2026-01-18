import { NextRequest, NextResponse } from "next/server"
// @ts-ignore - TypeScript cache issue
import { prisma } from "@/lib/prisma"
// @ts-ignore - TypeScript cache issue
import { requireAdmin } from "@/lib/auth-utils"
import { z } from "zod"

const rosterSchema = z.object({
  name: z.string().min(1, "Roster name is required").max(100),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
})

// GET /api/admin/rosters - List all rosters
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const rosters = await prisma.roster.findMany({
      include: {
        players: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(rosters)
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Failed to fetch rosters:", error)
    return NextResponse.json(
      { error: "Failed to fetch rosters" },
      { status: 500 }
    )
  }
}

// POST /api/admin/rosters - Create new roster
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = rosterSchema.parse(body)

    const roster = await prisma.roster.create({
      data: {
        name: validatedData.name,
        primaryColor: validatedData.primaryColor,
        secondaryColor: validatedData.secondaryColor,
        description: validatedData.description || null,
        image: validatedData.imageUrl || null,
        isActive: validatedData.isActive,
      },
    })

    return NextResponse.json(roster, { status: 201 })
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
    console.error("Failed to create roster:", error)
    return NextResponse.json(
      { error: "Failed to create roster" },
      { status: 500 }
    )
  }
}
