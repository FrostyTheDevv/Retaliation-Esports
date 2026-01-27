import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import {
  sendTournamentReminderEmail,
  sendEmail,
} from "@/lib/email"

export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ id: string }>
}

// Send emails to tournament participants
export async function POST(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const { type, subject, message, recipientFilter } = body

    // Get tournament with signups
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        signups: {
          where: {
            status: recipientFilter === "all" ? undefined : recipientFilter === "verified" ? undefined : recipientFilter,
            isVerified: recipientFilter === "verified" ? true : undefined,
          },
          include: {
            team: true,
          },
        },
      },
    })

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const signup of tournament.signups) {
      if (!signup.captainEmail) continue

      try {
        let result

        if (type === "reminder") {
          // Send predefined reminder email
          result = await sendTournamentReminderEmail(
            signup.captainEmail,
            signup.team?.name || signup.teamName,
            tournament.name,
            new Date(tournament.startDate),
            tournament.id,
            body.reminderType || "24h"
          )
        } else if (type === "custom") {
          // Send custom announcement email
          result = await sendEmail({
            to: signup.captainEmail,
            subject: subject || `Update: ${tournament.name}`,
            html: generateCustomEmailHtml(
              signup.team?.name || signup.teamName,
              tournament.name,
              message,
              subject
            ),
          })
        }

        if (result?.success) {
          results.sent++
        } else {
          results.failed++
          results.errors.push(`Failed to send to ${signup.captainEmail}`)
        }
      } catch (error) {
        results.failed++
        results.errors.push(`Error sending to ${signup.captainEmail}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${results.sent} emails, ${results.failed} failed`,
      results,
    })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    )
  }
}

function generateCustomEmailHtml(
  teamName: string,
  tournamentName: string,
  message: string,
  subject: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 12px; border: 1px solid #27272a;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #77010F 0%, #5A010C 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">RETALIATION ESPORTS</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">${subject}</h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi <strong style="color: #ffffff;">${teamName}</strong>,
              </p>
              
              <div style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ${message.replace(/\n/g, "<br>")}
              </div>
              
              <!-- Tournament Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #27272a; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #71717a; font-size: 14px; margin: 0;">
                      Regarding: <strong style="color: #ffffff;">${tournamentName}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; border-top: 1px solid #27272a; text-align: center;">
              <p style="color: #71717a; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Retaliation Esports. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
