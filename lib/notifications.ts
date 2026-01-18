import { prisma } from "@/lib/prisma"

interface CreateNotificationParams {
  recipientType: "admin" | "team" | "user"
  recipientId?: string
  type: string
  title: string
  message: string
  priority?: "low" | "normal" | "high" | "urgent"
  tournamentId?: string
  matchId?: string
  relatedUrl?: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    return await prisma.notification.create({
      data: {
        recipientType: params.recipientType,
        recipientId: params.recipientId || null,
        type: params.type,
        title: params.title,
        message: params.message,
        priority: params.priority || "normal",
        tournamentId: params.tournamentId || null,
        matchId: params.matchId || null,
        relatedUrl: params.relatedUrl || null,
      },
    })
  } catch (error) {
    console.error("Failed to create notification:", error)
    return null
  }
}

export async function getNotifications(recipientType: string, recipientId?: string, unreadOnly = false) {
  try {
    const where: any = { recipientType }
    
    if (recipientId) {
      where.recipientId = recipientId
    }
    
    if (unreadOnly) {
      where.read = false
    }

    return await prisma.notification.findMany({
      where,
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
      take: 50,
    })
  } catch (error) {
    console.error("Failed to get notifications:", error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    return null
  }
}

export async function dismissNotification(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { dismissed: true },
    })
  } catch (error) {
    console.error("Failed to dismiss notification:", error)
    return null
  }
}
