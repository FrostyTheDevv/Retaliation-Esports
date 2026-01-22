import { put, remove } from "@vercel/blob"

/**
 * Upload a file to Vercel Blob Storage
 * @param file - File to upload
 * @param pathname - Path in blob storage (e.g., 'tournaments/banners/filename.jpg')
 * @returns URL of uploaded file
 */
export async function uploadFile(file: File, pathname: string) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      throw new Error("BLOB_READ_WRITE_TOKEN not configured")
    }
    const blob = await put(pathname, file, { token })
    return blob.url
  } catch (error) {
    console.error("Failed to upload file:", error)
    throw new Error("File upload failed")
  }
}

/**
 * Upload multiple files to Vercel Blob Storage
 * @param files - Array of files to upload
 * @param folder - Folder path in blob storage
 * @returns Array of URLs
 */
export async function uploadMultipleFiles(files: File[], folder: string) {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadFile(file, `${folder}/${file.name}`)
    )
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error("Failed to upload multiple files:", error)
    throw new Error("Multiple file upload failed")
  }
}

/**
 * Delete a file from Vercel Blob Storage
 * @param url - URL of file to delete
 */
export async function deleteFile(url: string) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      throw new Error("BLOB_READ_WRITE_TOKEN not configured")
    }
    await remove(url, { token })
  } catch (error) {
    console.error("Failed to delete file:", error)
    throw new Error("File deletion failed")
  }
}

/**
 * Delete multiple files from Vercel Blob Storage
 * @param urls - Array of URLs to delete
 */
export async function deleteMultipleFiles(urls: string[]) {
  try {
    await Promise.all(urls.map((url) => deleteFile(url)))
  } catch (error) {
    console.error("Failed to delete multiple files:", error)
    throw new Error("Multiple file deletion failed")
  }
}
