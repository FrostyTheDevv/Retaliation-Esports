import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const session = await auth()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    // Check for admin access by Discord user ID
    const userDiscordId = (session.user as any).discordId
    const adminUserIds = process.env.DISCORD_ADMIN_ROLE_IDS?.split(",") || []
    
    const hasAdminAccess = adminUserIds.includes(userDiscordId)
    
    if (!hasAdminAccess) {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
