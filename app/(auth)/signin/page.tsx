"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function SigninPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    // Check for signup success message
    if (searchParams.get("signup") === "success") {
      setSuccessMessage("Account created successfully! Please sign in.")
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.usernameOrEmail) {
      newErrors.usernameOrEmail = "Username or email is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSuccessMessage("")

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.error })
        } else {
          setErrors({ general: data.error || "Failed to sign in" })
        }
        return
      }

      // Success - redirect to returnUrl or tournaments
      const returnUrl = searchParams.get("returnUrl") || "/tournaments"
      router.push(returnUrl)
      router.refresh()
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-linear-to-b from-[#77010F]/20 via-black to-black pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 shadow-xl">
            {/* Title */}
            <h1 className="text-3xl font-bold text-white text-center mb-2 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Sign in to your account
            </p>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-6">
                <p className="text-green-500 text-sm">{successMessage}</p>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                <p className="text-red-500 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username or Email */}
              <div>
                <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg focus:ring-2 focus:ring-[#77010F] focus:border-transparent transition-all outline-none text-white ${
                    errors.usernameOrEmail ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Enter your username or email"
                  autoComplete="username"
                  disabled={isLoading}
                />
                {errors.usernameOrEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.usernameOrEmail}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg focus:ring-2 focus:ring-[#77010F] focus:border-transparent transition-all outline-none text-white ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link (Future) */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-400 transition-colors disabled:cursor-not-allowed"
                  disabled
                  title="Coming soon"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#77010F] hover:bg-[#5A010C] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#77010F] hover:text-[#5A010C] font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>

            {/* Back to Home */}
            <p className="text-center mt-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
