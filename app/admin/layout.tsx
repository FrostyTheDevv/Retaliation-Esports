import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ADMIN_ROLE_IDS } from "@/lib/constants"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()
  
  // Not authenticated - redirect to signin
  if (!session?.user) {
    redirect("/auth/signin")
  }
  
  // Authenticated but not admin - redirect to unauthorized
  const userDiscordId = session.user.discordId as string
  if (!userDiscordId || !ADMIN_ROLE_IDS.includes(userDiscordId)) {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      
      <div className="lg:pl-64">
        <AdminHeader />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
