import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdmin()
    const { id } = await params
    const body = await req.json()

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        signups: {
          where: { status: "approved" },
        },
      },
    })

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      )
    }

    // In a real implementation, this would send emails
    // For now, just return success with recipient count
    const recipients = tournament.signups.map((s: any) => s.captainEmail)

    // TODO: Implement email sending service (e.g., Resend, SendGrid)
    // await sendEmail({
    //   to: recipients,
    //   subject: body.subject,
    //   html: body.message,
    // })

    return NextResponse.json({
      success: true,
      recipientCount: recipients.length,
      message: "Message queued for delivery (email service not yet configured)",
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    )
  }
}
