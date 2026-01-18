export interface TimeZoneInfo {
  value: string // IANA timezone identifier (e.g., "America/New_York")
  label: string // Display name (e.g., "Eastern Time (ET)")
  offset: string // UTC offset (e.g., "UTC-5")
  abbr: string // Abbreviation (e.g., "EST" or "EDT")
}

/**
 * Get comprehensive list of common timezones
 */
export function getTimezones(): TimeZoneInfo[] {
  return [
    // US Timezones
    { value: "America/New_York", label: "Eastern Time", offset: "UTC-5", abbr: "EST" },
    { value: "America/Chicago", label: "Central Time", offset: "UTC-6", abbr: "CST" },
    { value: "America/Denver", label: "Mountain Time", offset: "UTC-7", abbr: "MST" },
    { value: "America/Los_Angeles", label: "Pacific Time", offset: "UTC-8", abbr: "PST" },
    { value: "America/Anchorage", label: "Alaska Time", offset: "UTC-9", abbr: "AKST" },
    { value: "Pacific/Honolulu", label: "Hawaii Time", offset: "UTC-10", abbr: "HST" },

    // Canadian Timezones
    { value: "America/Halifax", label: "Atlantic Time", offset: "UTC-4", abbr: "AST" },
    { value: "America/St_Johns", label: "Newfoundland Time", offset: "UTC-3:30", abbr: "NST" },

    // European Timezones
    { value: "Europe/London", label: "British Time", offset: "UTC+0", abbr: "GMT" },
    { value: "Europe/Paris", label: "Central European Time", offset: "UTC+1", abbr: "CET" },
    { value: "Europe/Athens", label: "Eastern European Time", offset: "UTC+2", abbr: "EET" },
    { value: "Europe/Moscow", label: "Moscow Time", offset: "UTC+3", abbr: "MSK" },

    // Asian Timezones
    { value: "Asia/Dubai", label: "Gulf Standard Time", offset: "UTC+4", abbr: "GST" },
    { value: "Asia/Karachi", label: "Pakistan Time", offset: "UTC+5", abbr: "PKT" },
    { value: "Asia/Kolkata", label: "India Time", offset: "UTC+5:30", abbr: "IST" },
    { value: "Asia/Shanghai", label: "China Time", offset: "UTC+8", abbr: "CST" },
    { value: "Asia/Tokyo", label: "Japan Time", offset: "UTC+9", abbr: "JST" },
    { value: "Asia/Seoul", label: "Korea Time", offset: "UTC+9", abbr: "KST" },

    // Australian Timezones
    { value: "Australia/Sydney", label: "Australian Eastern Time", offset: "UTC+10", abbr: "AEST" },
    { value: "Australia/Adelaide", label: "Australian Central Time", offset: "UTC+9:30", abbr: "ACST" },
    { value: "Australia/Perth", label: "Australian Western Time", offset: "UTC+8", abbr: "AWST" },

    // Other
    { value: "UTC", label: "Coordinated Universal Time", offset: "UTC+0", abbr: "UTC" },
  ]
}

/**
 * Convert a date from one timezone to another
 */
export function convertTimezone(date: Date, fromTz: string, toTz: string): Date {
  const dateStr = date.toLocaleString("en-US", { timeZone: fromTz })
  const localDate = new Date(dateStr)
  const targetStr = localDate.toLocaleString("en-US", { timeZone: toTz })
  return new Date(targetStr)
}

/**
 * Format date with timezone
 */
export function formatWithTimezone(date: Date, timezone: string): string {
  return date.toLocaleString("en-US", {
    timeZone: timezone,
    dateStyle: "medium",
    timeStyle: "short",
  })
}

/**
 * Get current time in a specific timezone
 */
export function getCurrentTimeInTimezone(timezone: string): Date {
  const now = new Date()
  const str = now.toLocaleString("en-US", { timeZone: timezone })
  return new Date(str)
}

/**
 * Check if a match time works for both teams' timezones
 */
export function isTimeConflict(
  matchTime: Date,
  team1Timezone: string,
  team2Timezone: string,
  minHour = 8, // 8 AM
  maxHour = 23 // 11 PM
): { conflict: boolean; team1Local: Date; team2Local: Date; reason?: string } {
  const team1Local = convertTimezone(matchTime, "UTC", team1Timezone)
  const team2Local = convertTimezone(matchTime, "UTC", team2Timezone)

  const team1Hour = team1Local.getHours()
  const team2Hour = team2Local.getHours()

  if (team1Hour < minHour || team1Hour > maxHour) {
    return {
      conflict: true,
      team1Local,
      team2Local,
      reason: `Match time is ${team1Hour}:00 for Team 1 (outside ${minHour}:00-${maxHour}:00 window)`,
    }
  }

  if (team2Hour < minHour || team2Hour > maxHour) {
    return {
      conflict: true,
      team1Local,
      team2Local,
      reason: `Match time is ${team2Hour}:00 for Team 2 (outside ${minHour}:00-${maxHour}:00 window)`,
    }
  }

  return { conflict: false, team1Local, team2Local }
}

/**
 * Find optimal match time for two teams
 */
export function findOptimalMatchTime(
  team1Timezone: string,
  team2Timezone: string,
  preferredHour = 18, // 6 PM
  dayOffset = 0 // days from now
): Date {
  const now = new Date()
  const targetDate = new Date(now)
  targetDate.setDate(targetDate.getDate() + dayOffset)
  targetDate.setHours(preferredHour, 0, 0, 0)

  // Convert to UTC
  const utcStr = targetDate.toLocaleString("en-US", { timeZone: "UTC" })
  return new Date(utcStr)
}

/**
 * Get timezone offset in hours
 */
export function getTimezoneOffset(timezone: string): number {
  const now = new Date()
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }))
  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
  const diff = tzDate.getTime() - utcDate.getTime()
  return diff / (1000 * 60 * 60)
}
