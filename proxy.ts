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

    // Check for admin role
    const userRoles = (session.user.guildRoles as string[]) || []
    const adminRoleIds = process.env.DISCORD_ADMIN_ROLE_IDS?.split(",") || []
    
    const hasAdminRole = userRoles.some((roleId) => adminRoleIds.includes(roleId))
    
    if (!hasAdminRole) {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
