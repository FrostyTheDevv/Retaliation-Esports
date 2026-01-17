import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Access Denied
            </h1>
            <p className="text-gray-400">
              You don't have permission to access the admin panel.
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">
              Admin access requires specific Discord roles. If you believe this is an error, please contact a server administrator.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
