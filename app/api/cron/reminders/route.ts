import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendTournamentReminderEmail } from "@/lib/email"

// This endpoint is designed to be called by Vercel Cron
// Configure in vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 * * * *" }] }

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const results = {
      sent24h: 0,
      sent1h: 0,
      sentStarting: 0,
      errors: 0,
    }

    // Find tournaments starting in ~24 hours (23-25 hours from now)
    const in24hStart = new Date(now.getTime() + 23 * 60 * 60 * 1000)
    const in24hEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000)

    const tournaments24h = await prisma.tournament.findMany({
      where: {
        startDate: {
          gte: in24hStart,
          lte: in24hEnd,
        },
        status: {
          in: ["open", "ongoing"],
        },
      },
      include: {
        signups: {
          where: {
            isVerified: true,
            status: {
              in: ["pending", "approved"],
            },
          },
        },
      },
    })

    // Send 24h reminders
    for (const tournament of tournaments24h) {
      for (const signup of tournament.signups) {
        try {
          await sendTournamentReminderEmail(
            signup.captainEmail,
            signup.teamName,
            tournament.name,
            tournament.startDate,
            tournament.id,
            "24h"
          )
          results.sent24h++
        } catch (error) {
          console.error(`Failed to send 24h reminder to ${signup.captainEmail}:`, error)
          results.errors++
        }
      }
    }

    // Find tournaments starting in ~1 hour (50-70 minutes from now)
    const in1hStart = new Date(now.getTime() + 50 * 60 * 1000)
    const in1hEnd = new Date(now.getTime() + 70 * 60 * 1000)

    const tournaments1h = await prisma.tournament.findMany({
      where: {
        startDate: {
          gte: in1hStart,
          lte: in1hEnd,
        },
        status: {
          in: ["open", "ongoing"],
        },
      },
      include: {
        signups: {
          where: {
            isVerified: true,
            status: {
              in: ["pending", "approved"],
            },
          },
        },
      },
    })

    // Send 1h reminders
    for (const tournament of tournaments1h) {
      for (const signup of tournament.signups) {
        try {
          await sendTournamentReminderEmail(
            signup.captainEmail,
            signup.teamName,
            tournament.name,
            tournament.startDate,
            tournament.id,
            "1h"
          )
          results.sent1h++
        } catch (error) {
          console.error(`Failed to send 1h reminder to ${signup.captainEmail}:`, error)
          results.errors++
        }
      }
    }

    // Find tournaments starting now (within last 5 minutes)
    const startingNowStart = new Date(now.getTime() - 5 * 60 * 1000)
    const startingNowEnd = new Date(now.getTime() + 5 * 60 * 1000)

    const tournamentsStarting = await prisma.tournament.findMany({
      where: {
        startDate: {
          gte: startingNowStart,
          lte: startingNowEnd,
        },
        status: "ongoing",
      },
      include: {
        signups: {
          where: {
            isVerified: true,
            status: "approved",
            reminderSent: false,
          },
        },
      },
    })

    // Send "starting now" reminders
    for (const tournament of tournamentsStarting) {
      for (const signup of tournament.signups) {
        try {
          await sendTournamentReminderEmail(
            signup.captainEmail,
            signup.teamName,
            tournament.name,
            tournament.startDate,
            tournament.id,
            "starting"
          )
          
          // Mark reminder as sent
          await prisma.tournamentSignup.update({
            where: { id: signup.id },
            data: { reminderSent: true },
          })
          
          results.sentStarting++
        } catch (error) {
          console.error(`Failed to send starting reminder to ${signup.captainEmail}:`, error)
          results.errors++
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Reminder job completed",
      results,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error("Reminder cron error:", error)
    return NextResponse.json(
      { error: "Reminder job failed" },
      { status: 500 }
    )
  }
}
