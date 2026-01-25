import Link from "next/link"
import { auth } from "@/lib/auth"
import { ADMIN_ROLE_IDS } from "@/lib/constants"

export default async function UnauthorizedPage() {
  const session = await auth()
  const userDiscordId = session?.user?.discordId as string
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#77010F]/20 via-black to-black pointer-events-none" />
      
      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-zinc-800 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#77010F]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#77010F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Access Denied
            </h1>
            <p className="text-gray-400">
              You don't have permission to access the admin panel.
            </p>
          </div>

          {/* Debug info - remove in production */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6 text-left text-xs font-mono">
            <p className="text-gray-400 mb-2">Debug Info (remove later):</p>
            <p className="text-white">Your Discord ID: <span className="text-yellow-400">{userDiscordId || "NOT SET"}</span></p>
            <p className="text-white mt-1">Admin IDs: <span className="text-green-400">{ADMIN_ROLE_IDS.join(", ") || "EMPTY"}</span></p>
            <p className="text-white mt-1">Match: <span className={userDiscordId && ADMIN_ROLE_IDS.includes(userDiscordId) ? "text-green-400" : "text-red-400"}>
              {userDiscordId && ADMIN_ROLE_IDS.includes(userDiscordId) ? "YES" : "NO"}
            </span></p>
          </div>

          <div className="bg-[#77010F]/10 border border-[#77010F]/30 rounded-lg p-4 mb-6">
            <p className="text-[#FF6B6B] text-sm">
              Admin access requires authorization. If you believe this is an error, please contact a server administrator.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block bg-[#77010F] hover:bg-[#5A010C] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
