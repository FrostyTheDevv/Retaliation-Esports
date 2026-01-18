import { z } from 'zod'

// ============================================
// ROSTER SCHEMAS
// ============================================

export const playerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  inGameName: z.string().max(100).optional(),
  role: z.string().max(50).optional(),
  image: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
  goals: z.number().int().nonnegative().optional(),
  assists: z.number().int().nonnegative().optional(),
  saves: z.number().int().nonnegative().optional(),
  twitter: z.string().url().optional().or(z.literal('')),
  twitch: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  discord: z.string().max(100).optional(),
  steam: z.string().url().optional().or(z.literal('')),
})

export const rosterSchema = z.object({
  name: z.string().min(1, 'Roster name is required').max(100),
  tag: z.string().max(10).optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
  image: z.string().url().optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().default(true),
})

// ============================================
// TOURNAMENT SCHEMAS
// ============================================

export const tournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  bannerImage: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).optional(),
  startDate: z.date(),
  registrationDeadline: z.date(),
  discordLink: z.string().url().optional().or(z.literal('')),
  rulesLink: z.string().url().optional().or(z.literal('')),
  streamLink: z.string().url().optional().or(z.literal('')),
  requirements: z.string().optional(),
  gameMode: z.enum(['1v1', '2v2', '3v3']),
  format: z.enum(['single_elimination', 'double_elimination']),
  bestOf: z.number().int().min(1).max(7),
  maxTeams: z.number().int().positive().optional(),
  allowRandomize: z.boolean().default(false),
  prizeInfo: z.string().optional(),
  status: z.enum(['draft', 'open', 'closed', 'ongoing', 'completed']).default('draft'),
  requireEmailVerification: z.boolean().default(true),
  checkInEnabled: z.boolean().default(false),
})

export const tournamentSignupSchema = z.object({
  tournamentId: z.string().cuid(),
  teamName: z.string().min(1, 'Team name is required').max(100),
  captainEmail: z.string().email('Invalid email address'),
  captainDiscord: z.string().max(100).optional(),
  playersInfo: z.array(z.object({
    name: z.string().min(1, 'Player name is required'),
    discord: z.string().optional(),
  })).min(1, 'At least one player is required'),
})

// ============================================
// SUPPORT SCHEMAS
// ============================================

export const supportTicketSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  discord: z.string().max(100).optional(),
  category: z.enum([
    'tournament_question',
    'technical_issue',
    'account_problem',
    'bug_report',
    'partnership',
    'general',
    'other'
  ]),
  priority: z.enum(['normal', 'urgent']).default('normal'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
})

// ============================================
// TEAM SCHEMAS
// ============================================

export const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  tag: z.string().max(10).optional(),
  logo: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
})

// ============================================
// BRACKET & MATCH SCHEMAS
// ============================================

export const bracketGenerationSchema = z.object({
  format: z.enum(['single-elimination', 'double-elimination']),
  randomize: z.boolean().default(false),
  seedingMethod: z.enum(['random', 'manual', 'registration_order']).optional(),
})

export const matchScoreSchema = z.object({
  team1Score: z.number().int().min(0),
  team2Score: z.number().int().min(0),
}).refine((data) => data.team1Score !== data.team2Score, {
  message: 'Scores cannot be tied',
})

export const matchStatusSchema = z.object({
  status: z.enum([
    'pending',
    'ready',
    'live',
    'completed',
    'disputed',
    'postponed',
  ]),
})

export const checkInSchema = z.object({
  teamId: z.string(),
  timestamp: z.date().optional(),
})

export const lobbySchema = z.object({
  lobbyCode: z.string().min(1).max(50).optional(),
  serverInfo: z.string().min(1).max(200).optional(),
})

// ============================================
// DISPUTE SCHEMAS
// ============================================

export const disputeSchema = z.object({
  category: z.enum([
    'score_incorrect',
    'no_show',
    'technical_issue',
    'rule_violation',
    'other',
  ]),
  description: z.string().min(10).max(2000),
  evidence: z.array(z.string().url()).max(10).optional(),
})

export const disputeUpdateSchema = z.object({
  status: z.enum(['pending', 'under_review', 'resolved', 'dismissed']).optional(),
  action: z.enum(['overturn', 'uphold', 'rematch', 'disqualify', 'no_action']).optional(),
  resolution: z.string().min(10).max(2000).optional(),
  reviewNotes: z.string().max(1000).optional(),
})

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateTournamentDates(startDate: Date, deadline: Date) {
  const now = new Date()

  if (deadline >= startDate) {
    return {
      valid: false,
      error: 'Registration deadline must be before tournament start date',
    }
  }

  if (deadline < now) {
    return {
      valid: false,
      error: 'Registration deadline must be in the future',
    }
  }

  return { valid: true }
}

export function validateMatchScore(
  bestOf: number,
  team1Score: number,
  team2Score: number
) {
  const requiredWins = Math.ceil(bestOf / 2)

  if (team1Score < requiredWins && team2Score < requiredWins) {
    return {
      valid: false,
      error: `At least one team must have ${requiredWins} wins for best of ${bestOf}`,
    }
  }

  if (team1Score >= requiredWins && team2Score >= requiredWins) {
    return {
      valid: false,
      error: 'Only one team can reach the required wins',
    }
  }

  return { valid: true }
}

export function validateTeamSize(gameMode: string, playerCount: number) {
  const requirements: Record<string, { min: number; max: number }> = {
    '1v1': { min: 1, max: 1 },
    '2v2': { min: 2, max: 2 },
    '3v3': { min: 3, max: 3 },
    '5v5': { min: 5, max: 5 },
  }

  const req = requirements[gameMode]
  if (!req) {
    return { valid: false, error: 'Invalid game mode' }
  }

  if (playerCount < req.min || playerCount > req.max) {
    return {
      valid: false,
      error: `${gameMode} requires exactly ${req.min} players`,
    }
  }

  return { valid: true }
}

// Type exports
export type PlayerInput = z.infer<typeof playerSchema>
export type RosterInput = z.infer<typeof rosterSchema>
export type TournamentInput = z.infer<typeof tournamentSchema>
export type TournamentSignupInput = z.infer<typeof tournamentSignupSchema>
export type SupportTicketInput = z.infer<typeof supportTicketSchema>
export type TeamInput = z.infer<typeof teamSchema>
export type BracketGenerationInput = z.infer<typeof bracketGenerationSchema>
export type MatchScoreInput = z.infer<typeof matchScoreSchema>
export type DisputeInput = z.infer<typeof disputeSchema>
export type DisputeUpdateInput = z.infer<typeof disputeUpdateSchema>
