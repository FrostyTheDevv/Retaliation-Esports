import { NextRequest, NextResponse } from "next/server"
import { put, remove } from "@vercel/blob"
import { requireAdmin } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string || "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Blob storage not configured" }, { status: 500 })
    }
    
    const blob = await put(`${folder}/${file.name}`, file, { token })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Failed to upload file:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Blob storage not configured" }, { status: 500 })
    }

    await remove(url, { token })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete file:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
