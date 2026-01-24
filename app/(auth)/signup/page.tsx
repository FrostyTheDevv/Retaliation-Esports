"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

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

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (formData.username.length > 20) {
      newErrors.username = "Username must be less than 20 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.error })
        } else {
          setErrors({ general: data.error || "Failed to create account" })
        }
        return
      }

      // Success - redirect to signin with success message
      router.push("/signin?signup=success")
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
              Create Account
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Join Retaliation Esports
            </p>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                <p className="text-red-500 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg focus:ring-2 focus:ring-[#77010F] focus:border-transparent transition-all outline-none text-white ${
                    errors.username ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg focus:ring-2 focus:ring-[#77010F] focus:border-transparent transition-all outline-none text-white ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg focus:ring-2 focus:ring-[#77010F] focus:border-transparent transition-all outline-none text-white ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#77010F] hover:bg-[#5A010C] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-gray-400 mt-6">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#77010F] hover:text-[#5A010C] font-medium transition-colors"
              >
                Sign In
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
