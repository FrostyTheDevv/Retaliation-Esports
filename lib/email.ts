import { Resend } from "resend"

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@retaliationesports.net"
const SITE_URL = process.env.NEXTAUTH_URL || "https://retaliationesports.net"

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await getResend().emails.send({
      from: `Retaliation Esports <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Email send error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email send exception:", error)
    return { success: false, error }
  }
}

/**
 * Generate a unique verification token
 */
export function generateVerificationToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Send tournament registration verification email
 */
export async function sendVerificationEmail(
  to: string,
  teamName: string,
  tournamentName: string,
  verificationToken: string
) {
  const verificationUrl = `${SITE_URL}/api/tournaments/verify?token=${verificationToken}`

  const html = `
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
              <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">Verify Your Registration</h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering <strong style="color: #ffffff;">${teamName}</strong> for <strong style="color: #77010F;">${tournamentName}</strong>!
              </p>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Please click the button below to verify your email address and complete your registration.
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" style="display: inline-block; background-color: #77010F; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #77010F; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
                ${verificationUrl}
              </p>
              
              <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                This link will expire in 24 hours.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; border-top: 1px solid #27272a; text-align: center;">
              <p style="color: #71717a; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Retaliation Esports. All rights reserved.
              </p>
              <p style="color: #52525b; font-size: 12px; margin: 10px 0 0 0;">
                If you didn't register for this tournament, you can ignore this email.
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

  return sendEmail({
    to,
    subject: `Verify your registration for ${tournamentName}`,
    html,
  })
}

/**
 * Send tournament registration confirmation email (after verification)
 */
export async function sendRegistrationConfirmationEmail(
  to: string,
  teamName: string,
  tournamentName: string,
  tournamentDate: Date,
  tournamentId: string
) {
  const tournamentUrl = `${SITE_URL}/tournaments/${tournamentId}`
  const formattedDate = tournamentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })

  const html = `
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
              <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">🎮 Registration Confirmed!</h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Great news! <strong style="color: #ffffff;">${teamName}</strong> is now registered for <strong style="color: #77010F;">${tournamentName}</strong>!
              </p>
              
              <!-- Tournament Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #27272a; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">Tournament Details</p>
                    <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 5px 0;">📅 ${formattedDate}</p>
                    <p style="color: #a1a1aa; font-size: 14px; margin: 0;">🏆 ${tournamentName}</p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Make sure your team is ready and online before the tournament starts. We'll send you a reminder email 24 hours and 1 hour before the event.
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${tournamentUrl}" style="display: inline-block; background-color: #77010F; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      View Tournament
                    </a>
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

  return sendEmail({
    to,
    subject: `✅ Registration confirmed for ${tournamentName}`,
    html,
  })
}

/**
 * Send tournament reminder email
 */
export async function sendTournamentReminderEmail(
  to: string,
  teamName: string,
  tournamentName: string,
  tournamentDate: Date,
  tournamentId: string,
  reminderType: "24h" | "1h" | "starting"
) {
  const tournamentUrl = `${SITE_URL}/tournaments/${tournamentId}`
  const formattedDate = tournamentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })

  const reminderMessages = {
    "24h": {
      subject: `⏰ 24 hours until ${tournamentName}!`,
      heading: "Tournament in 24 Hours!",
      message: "Your tournament starts tomorrow! Make sure your team is ready and has reviewed all the rules.",
    },
    "1h": {
      subject: `🔔 1 hour until ${tournamentName}!`,
      heading: "Tournament Starts in 1 Hour!",
      message: "Get your team online and warmed up! The tournament is starting very soon.",
    },
    "starting": {
      subject: `🎮 ${tournamentName} is starting NOW!`,
      heading: "Tournament Starting Now!",
      message: "The tournament is beginning! Make sure you're checked in and ready to compete.",
    },
  }

  const reminder = reminderMessages[reminderType]

  const html = `
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
              <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">${reminder.heading}</h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hey <strong style="color: #ffffff;">${teamName}</strong>! ${reminder.message}
              </p>
              
              <!-- Tournament Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #27272a; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">${tournamentName}</p>
                    <p style="color: #a1a1aa; font-size: 14px; margin: 0;">📅 ${formattedDate}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${tournamentUrl}" style="display: inline-block; background-color: #77010F; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      View Tournament
                    </a>
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

  return sendEmail({
    to,
    subject: reminder.subject,
    html,
  })
}

/**
 * Send match notification email
 */
export async function sendMatchNotificationEmail(
  to: string,
  teamName: string,
  opponentName: string,
  tournamentName: string,
  matchTime: Date | null,
  bracketUrl: string
) {
  const formattedTime = matchTime
    ? matchTime.toLocaleDateString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "TBD"

  const html = `
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
              <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">⚔️ Your Match is Ready!</h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                <strong style="color: #ffffff;">${teamName}</strong> vs <strong style="color: #77010F;">${opponentName}</strong>
              </p>
              
              <!-- Match Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #27272a; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="color: #ffffff; font-size: 18px; margin: 0 0 10px 0; font-weight: bold;">${tournamentName}</p>
                    <p style="color: #a1a1aa; font-size: 14px; margin: 0;">🕐 ${formattedTime}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${bracketUrl}" style="display: inline-block; background-color: #77010F; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      View Bracket
                    </a>
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

  return sendEmail({
    to,
    subject: `⚔️ Match Ready: ${teamName} vs ${opponentName} - ${tournamentName}`,
    html,
  })
}
