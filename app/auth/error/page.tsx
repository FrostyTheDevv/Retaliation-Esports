import Link from "next/link"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-dark">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-400">
              Something went wrong during sign in.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-mono">
                Error: {error}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block text-gray-400 hover:text-white transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
