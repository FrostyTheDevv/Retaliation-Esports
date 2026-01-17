import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      discordId?: string
      guildRoles?: string[]
      username?: string
    } & DefaultSession["user"]
  }

  interface User {
    discordId?: string
    guildRoles?: string[]
    username?: string
  }
}
