// Brand colors extracted from logo (placeholder values - update with actual colors from your logo)
export const colors = {
  brand: {
    primary: '#FF4655',      // Main brand color
    secondary: '#00D9FF',    // Secondary accent
    accent: '#FFA500',       // Accent color
    dark: '#0A0E27',        // Dark background
    light: '#FFFFFF',       // Light text/background
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    muted: '#6B7280',
  },
  background: {
    primary: '#0A0E27',
    secondary: '#111827',
    tertiary: '#1F2937',
  },
}

// Tournament formats
export const TOURNAMENT_FORMATS = {
  SINGLE_ELIMINATION: 'single_elimination',
  DOUBLE_ELIMINATION: 'double_elimination',
} as const

// Game modes
export const GAME_MODES = {
  '1V1': '1v1',
  '2V2': '2v2',
  '3V3': '3v3',
} as const

// Tournament status
export const TOURNAMENT_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
} as const

// Match status
export const MATCH_STATUS = {
  PENDING: 'pending',
  LIVE: 'live',
  COMPLETED: 'completed',
  DISPUTED: 'disputed',
} as const

// Admin role IDs from Discord
export const ADMIN_ROLE_IDS = process.env.DISCORD_ADMIN_ROLE_IDS?.split(',') || []
export const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || '1456358951330513103'

// Site metadata
export const SITE_CONFIG = {
  name: 'Retaliation Esports',
  tagline: "We're finally retaliating.",
  description: 'Official Retaliation Esports website - Home of competitive Rocket League tournaments and teams',
  domain: 'retaliationesports.net',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}
