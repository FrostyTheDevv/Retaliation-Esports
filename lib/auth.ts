import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile) {
        try {
          // Check if user already exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email as string },
          })

          // Fetch guild member info to get roles
          const guildId = process.env.DISCORD_GUILD_ID!
          const response = await fetch(
            `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          )

          if (response.ok) {
            const memberData = await response.json()
            
            // If user exists with email but no discordId, link the Discord account
            if (existingUser && !existingUser.discordId) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  discordId: profile.id as string,
                  discriminator: profile.discriminator as string,
                  avatar: profile.avatar as string,
                  guildRoles: memberData.roles || [],
                },
              })
              // Update the account record to link to existing user
              if (account.userId) {
                account.userId = existingUser.id
              }
            } else {
              // Update or create user with Discord info and roles
              await prisma.user.upsert({
                where: { discordId: profile.id as string },
                update: {
                  username: profile.username as string,
                  discriminator: profile.discriminator as string,
                  email: profile.email as string,
                  avatar: profile.avatar as string,
                  guildRoles: memberData.roles || [],
                },
                create: {
                  discordId: profile.id as string,
                  username: profile.username as string,
                  discriminator: profile.discriminator as string,
                  email: profile.email as string,
                  avatar: profile.avatar as string,
                  guildRoles: memberData.roles || [],
                },
              })
            }
          }
        } catch (error) {
          console.error("Error fetching guild member data:", error)
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session.user && user) {
        // Add user ID and Discord info to session
        // When using database sessions, 'user' is the full user object from the database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            discordId: true,
            username: true,
            guildRoles: true,
          },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.discordId = dbUser.discordId || undefined
          session.user.guildRoles = dbUser.guildRoles
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
})

// Helper function to check if user is admin
export async function checkAdmin() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  // DISCORD_ADMIN_ROLE_IDS contains Discord user IDs, not role IDs
  const adminUserIds = process.env.DISCORD_ADMIN_ROLE_IDS?.split(",") || []
  const userDiscordId = (session.user as any).discordId
  
  const isAdmin = adminUserIds.includes(userDiscordId)
  
  if (!isAdmin) {
    throw new Error("Forbidden - Admin access required")
  }

  return session
}
