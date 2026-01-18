import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
// @ts-ignore - TypeScript cache issue
import { createNotification } from "@/lib/notifications"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId } = await params
    const body = await req.json()
    const { teamScore, opponentScore, winnerId, teamId } = body

    // Validate scores
    if (typeof teamScore !== "number" || typeof opponentScore !== "number" || teamScore < 0 || opponentScore < 0) {
      return NextResponse.json({ error: "Invalid scores" }, { status: 400 })
    }

    if (teamScore === opponentScore) {
      return NextResponse.json({ error: "Scores cannot be tied" }, { status: 400 })
    }

    // Get match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        team1: true,
        team2: true,
      },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    // Verify team is in this match
    if (match.team1Id !== teamId && match.team2Id !== teamId) {
      return NextResponse.json({ error: "Not authorized for this match" }, { status: 403 })
    }

    // Determine which team is submitting
    const isTeam1 = match.team1Id === teamId
    
    // Update match with team-submitted scores
    const updateData: any = {}
    
    if (isTeam1) {
      updateData.team1SubmittedScore = teamScore
      updateData.team1SubmittedWinner = winnerId
      
      // Check if team2 has already submitted
      if (match.team2SubmittedScore !== null && match.team2SubmittedWinner) {
        // Both teams submitted - check if they match
        const scoresMatch = 
          (teamScore === match.team2SubmittedScore && opponentScore === match.team2SubmittedScore) ||
          (teamScore === match.team2SubmittedScore && opponentScore === match.team1SubmittedScore)
        
        const winnersMatch = winnerId === match.team2SubmittedWinner
        
        if (scoresMatch && winnersMatch) {
          // Results match - auto-accept and mark as completed
          updateData.team1Score = teamScore
          updateData.team2Score = opponentScore
          updateData.winnerId = winnerId
          updateData.status = "completed"
          updateData.completedAt = new Date()
          updateData.resultsMatch = true
          
          // Create notification for admins
          await createNotification({
            recipientType: "admin",
            type: "match_results_agreed",
            title: "Match Results Agreed",
            message: `Both teams agreed on the result for Match ${match.matchNumber}. Winner: ${match.team1?.name || match.team2?.name}`,
            priority: "normal",
            tournamentId: match.tournamentId,
            matchId: match.id,
          })
        } else {
          // Results don't match - flag for admin review
          updateData.resultsMatch = false
          
          await createNotification({
            recipientType: "admin",
            type: "result_dispute",
            title: "Match Results Conflict",
            message: `Teams submitted conflicting results for Match ${match.matchNumber}. Admin review required.`,
            priority: "high",
            tournamentId: match.tournamentId,
            matchId: match.id,
            relatedUrl: `/admin/tournaments/${match.tournamentId}/monitor`,
          })
        }
      }
    } else {
      updateData.team2SubmittedScore = teamScore
      updateData.team2SubmittedWinner = winnerId
      
      // Check if team1 has already submitted
      if (match.team1SubmittedScore !== null && match.team1SubmittedWinner) {
        const scoresMatch = 
          (teamScore === match.team1SubmittedScore && opponentScore === match.team2SubmittedScore) ||
          (teamScore === match.team1SubmittedScore && opponentScore === match.team1SubmittedScore)
        
        const winnersMatch = winnerId === match.team1SubmittedWinner
        
        if (scoresMatch && winnersMatch) {
          updateData.team1Score = opponentScore
          updateData.team2Score = teamScore
          updateData.winnerId = winnerId
          updateData.status = "completed"
          updateData.completedAt = new Date()
          updateData.resultsMatch = true
          
          await createNotification({
            recipientType: "admin",
            type: "match_results_agreed",
            title: "Match Results Agreed",
            message: `Both teams agreed on the result for Match ${match.matchNumber}. Winner: ${match.team1?.name || match.team2?.name}`,
            priority: "normal",
            tournamentId: match.tournamentId,
            matchId: match.id,
          })
        } else {
          updateData.resultsMatch = false
          
          await createNotification({
            recipientType: "admin",
            type: "result_dispute",
            title: "Match Results Conflict",
            message: `Teams submitted conflicting results for Match ${match.matchNumber}. Admin review required.`,
            priority: "high",
            tournamentId: match.tournamentId,
            matchId: match.id,
            relatedUrl: `/admin/tournaments/${match.tournamentId}/monitor`,
          })
        }
      }
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: updateData,
    })

    // Notify opponent team
    const opponentTeamId = isTeam1 ? match.team2Id : match.team1Id
    if (opponentTeamId) {
      await createNotification({
        recipientType: "team",
        recipientId: opponentTeamId,
        type: "result_submitted",
        title: "Opponent Submitted Match Result",
        message: `Your opponent has submitted their match result for Match ${match.matchNumber}. Please submit your result.`,
        priority: "high",
        tournamentId: match.tournamentId,
        matchId: match.id,
      })
    }

    return NextResponse.json(updatedMatch)
  } catch (error: any) {
    console.error("Failed to submit result:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit result" },
      { status: 500 }
    )
  }
}
