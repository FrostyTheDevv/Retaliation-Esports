import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// TODO: Implement this route once user authentication is complete (Phase 5)
// This route requires authenticated users to register for tournaments
// The signup will be linked to the user's account via userId

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    return NextResponse.json(
      { error: "Tournament registration requires user authentication. Please sign in first." },
      { status: 501 } // 501 Not Implemented
    )
    
    // TODO: Phase 5 Implementation
    // 1. Get authenticated user session
    // 2. Validate tournament is open for registration
    // 3. Check user hasn't already registered
    // 4. Create signup with userId
    // 5. Return success response
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to register" },
      { status: 500 }
    )
  }
}
