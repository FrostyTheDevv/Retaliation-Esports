"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface FileUploadProps {
  label: string
  onUpload: (file: File) => Promise<string>
  currentUrl?: string
  onRemove?: () => void
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({
  label,
  onUpload,
  currentUrl,
  onRemove,
  accept = "image/*",
  maxSize = 5,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const [preview, setPreview] = useState<string>(currentUrl || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setError("")
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      const url = await onUpload(file)
      setPreview(url)
    } catch (err) {
      setError("Upload failed. Please try again.")
      setPreview("")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-700"
          />
          <button
            type="button"
            onClick={handleRemove}
            title="Remove image"
            className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={32} className="text-gray-500" />
              <p className="text-sm text-gray-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {accept} (max {maxSize}MB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        aria-label={label}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

interface MultipleFileUploadProps {
  label: string
  onUpload: (files: File[]) => Promise<string[]>
  currentUrls?: string[]
  onRemove?: (url: string) => void
  accept?: string
  maxSize?: number
  maxFiles?: number
}

export function MultipleFileUpload({
  label,
  onUpload,
  currentUrls = [],
  onRemove,
  accept = "image/*",
  maxSize = 5,
  maxFiles = 5,
}: MultipleFileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const [previews, setPreviews] = useState<string[]>(currentUrls)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate max files
    if (previews.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate file sizes
    const oversized = files.find((f) => f.size > maxSize * 1024 * 1024)
    if (oversized) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setError("")
    setUploading(true)

    try {
      // Create previews
      const newPreviews: string[] = []
      for (const file of files) {
        const reader = new FileReader()
        await new Promise((resolve) => {
          reader.onloadend = () => {
            newPreviews.push(reader.result as string)
            resolve(null)
          }
          reader.readAsDataURL(file)
        })
      }

      setPreviews([...previews, ...newPreviews])

      // Upload files
      const urls = await onUpload(files)
      setPreviews([...previews, ...urls])
    } catch (err) {
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (url: string) => {
    setPreviews(previews.filter((p) => p !== url))
    onRemove?.(url)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-700"
            />
            <button
              type="button"
              title="Remove image"
              onClick={() => handleRemove(preview)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {previews.length < maxFiles && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <ImageIcon size={24} className="text-gray-500" />
                <p className="text-xs text-gray-500">Add Image</p>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileChange}
        aria-label={label}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        {previews.length}/{maxFiles} images • Max {maxSize}MB each
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
