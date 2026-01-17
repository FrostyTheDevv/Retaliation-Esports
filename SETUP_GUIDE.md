# Complete Backend Setup Guide

## 1. Vercel Postgres Database Setup

1. **Go to your Vercel Dashboard:**
   - Visit: https://vercel.com/williams-projects-a92da2ed/retaliation-esports
   - Click on the **"Storage"** tab

2. **Create Postgres Database:**
   - Click **"Create Database"**
   - Select **"Postgres"**
   - Choose region: **US East** (or closest to your users)
   - Click **"Create"**

3. **Copy the Database URLs:**
   - After creation, you'll see several connection strings
   - Copy the **"POSTGRES_PRISMA_URL"** value (this is for connection pooling)
   - Example format: `postgresql://user:pass@host.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15`

---

## 2. Discord OAuth Application Setup

1. **Go to Discord Developer Portal:**
   - Visit: https://discord.com/developers/applications
   - Click **"New Application"**
   - Name it: **"Retaliation Esports Website"**
   - Click **"Create"**

2. **Configure OAuth2:**
   - In left sidebar, click **"OAuth2"**
   - Click **"Add Redirect"**
   - Add these redirect URLs:
     - `https://your-vercel-url.vercel.app/api/auth/callback/discord`
     - `http://localhost:3000/api/auth/callback/discord` (for local dev)
   - Click **"Save Changes"**

3. **Copy Client Credentials:**
   - Copy **"CLIENT ID"**
   - Click **"Reset Secret"** and copy the **"CLIENT SECRET"**
   - ⚠️ Save these securely - you'll need them next

4. **Bot Settings (Optional - for future phases):**
   - Click **"Bot"** in left sidebar
   - Click **"Reset Token"** and copy the **Bot Token**
   - Under **"Privileged Gateway Intents"**, enable:
     - ✅ Presence Intent
     - ✅ Server Members Intent
     - ✅ Message Content Intent
   - Click **"Save Changes"**

5. **Get Your Discord Guild (Server) ID:**
   - Open Discord app
   - Enable Developer Mode: Settings → Advanced → Developer Mode (toggle ON)
   - Right-click your "Retaliation Esports" server → Copy Server ID
   - This is your `DISCORD_GUILD_ID`

6. **Get Admin Role IDs:**
   - In Discord, go to Server Settings → Roles
   - Right-click each admin role → Copy Role ID
   - You already have these: `774922425548013609,1364298754030698499,1291856690484088924,1163168152381825034`

---

## 3. Add Environment Variables to Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/williams-projects-a92da2ed/retaliation-esports
   - Click **"Settings"** → **"Environment Variables"**

2. **Add Each Variable:**
   Click **"Add New"** for each:

   **Database (auto-added by Postgres, but verify):**
   ```
   Name: DATABASE_URL
   Value: [The POSTGRES_PRISMA_URL you copied]
   Environment: Production, Preview, Development (all checked)
   ```

   **NextAuth Configuration:**
   ```
   Name: NEXTAUTH_URL
   Value: https://your-actual-vercel-url.vercel.app
   Environment: Production, Preview
   ```
   ```
   Name: NEXTAUTH_SECRET
   Value: T121NzUsO4e/hEVc3yFrb0LX0nAs9tmaDcBlUrrRYxg=
   Environment: Production, Preview, Development (all checked)
   ```

   **Discord OAuth:**
   ```
   Name: DISCORD_CLIENT_ID
   Value: [Your Discord Application Client ID]
   Environment: Production, Preview, Development
   ```
   ```
   Name: DISCORD_CLIENT_SECRET
   Value: [Your Discord Application Client Secret]
   Environment: Production, Preview, Development
   ```
   ```
   Name: DISCORD_GUILD_ID
   Value: 1456358951330513103
   Environment: Production, Preview, Development
   ```
   ```
   Name: DISCORD_ADMIN_ROLE_IDS
   Value: 774922425548013609,1364298754030698499,1291856690484088924,1163168152381825034
   Environment: Production, Preview, Development
   ```

   **Discord Bot (Optional - for future tournament reminders):**
   ```
   Name: DISCORD_BOT_TOKEN
   Value: [Your Discord Bot Token - if you created one]
   Environment: Production, Preview, Development
   ```

3. **Click "Save" after adding each variable**

---

## 4. Setup Local Development Environment

1. **Pull Vercel Environment Variables:**
   ```powershell
   vercel env pull .env.local
   ```
   This downloads all your Vercel environment variables locally.

2. **Verify .env.local was created:**
   - Check that `c:\Users\billy\OneDrive\Desktop\Retaliation Esports\.env.local` exists
   - This file is gitignored automatically

---

## 5. Run Database Migrations

1. **Generate Prisma Client:**
   ```powershell
   npx prisma generate
   ```

2. **Run Migrations to Production Database:**
   ```powershell
   npx prisma migrate deploy
   ```
   This creates all your database tables in Vercel Postgres.

3. **Seed Database (Optional - add test data):**
   ```powershell
   npx prisma db seed
   ```

---

## 6. Redeploy to Production

1. **Commit any remaining changes:**
   ```powershell
   git add .
   git commit -m "chore: Update setup configuration"
   git push
   ```

2. **Deploy to production:**
   ```powershell
   vercel --prod
   ```

---

## 7. Test Your Deployment

1. **Visit your production URL:**
   - https://your-vercel-url.vercel.app

2. **Test Discord OAuth:**
   - Click "Sign In" button
   - Should redirect to Discord
   - Authorize the application
   - Should redirect back and show your Discord profile

3. **Test Admin Access:**
   - If you have one of the admin roles in the Discord server, you should see "Admin Dashboard"
   - Go to `/admin` route
   - Should see the admin interface

4. **Test Roster Management:**
   - Go to `/admin/rosters`
   - Create a test roster
   - Add a player
   - View public roster pages at `/rosters`

---

## 8. Local Development Setup

**To run locally after configuration:**

1. **Start development server:**
   ```powershell
   npm run dev
   ```

2. **Access locally:**
   - Open: http://localhost:3000
   - Discord OAuth will work with localhost redirect you configured

3. **View database:**
   ```powershell
   npx prisma studio
   ```
   Opens a GUI at http://localhost:5555 to view/edit database.

---

## Troubleshooting

**"Can't reach database server":**
- Verify `DATABASE_URL` in Vercel is correct
- Check database is in same region as deployment
- Redeploy after adding env vars

**Discord OAuth "redirect_uri_mismatch":**
- Verify redirect URL in Discord app matches exactly
- Format: `https://your-url.vercel.app/api/auth/callback/discord`
- No trailing slash!

**"Unauthorized" after signing in:**
- Verify `DISCORD_GUILD_ID` is correct
- Verify `DISCORD_ADMIN_ROLE_IDS` are correct
- Make sure you have one of those roles in the Discord server
- Check you're in the correct Discord server

**Prisma migration fails:**
- Run `vercel env pull .env.local` first
- Verify `DATABASE_URL` in `.env.local`
- Try `npx prisma migrate reset` (⚠️ deletes data!)

---

## Next Steps After Setup

Once everything is working:

✅ Phase 1: Foundation - COMPLETE
✅ Phase 2: Authentication & Admin - COMPLETE  
✅ Phase 3: Roster Management - COMPLETE
📋 Phase 4: Tournament System - NEXT

Phase 4 will include:
- Tournament CRUD with bracket generation
- Team registration system
- Email verification
- Match scheduling
- Results tracking
- Discord bot integration for reminders
