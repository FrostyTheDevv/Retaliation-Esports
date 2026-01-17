# Vercel Deployment Guide - Retaliation Esports

## Prerequisites Checklist

Before deploying to Vercel, ensure you have:
- ✅ GitHub repository connected
- ✅ Discord Application created with OAuth2 configured
- ✅ PostgreSQL database (Vercel Postgres or Supabase recommended)
- ✅ All environment variables ready

---

## Step 1: Create Vercel Postgres Database

### Option A: Vercel Postgres (Recommended - Seamless Integration)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose your database name: `retaliation-esports-db`
6. Select region closest to your users
7. Click **Create**

**Copy these connection strings:**
- `POSTGRES_URL` - Full connection string with pooling
- `POSTGRES_PRISMA_URL` - Optimized for Prisma (use this for `DATABASE_URL`)
- `POSTGRES_URL_NON_POOLING` - Direct connection (migrations)

### Option B: Supabase (Free Tier Available)

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (Transaction Pooler mode)
5. Format: `postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

---

## Step 2: Deploy to Vercel

### Deploy from GitHub

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Import Project**
3. Select your GitHub repository: `FrostyTheDevv/Retaliation-Esports`
4. Click **Import**
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Configure Environment Variables

Click **Environment Variables** and add the following:

#### Required for Authentication
```
NEXTAUTH_URL=https://retaliationesports.net
NEXTAUTH_SECRET=<generate-with-npx-auth-secret>
```

#### Required for Database
```
DATABASE_URL=<your-postgres-prisma-url>
```

#### Required for Discord OAuth
```
DISCORD_CLIENT_ID=<your-discord-client-id>
DISCORD_CLIENT_SECRET=<your-discord-client-secret>
DISCORD_GUILD_ID=1456358951330513103
```

#### Optional (For Future Phases)
```
DISCORD_BOT_TOKEN=<your-discord-bot-token>
EMAIL_API_KEY=<resend-or-sendgrid-api-key>
EMAIL_FROM=noreply@retaliationesports.net
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
NEXT_PUBLIC_APP_URL=https://retaliationesports.net
```

6. Click **Deploy**

---

## Step 3: Run Database Migrations

After successful deployment, you need to run Prisma migrations:

### Method A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Or if you need to create initial migration
npx prisma migrate dev --name init
```

### Method B: Via Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Functions**
3. Add a new Serverless Function to run migrations
4. Or use Vercel's integrated database migration tools

### Method C: Local with Production Database

```bash
# In your .env.local, add production DATABASE_URL
DATABASE_URL="<your-production-database-url>"

# Run migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

## Step 4: Configure Custom Domain

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your domain: `retaliationesports.net`
3. Update DNS records at your domain registrar:
   - **A Record**: Point to Vercel's IP (provided by Vercel)
   - **CNAME**: `cname.vercel-dns.com`
4. Wait for DNS propagation (5-60 minutes)
5. Vercel will automatically provision SSL certificate

---

## Step 5: Update Discord OAuth Redirect URIs

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to **OAuth2** → **General**
4. Add production redirect URI:
   ```
   https://retaliationesports.net/api/auth/callback/discord
   ```
5. Click **Save Changes**

---

## Step 6: Test Deployment

### Verify Everything Works

1. **Visit your site**: https://retaliationesports.net
2. **Test authentication**:
   - Go to https://retaliationesports.net/auth/signin
   - Click "Sign in with Discord"
   - Authorize the application
   - Should redirect to `/admin` if you have admin role
3. **Check admin dashboard**:
   - Navigate through sidebar links
   - Verify all pages load correctly
   - Check stats cards on dashboard
4. **Test logout**: Click logout button in header
5. **Test unauthorized access**:
   - Login with non-admin Discord account
   - Should see "Unauthorized" page

---

## Environment Variables Reference

### Production Environment Variables (Vercel)

```env
# Database
DATABASE_URL=postgresql://user:pass@host.postgres.vercel-storage.com:5432/verceldb?sslmode=require

