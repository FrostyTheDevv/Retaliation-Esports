import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth-utils"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  try {
    await requireAdmin()
  } catch (error) {
    redirect("/auth/signin")
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
