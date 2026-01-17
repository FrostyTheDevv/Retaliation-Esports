import { getCurrentUser } from "@/lib/auth-utils"
import { signOut } from "@/lib/auth"
import { LogOut, User } from "lucide-react"
import Image from "next/image"

export default async function AdminHeader() {
  const user = await getCurrentUser()

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Page Title - Can be dynamic later */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-white">Admin Dashboard</h2>
      </div>

      {/* User Profile & Logout */}
      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>

        {/* Logout Button */}
        <form action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}>
          <button
            type="submit"
            className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Sign Out</span>
          </button>
        </form>
      </div>
    </header>
  )
}