# NextAuth
NEXTAUTH_URL=https://retaliationesports.net
NEXTAUTH_SECRET=<32-character-random-string>

# Discord OAuth
DISCORD_CLIENT_ID=<your-client-id>
DISCORD_CLIENT_SECRET=<your-client-secret>
DISCORD_GUILD_ID=1456358951330513103

# Optional (Add when needed for future phases)
DISCORD_BOT_TOKEN=<your-bot-token>
EMAIL_API_KEY=<your-email-api-key>
EMAIL_FROM=noreply@retaliationesports.net
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
NEXT_PUBLIC_APP_URL=https://retaliationesports.net
NODE_ENV=production
```

### How to Generate NEXTAUTH_SECRET

```bash
# Method 1: Using npx
npx auth secret

# Method 2: Using OpenSSL
openssl rand -base64 32

# Method 3: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Troubleshooting

### Build Fails with Prisma Error
**Error**: `PrismaClientConstructorValidationError`
**Solution**: Ensure `DATABASE_URL` is set in Vercel environment variables

### Discord OAuth Redirect Error
**Error**: `redirect_uri_mismatch`
**Solution**: 
1. Add production URL to Discord OAuth redirects
2. Ensure `NEXTAUTH_URL` matches your domain exactly
3. Use HTTPS for production

### Database Connection Timeout
**Error**: `Connection timeout`
**Solution**:
1. Check if database allows connections from Vercel IPs
2. For Supabase: Enable "Pooler" mode
3. Add `?connect_timeout=10` to DATABASE_URL

### Admin Access Denied
**Error**: Redirected to `/auth/unauthorized`
**Solution**:
1. Verify you have one of the admin role IDs in Discord server
2. Check `DISCORD_GUILD_ID` matches your server
3. Ensure user is member of the Discord server

### Session Not Persisting
**Error**: Logged out after refresh
**Solution**:
1. Verify `NEXTAUTH_SECRET` is set
2. Check database connection is working
3. Verify `Session` and `Account` tables exist in database

---

## Post-Deployment Checklist

- [ ] Database migrations ran successfully
- [ ] All environment variables configured in Vercel
- [ ] Custom domain configured and SSL active
- [ ] Discord OAuth redirect URIs updated
- [ ] Authentication flow tested
- [ ] Admin dashboard accessible
- [ ] All admin pages load without errors
- [ ] Logout functionality works
- [ ] Unauthorized access properly blocked
- [ ] Mobile responsive design verified

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# 4. Updates DNS
```

### Preview Deployments

Every branch and pull request gets a unique preview URL:
- Push to any branch → Preview deployment
- Merge to main → Production deployment
- Each deployment gets unique URL for testing

---

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Rotate secrets regularly** - Update `NEXTAUTH_SECRET` quarterly
3. **Use strong database passwords** - Auto-generated by Vercel Postgres
4. **Enable SSL/TLS** - Automatic with Vercel
5. **Restrict admin roles** - Only trusted Discord roles
6. **Monitor logs** - Check Vercel Dashboard → Logs
7. **Set up alerts** - Vercel → Settings → Notifications

---

## Next Steps After Deployment

1. ✅ Phase 2 Complete - Website live with authentication
2. 🚀 **Phase 3** - Build Roster Management (add/edit rosters & players)
3. 🏆 **Phase 4** - Implement Tournament System
4. 🤖 **Phase 11** - Deploy Discord Bot
5. 📧 **Phase 12** - Set up email notifications

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **NextAuth.js Documentation**: https://next-auth.js.org
- **Discord Developer Portal**: https://discord.com/developers/docs
- **Project Repository**: https://github.com/FrostyTheDevv/Retaliation-Esports

---

**🎉 Congratulations! Your Retaliation Esports website is now live!**
