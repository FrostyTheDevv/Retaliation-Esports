# Retaliation Esports Website - Complete Development Roadmap

**Domain:** retaliationesports.net  
**Bio:** We're finally retaliating. RETALIATION ESPORTS  
**Discord Guild ID:** 1456358951330513103  
**Admin Role IDs:** 774922425548013609, 1364298754030698499, 1291856690484088924, 1163168152381825034

---

## Phase 1: Project Foundation & Setup ✅ COMPLETE

### 1.1 Initial Project Setup ✅
- [x] Initialize Git repository
- [x] Connect to GitHub (https://github.com/FrostyTheDevv/Retaliation-Esports.git)
- [x] Initialize Next.js 16.1.2 project with TypeScript
- [x] Setup Tailwind CSS v4 with custom configuration
- [x] Configure ESLint and Prettier (via Next.js defaults)
- [x] Create .gitignore for Node.js/Next.js
- [x] Setup environment variables structure (.env.example)

### 1.2 Project Structure ✅
- [x] Create `/app` directory structure (Next.js 14 App Router)
  - [x] `/app/page.tsx` (Homepage - default created)
  - [x] `/app/layout.tsx` (Root layout - default created)
  - [x] `/app/admin/page.tsx` (To be created in Phase 2)
  - [x] `/app/admin/rosters/page.tsx` (To be created in Phase 3)
  - [x] `/app/admin/tournaments/page.tsx` (To be created in Phase 4)
  - [x] `/app/rosters/page.tsx` (To be created in Phase 3)
  - [x] `/app/tournaments/page.tsx` (To be created in Phase 5)
  - [x] `/app/links/page.tsx` (To be created in Phase 8)
  - [x] `/app/support/page.tsx` (To be created in Phase 8)
  - [x] `/app/api/` (API routes to be created per phase)
- [x] Create `/components` directory
  - [x] `/components/ui/` (Reusable UI components)
  - [x] `/components/admin/` (Admin-specific components)
  - [x] `/components/rosters/` (Roster components)
  - [x] `/components/tournaments/` (Tournament components)
- [x] Create `/lib` directory (Utilities and helpers)
- [x] Create `/types` directory (TypeScript type definitions)
- [x] Create `/public/images` directory (Static assets)
- [x] Create `/styles` directory (Global styles via app/globals.css)

### 1.3 Database Setup ✅
- [x] Install Prisma 7.2.0 and dependencies (`prisma`, `@prisma/client`)
- [x] Choose database provider (PostgreSQL for Vercel)
- [x] Create Prisma schema (`prisma/schema.prisma`)
- [x] Define database models:
  - [x] User model (Discord OAuth data)
  - [x] Roster model (name, colors, image, description)
  - [x] Player model (name, role, socials, stats, roster relation)
  - [x] Team model (team management with captain)
  - [x] TeamMember model (team roster management)
  - [x] Tournament model (name, description, images, links, requirements, settings)
  - [x] TournamentSignup model (team name, email, verification status, players)
  - [x] Bracket model (tournament relation, match data)
  - [x] Match model (teams, scores, round info)
  - [x] SupportTicket model (help desk system)
  - [x] FAQ model (knowledge base)
  - [x] Notification model (user notifications)
  - [x] AuditLog model (admin action tracking)
- [x] Generate Prisma Client successfully
- [x] Setup database connection in `/lib/prisma.ts`
- [x] Run initial database schema push to production (Vercel Postgres)

### 1.4 Brand Assets & Styling ✅
- [x] Add main icon/logo to `/public/images/icon.png`
- [x] Extract brand colors from icon
- [x] Configure Tailwind theme in `tailwind.config.ts`:
  - [x] Primary colors (#FF4655)
  - [x] Secondary colors (#00D9FF)
  - [x] Accent colors (#FFA500)
  - [x] Dark mode colors (#0A0E27)
- [x] Create global CSS variables for brand colors
- [x] Custom scrollbar styling
- [x] Custom text selection styling

### 1.5 Additional Setup Completed ✅
- [x] Installed core dependencies:
  - [x] next-auth@beta (Discord OAuth)
  - [x] zod (validation)
  - [x] react-hook-form (forms)
  - [x] date-fns (date utilities)
  - [x] lucide-react (icons)
- [x] Created validation schemas in `/lib/validations.ts`
- [x] Created utility functions in `/lib/utils.ts`
- [x] Created constants in `/lib/constants.ts`
- [x] Build tested successfully ✅

---

## Phase 2: Authentication & Admin Dashboard ✅ COMPLETE

### 2.1 Discord OAuth Setup ✅
- [x] Install NextAuth.js (`next-auth@beta` for Next.js 14)
- [x] Create Discord Application at https://discord.com/developers
- [x] Configure OAuth2 redirect URIs
- [x] Add Discord Client ID and Secret to environment variables
- [x] Create `/app/api/auth/[...nextauth]/route.ts`
- [x] Configure Discord provider in NextAuth
- [x] Implement session handling
- [x] Create middleware for route protection (`middleware.ts`)
- [x] Create `/types/next-auth.d.ts` for TypeScript types

### 2.2 Role-Based Access Control ✅
- [x] Fetch user's guild roles from Discord API
- [x] Create role verification utility in `/lib/auth.ts`
- [x] Implement admin role check (compare against role IDs: 774922425548013609, 1364298754030698499, 1291856690484088924, 1163168152381825034)
- [x] Create `checkAdminAccess()` function (now `isAdmin()` and `requireAdmin()`)
- [x] Protect all `/app/admin/*` routes with role verification
- [x] Create unauthorized access page (`/app/auth/unauthorized/page.tsx`)
- [x] Create auth error page (`/app/auth/error/page.tsx`)
- [x] Create sign-in page (`/app/auth/signin/page.tsx`)

### 2.3 Admin Dashboard Layout & Navigation ✅
- [x] Create admin layout component (`/app/admin/layout.tsx`)
- [x] Build admin sidebar navigation (`/components/admin/AdminSidebar.tsx`):
  - [x] Dashboard overview
  - [x] Roster Management
  - [x] Tournament Management
  - [x] Teams Management
  - [x] Support Tickets
  - [x] FAQ Management
  - [x] Settings
- [x] Add user profile display (Discord avatar, username) in header
- [x] Add logout functionality (server action in AdminHeader)
- [x] Create responsive mobile navigation
- [x] Add brand bio footer in sidebar

### 2.4 Admin Dashboard Overview ✅
- [x] Create dashboard stats cards:
  - [x] Total rosters
  - [x] Active tournaments
  - [x] Total signups
  - [x] Upcoming tournament count
- [x] Display recent activity feed placeholder
- [x] Quick action buttons (Manage Rosters, Create Tournament, View Teams)
- [x] Welcome message with user's name

### 2.5 Additional Phase 2 Completions ✅
- [x] Created SessionProvider component (`/components/providers/SessionProvider.tsx`)
- [x] Created all admin navigation pages (rosters, tournaments, teams, tickets, faq, settings)
- [x] All pages have placeholder content with phase information
- [x] Settings page displays user profile and system status
- [x] All TypeScript types properly configured

---

## Phase 3: Roster Management System ✅ COMPLETE

### 3.1 Admin Roster Management Interface ✅
- [x] Create roster list view (`/app/admin/rosters/page.tsx`)
  - [x] Display all rosters in grid/table
  - [x] Add search/filter functionality
  - [x] Add sort options
- [x] Create "Add New Roster" button
- [x] Build roster creation form:
  - [x] Roster name input
  - [x] Primary color picker
  - [x] Secondary color picker
  - [x] Roster image upload (URL input - Blob integration pending)
  - [x] Description/bio textarea
  - [x] Active/inactive toggle
- [x] Build roster edit form (same fields as creation)
- [x] Add delete roster functionality with confirmation
- [ ] Implement image upload to Vercel Blob (infrastructure ready, UI pending)

### 3.2 Player Management Within Rosters ✅
- [x] Create player addition interface within roster form
- [x] Player form fields:
  - [x] Player name
  - [x] In-game name/tag
  - [x] Role/position
  - [x] Profile image upload (URL input - Blob integration pending)
  - [x] Stats (optional: goals, assists, saves, etc.)
  - [x] Social links:
    - [x] Twitter/X
    - [x] Twitch
    - [x] YouTube
    - [x] Instagram
    - [x] Discord
    - [x] Steam (using Gamepad2 icon)
- [x] Add multiple players to roster
- [ ] Drag-and-drop player reordering (functionality pending)
- [x] Edit player information
- [x] Remove player from roster

### 3.3 Admin Roster API Routes ✅
- [x] `POST /api/admin/rosters` - Create new roster
- [x] `GET /api/admin/rosters` - List all rosters
- [x] `GET /api/admin/rosters/[id]` - Get single roster
- [x] `PATCH /api/admin/rosters/[id]` - Update roster
- [x] `DELETE /api/admin/rosters/[id]` - Delete roster
- [x] `POST /api/admin/rosters/[id]/players` - Add player
- [x] `PATCH /api/admin/rosters/[id]/players/[playerId]` - Update player
- [x] `DELETE /api/admin/rosters/[id]/players/[playerId]` - Remove player
- [x] Add validation and error handling for all routes

### 3.4 Public Roster Display Page ✅
- [x] Create public roster page (`/app/rosters/page.tsx`)
- [x] Display all active rosters in grid layout
- [x] Roster card design:
  - [x] Team colors gradient background
  - [x] Roster image/logo
  - [x] Team name
  - [x] Player count
  - [x] "View Details" button
- [x] Create individual roster detail page (`/app/rosters/[id]/page.tsx`)
- [x] Display roster information:
  - [x] Large roster image
  - [x] Team colors
  - [x] Description
  - [x] Player grid with:
    - [x] Player images
    - [x] Names and roles
    - [x] Stats display
    - [x] Social media links
- [x] Add animations and transitions
- [x] Mobile responsive design

---

## Phase 4: Tournament Management System (CRITICAL)

### 4.1 Admin Tournament Creation Interface
- [ ] Create tournament list view (`/app/admin/tournaments/page.tsx`)
  - [ ] Display all tournaments
  - [ ] Filter by status (upcoming, active, completed)
  - [ ] Search functionality
- [ ] Create "Create New Tournament" button
- [ ] Build tournament creation form:
  - [ ] Tournament name
  - [ ] Description (rich text editor)
  - [ ] Tournament banner image upload
  - [ ] Additional images (gallery)
  - [ ] Start date and time/End date and time
  - [ ] Registration deadline
  - [ ] External links (Discord, rules doc, stream, etc.)
  - [ ] Requirements text
  - [ ] Game mode (1v1, 2v2, 3v3)
  - [ ] Tournament format:
    - [ ] Single elimination
    - [ ] Double elimination
  - [ ] Best-of options (BO1, BO3, BO5, BO7)
  - [ ] Customize best-of per round
  - [ ] Maximum teams
  - [ ] Enable team randomization option
  - [ ] Prize information
  - [ ] Tournament status (draft, open, closed, ongoing, completed)

### 4.2 Tournament Settings & Configuration
- [ ] Round-by-round configuration:
  - [ ] Set best-of format per round
  - [ ] Custom round names
  - [ ] Different settings for winners/losers bracket
- [ ] Registration settings:
  - [ ] Require email verification
  - [ ] Custom registration questions
  - [ ] Team size requirements
  - [ ] Skill level restrictions (optional)
- [ ] Notification settings:
  - [ ] Email reminders timing
  - [ ] Discord DM reminders timing
  - [ ] Auto-announcements
- [ ] Bracket settings:
  - [ ] Seeding options (random, manual, by ranking)
  - [ ] Third-place match toggle
  - [ ] Bye configuration

### 4.3 Tournament Edit & Management
- [ ] Edit tournament details (same form as creation)
- [ ] View registered teams list
- [ ] Approve/reject team registrations
- [ ] Manually add/remove teams
- [ ] Send custom messages to participants
- [ ] View team details and roster
- [ ] Export participant list
- [ ] Delete tournament with confirmation

### 4.4 Admin Tournament API Routes
- [ ] `POST /api/admin/tournaments` - Create tournament
- [ ] `GET /api/admin/tournaments` - List all tournaments
- [ ] `GET /api/admin/tournaments/[id]` - Get single tournament
- [ ] `PATCH /api/admin/tournaments/[id]` - Update tournament
- [ ] `DELETE /api/admin/tournaments/[id]` - Delete tournament
- [ ] `GET /api/admin/tournaments/[id]/signups` - Get all signups
- [ ] `PATCH /api/admin/tournaments/[id]/signups/[signupId]` - Approve/reject signup
- [ ] `DELETE /api/admin/tournaments/[id]/signups/[signupId]` - Remove team
- [ ] `POST /api/admin/tournaments/[id]/generate-bracket` - Generate bracket
- [ ] Add validation and error handling

### 4.5 Tournament Management Backend & Dispute System
- [ ] **Live Tournament Management:**
  - [ ] Real-time match status tracking
  - [ ] Match check-in system
  - [ ] No-show detection and auto-disqualification
  - [ ] Match result submission by teams
  - [ ] Score verification system
- [ ] **Dispute Resolution System:**
  - [ ] Dispute submission form for teams
  - [ ] Dispute ticket creation with evidence upload
  - [ ] Admin dispute queue/dashboard
  - [ ] Dispute review interface with match details
  - [ ] Resolution actions (overturn, uphold, rematch)
  - [ ] Dispute history and audit log
  - [ ] Automated notifications for dispute status
- [ ] **Matchmaking & Scheduling:**
  - [ ] Automated match scheduling based on bracket progression
  - [ ] Time zone handling for participants
  - [ ] Match postponement requests
  - [ ] Admin manual match rescheduling
  - [ ] Schedule conflict detection
  - [ ] Lobby/server assignment tracking
- [ ] **Issue Management:**
  - [ ] Technical issue reporting
  - [ ] Connectivity problem tracking
  - [ ] Admin intervention tools
  - [ ] Match pause/resume functionality
  - [ ] Rollback match results capability
- [ ] **Tournament Monitoring:**
  - [ ] Live tournament dashboard
  - [ ] Active match monitoring
  - [ ] Team status indicators (online, ready, in-match)
  - [ ] Real-time notification system for admins
  - [ ] Tournament health metrics
  - [ ] Auto-alerts for issues requiring intervention

---

## Phase 5: Tournament Signup & Public Display

### 5.1 Public Tournament Display Page
- [ ] Create tournaments page (`/app/tournaments/page.tsx`)
- [ ] Display upcoming tournaments prominently
- [ ] Filter tournaments by:
  - [ ] Status (upcoming, ongoing, completed)
  - [ ] Game mode
  - [ ] Date
- [ ] Tournament card design:
  - [ ] Banner image
  - [ ] Tournament name
  - [ ] Date and time
  - [ ] Registration status
  - [ ] Team count / max teams
  - [ ] "View Details" / "Register" button
- [ ] Create tournament details page (`/app/tournaments/[id]/page.tsx`)
- [ ] Display all tournament information:
  - [ ] Full description
  - [ ] Image gallery
  - [ ] Requirements
  - [ ] Format and rules
  - [ ] Prize information
  - [ ] External links
  - [ ] Registration button
  - [ ] Registered teams count

### 5.2 Tournament Registration System
- [ ] Create registration form modal/page:
  - [ ] Team name input
  - [ ] Captain email (required for verification)
  - [ ] Captain Discord username
  - [ ] Player information (based on game mode):
    - [ ] Player names
    - [ ] Player Discord usernames
    - [ ] Player emails (optional)
  - [ ] Accept terms and conditions checkbox
- [ ] Form validation
- [ ] Submit registration via API
- [ ] Display confirmation message
- [ ] Prevent duplicate registrations

### 5.3 Registration API Routes
- [ ] `POST /api/tournaments/[id]/signup` - Register team
- [ ] `GET /api/tournaments/[id]/verify` - Verify email token
- [ ] `GET /api/tournaments` - List public tournaments
- [ ] `GET /api/tournaments/[id]` - Get tournament details
- [ ] Add rate limiting
- [ ] Add spam protection

### 5.4 Email Verification System
- [ ] Install email service (Resend or SendGrid)
- [ ] Create email verification utility in `/lib/email.ts`
- [ ] Design verification email template:
  - [ ] Brand styling
  - [ ] Verification link
  - [ ] Tournament details
  - [ ] Unsubscribe link
- [ ] Generate unique verification tokens
- [ ] Create verification endpoint
- [ ] Handle verification success/failure
- [ ] Send confirmation email after verification

### 5.5 Email Reminder System
- [ ] Create reminder email templates:
  - [ ] 24 hours before tournament
  - [ ] 1 hour before tournament
  - [ ] Tournament starting now
- [ ] Create cron job or scheduled task for sending reminders
- [ ] Use Vercel Cron or external scheduler
- [ ] Query tournaments and send reminders to verified participants
- [ ] Track email delivery status
- [ ] Handle bounces and errors

---

## Phase 6: Bracket System

### 6.1 Bracket Generation
- [ ] Create bracket generation utility in `/lib/brackets.ts`
- [ ] Implement single elimination algorithm:
  - [ ] Calculate bracket size (power of 2)
  - [ ] Add byes if needed
  - [ ] Seed teams
  - [ ] Create match structure
- [ ] Implement double elimination algorithm:
  - [ ] Winners bracket
  - [ ] Losers bracket
  - [ ] Grand finals (with bracket reset)
- [ ] Handle team randomization option
- [ ] Save generated bracket to database

### 6.2 Admin Bracket Management
- [ ] Create bracket management page (`/app/admin/tournaments/[id]/bracket`)
- [ ] Display bracket visualization
- [ ] Update match scores:
  - [ ] Input winner
  - [ ] Input scores
  - [ ] Advance winner to next round
  - [ ] Move loser to losers bracket (double elim)
- [ ] Manual bracket adjustments:
  - [ ] Swap teams
  - [ ] Disqualify team
  - [ ] Add/remove matches
- [ ] Reset bracket functionality
- [ ] Export bracket as image

### 6.3 Public Bracket Display
- [ ] Create public bracket view (`/app/tournaments/[id]/bracket`)
- [ ] Responsive bracket visualization:
  - [ ] Desktop: horizontal bracket
  - [ ] Mobile: vertical/list view
- [ ] Display match information:
  - [ ] Team names
  - [ ] Scores
  - [ ] Match status (upcoming, live, completed)
  - [ ] Round names
- [ ] Real-time updates (optional: use WebSockets or polling)
- [ ] Match details modal
- [ ] Share bracket functionality

### 6.4 Bracket API Routes
- [ ] `POST /api/admin/tournaments/[id]/bracket/generate` - Generate bracket
- [ ] `PATCH /api/admin/tournaments/[id]/bracket/match/[matchId]` - Update match
- [ ] `GET /api/tournaments/[id]/bracket` - Get public bracket
- [ ] Add validation for bracket operations

---

## Phase 7: Discord Bot Integration

### 7.1 Discord Bot Setup
- [ ] Create Discord Bot at https://discord.com/developers
- [ ] Configure bot permissions:
  - [ ] Send messages
  - [ ] Send DMs to users
  - [ ] Read message history
- [ ] Add bot to guild (1456358951330513103)
- [ ] Install discord.js (`discord.js`)
- [ ] Create bot entry file (`/bot/index.ts` or separate service)
- [ ] Configure bot token in environment variables
- [ ] Initialize bot and login

### 7.2 DM Reminder System
- [ ] Create command/function to fetch tournament participants
- [ ] Get Discord user IDs from database (from signups)
- [ ] Create DM reminder message templates:
  - [ ] Tournament starting soon
  - [ ] Match starting
  - [ ] Registration confirmed
- [ ] Implement DM sending function
- [ ] Handle users with DMs disabled
- [ ] Log successful/failed DM attempts
- [ ] Create scheduled tasks for reminders

### 7.3 Bot Commands (Optional)
- [ ] `/tournaments` - List upcoming tournaments
- [ ] `/register [tournament-id]` - Register for tournament
- [ ] `/mystatus` - Check registration status
- [ ] `/bracket [tournament-id]` - View bracket link
- [ ] Admin commands:
  - [ ] `/announce` - Send announcement to participants
  - [ ] `/checkin` - Start tournament check-in

### 7.4 Bot Deployment
- [ ] Decide hosting strategy:
  - [ ] Option 1: Deploy separately (Railway, Heroku)
  - [ ] Option 2: Integrate into Next.js API routes (webhook approach)
  - [ ] Option 3: Serverless Discord bot
- [ ] Setup bot logging and monitoring
- [ ] Create bot status page

---

## Phase 8: Additional Pages (Complete Specifications)

### 8.1 Main Landing Page - Full Configuration
- [ ] Create homepage (`/app/page.tsx`)
- [ ] **Hero Section (Above the Fold):**
  - [ ] Full-width background with brand colors
  - [ ] Animated gradient or particle effects
  - [ ] Large centered main logo/icon (from `/public/images/`)
  - [ ] Primary tagline: "We're finally retaliating."
  - [ ] Secondary text: "RETALIATION ESPORTS"
  - [ ] Animated text effects (fade-in, slide-up)
  - [ ] Primary CTA button: "View Tournaments"
  - [ ] Secondary CTA button: "Join Our Discord"
  - [ ] Scroll indicator animation
  - [ ] Video background option (if available)
  - [ ] Parallax scrolling effects
- [ ] **Featured Tournaments Section:**
  - [ ] Section title: "Upcoming Tournaments"
  - [ ] Display 3-6 featured tournaments in grid
  - [ ] Tournament cards with:
    - [ ] Tournament banner image
    - [ ] Tournament name
    - [ ] Date and time (countdown timer)
    - [ ] Prize pool (if applicable)
    - [ ] Registration status badge
    - [ ] "Register Now" or "View Details" button
  - [ ] "View All Tournaments" link
  - [ ] Carousel/slider for mobile
  - [ ] Auto-scroll carousel option
- [ ] **Featured Rosters Section:**
  - [ ] Section title: "Our Teams"
  - [ ] Display active rosters in carousel
  - [ ] Roster cards with:
    - [ ] Team colors gradient background
    - [ ] Team logo
    - [ ] Team name
    - [ ] Player count
    - [ ] "Meet the Team" button
  - [ ] Swipeable carousel on mobile
  - [ ] Auto-advance with pause on hover
  - [ ] Navigation arrows and dots
- [ ] **About/Bio Section:**
  - [ ] Section title: "About Retaliation Esports"
  - [ ] Organization description/mission statement
  - [ ] Founded date
  - [ ] Key achievements
  - [ ] Game focus (Rocket League)
  - [ ] Community stats (members, tournaments, etc.)
  - [ ] Brand values
  - [ ] Call-to-action to join
- [ ] **Quick Links Section:**
  - [ ] Link to Rosters page
  - [ ] Link to Tournaments page
  - [ ] Link to Discord
  - [ ] Link to Support/Help
  - [ ] Icon-based navigation grid
- [ ] **Latest Updates/News Section (Optional):**
  - [ ] Display 3 recent announcements
  - [ ] News card with image, title, excerpt
  - [ ] "Read More" links
  - [ ] Link to full news page (if implemented)
- [ ] **Statistics Section:**
  - [ ] Animated counter for tournaments hosted
  - [ ] Animated counter for teams participated
  - [ ] Animated counter for community members
  - [ ] Animated counter for prize pool distributed
  - [ ] Numbers animate on scroll into view
- [ ] **Call-to-Action Section:**
  - [ ] Prominent join/register section
  - [ ] "Join Our Community" heading
  - [ ] Discord invite button
  - [ ] Tournament signup link
  - [ ] Social media follow buttons
- [ ] **Footer:**
  - [ ] Logo
  - [ ] Tagline
  - [ ] Navigation links (all pages)
  - [ ] Social media icons with links
  - [ ] Copyright notice
  - [ ] Privacy Policy link
  - [ ] Terms of Service link
  - [ ] Contact email
  - [ ] Back to top button

### 8.2 Links/Portal Page - Complete Configuration
- [ ] Create links page (`/app/links/page.tsx`)
- [ ] **Page Layout:**
  - [ ] Linktree/Beacons style bio link page
  - [ ] Centered single-column layout
  - [ ] Max-width container (400-600px)
  - [ ] Brand color gradient background
  - [ ] Animated background effects
- [ ] **Profile Header:**
  - [ ] Large organization logo/avatar
  - [ ] Circle or rounded square frame
  - [ ] Organization name: "Retaliation Esports"
  - [ ] Bio: "We're finally retaliating. RETALIATION ESPORTS"
  - [ ] Subtitle: "Official Links Portal"
- [ ] **Social Media Links Section:**
  - [ ] Section title: "Connect With Us"
  - [ ] Discord server invite:
    - [ ] Icon: Discord logo
    - [ ] Text: "Join Our Discord"
    - [ ] Member count display (if possible)
    - [ ] Primary button style
  - [ ] Twitter/X:
    - [ ] Icon: Twitter/X logo
    - [ ] Text: "Follow us on X"
    - [ ] Handle display
  - [ ] Twitch:
    - [ ] Icon: Twitch logo
    - [ ] Text: "Watch us Live"
    - [ ] Online status indicator (optional)
  - [ ] YouTube:
    - [ ] Icon: YouTube logo
    - [ ] Text: "Subscribe on YouTube"
    - [ ] Subscriber count (optional)
  - [ ] Instagram:
    - [ ] Icon: Instagram logo
    - [ ] Text: "Follow on Instagram"
  - [ ] TikTok:
    - [ ] Icon: TikTok logo
    - [ ] Text: "Follow on TikTok"
  - [ ] Twitter alternative (BlueSky, Threads, etc.)
- [ ] **Important Links Section:**
  - [ ] Section title: "Quick Links"
  - [ ] View Tournaments:
    - [ ] Link to `/tournaments`
    - [ ] Description: "Browse upcoming tournaments"
  - [ ] Our Teams:
    - [ ] Link to `/rosters`
    - [ ] Description: "Meet our players"
  - [ ] Tournament Rules:
    - [ ] External link or PDF
    - [ ] Description: "Official tournament guidelines"
  - [ ] Join Our Team:
    - [ ] Link to application form
    - [ ] Description: "Become a player"
  - [ ] Support/Help:
    - [ ] Link to `/support`
    - [ ] Description: "Get assistance"
- [ ] **Partner Links Section:**
  - [ ] Section title: "Partners & Sponsors"
  - [ ] Partner website links
  - [ ] Sponsor links
  - [ ] Affiliate links
  - [ ] Badge/logo display option
- [ ] **Link Styling:**
  - [ ] Consistent button style
  - [ ] Brand colors
  - [ ] Hover effects (scale, glow, color shift)
  - [ ] Icon on left side
  - [ ] Arrow or chevron on right
  - [ ] Smooth transitions
  - [ ] Click animation
  - [ ] External link indicator
- [ ] **Additional Features:**
  - [ ] Share this page button
  - [ ] Copy link to clipboard
  - [ ] QR code for mobile sharing
  - [ ] Visit counter (optional)
  - [ ] Analytics tracking per link
- [ ] **Mobile Optimization:**
  - [ ] Large tap targets
  - [ ] Easy scrolling
  - [ ] Fast loading
  - [ ] Share sheet integration

### 8.3 Support/Help Page - Complete Configuration
- [ ] Create support page (`/app/support/page.tsx`)
- [ ] **Page Header:**
  - [ ] Page title: "Support & Help Center"
  - [ ] Subtitle: "We're here to help you"
  - [ ] Search bar for FAQs
  - [ ] Quick contact button
- [ ] **Quick Help Cards:**
  - [ ] "Tournament Registration" card
  - [ ] "Account Issues" card
  - [ ] "Technical Problems" card
  - [ ] "Report a Bug" card
  - [ ] Each card links to relevant FAQ section
- [ ] **FAQ Section:**
  - [ ] Section title: "Frequently Asked Questions"
  - [ ] Accordion-style expandable questions
  - [ ] Categories:
    - [ ] **Tournament Registration:**
      - [ ] How do I register for a tournament?
      - [ ] What information do I need?
      - [ ] Can I register a team?
      - [ ] How do I verify my email?
      - [ ] What if verification email doesn't arrive?
      - [ ] Can I edit my registration?
      - [ ] How do I withdraw from a tournament?
      - [ ] Registration deadline questions
    - [ ] **Tournament Rules:**
      - [ ] What game modes are supported?
      - [ ] Tournament format explanations
      - [ ] What are the bracket types?
      - [ ] How are teams seeded?
      - [ ] What happens if I'm late?
      - [ ] Forfeit and no-show policies
      - [ ] Dispute resolution process
      - [ ] Prize distribution info
    - [ ] **Technical Issues:**
      - [ ] Website not loading properly
      - [ ] Can't log in with Discord
      - [ ] Images not displaying
      - [ ] Form submission errors
      - [ ] Browser compatibility
      - [ ] Mobile app issues
      - [ ] Email notifications not received
      - [ ] Discord bot not responding
    - [ ] **Account & Access:**
      - [ ] How do I create an account?
      - [ ] Discord OAuth issues
      - [ ] Changing email address
      - [ ] Deleting my account
      - [ ] Privacy and data concerns
      - [ ] Admin access requests
    - [ ] **General Questions:**
      - [ ] About Retaliation Esports
      - [ ] How to join the organization
      - [ ] Sponsorship opportunities
      - [ ] Partnership inquiries
      - [ ] Media and press inquiries
  - [ ] Search functionality within FAQs
  - [ ] "Was this helpful?" buttons
  - [ ] View count per FAQ
  - [ ] Related questions suggestions
- [ ] **Contact Form Section:**
  - [ ] Section title: "Still Need Help? Contact Us"
  - [ ] Subtitle: "We'll respond within 24-48 hours"
  - [ ] Form fields:
    - [ ] Name (required)
    - [ ] Email (required, validated)
    - [ ] Discord Username (optional)
    - [ ] Subject/Category dropdown (required):
      - [ ] Tournament Question
      - [ ] Technical Issue
      - [ ] Account Problem
      - [ ] Report a Bug
      - [ ] Partnership Inquiry
      - [ ] General Question
      - [ ] Other
    - [ ] Priority level (Normal/Urgent)
    - [ ] Message (required, min 20 characters)
    - [ ] Attachment upload (optional, screenshots)
  - [ ] reCAPTCHA or spam protection
  - [ ] Submit button
  - [ ] Form validation with clear error messages
  - [ ] Success message after submission
  - [ ] Email confirmation sent to user
- [ ] **Alternative Contact Methods:**
  - [ ] Section title: "Other Ways to Reach Us"
  - [ ] Discord support channel:
    - [ ] Button to join Discord
    - [ ] Support channel link
    - [ ] Online staff indicator
  - [ ] Email support:
    - [ ] Display: support@retaliationesports.net
    - [ ] Click to copy email
    - [ ] mailto: link
  - [ ] Response time expectations
  - [ ] Business hours (if applicable)
- [ ] **Knowledge Base (Optional):**
  - [ ] Detailed guides section
  - [ ] Step-by-step tutorials with images
  - [ ] Video tutorials (YouTube embeds)
  - [ ] "How to Register" guide
  - [ ] "Admin Dashboard" guide
  - [ ] Troubleshooting guides
  - [ ] Best practices
- [ ] **System Status Section:**
  - [ ] Current system status indicator
  - [ ] All systems operational badge
  - [ ] Known issues list
  - [ ] Scheduled maintenance notifications
  - [ ] Link to status page
  - [ ] Recent incident history
- [ ] **Community Support:**
  - [ ] Link to community Discord
  - [ ] Link to community forums (if available)
  - [ ] User-to-user help resources
  - [ ] Community guidelines

### 8.4 API Routes for Support System
- [ ] `POST /api/support/contact` - Submit support ticket
  - [ ] Validate all inputs
  - [ ] Sanitize message content
  - [ ] Store ticket in database
  - [ ] Generate unique ticket ID
  - [ ] Send email to support team
  - [ ] Send confirmation email to user
  - [ ] Return ticket ID to user
- [ ] `GET /api/support/faq` - Get all FAQs
  - [ ] Return categorized FAQs
  - [ ] Include search capability
  - [ ] Track view counts
- [ ] `POST /api/support/faq/helpful` - Mark FAQ as helpful
  - [ ] Track helpful votes
  - [ ] Rate limiting per IP
- [ ] `GET /api/support/status` - Get system status
  - [ ] Check database connection
  - [ ] Check email service
  - [ ] Check Discord bot
  - [ ] Return overall status

### 8.5 Admin Management for Support Content
- [ ] Create admin FAQ management (`/app/admin/support/faq`)
  - [ ] List all FAQs
  - [ ] Add new FAQ
  - [ ] Edit existing FAQ
  - [ ] Delete FAQ
  - [ ] Reorder FAQs
  - [ ] Organize by category
  - [ ] Publish/unpublish toggle
  - [ ] View FAQ analytics
- [ ] Create support ticket dashboard (`/app/admin/support/tickets`)
  - [ ] List all tickets
  - [ ] Filter by status (new, in-progress, resolved)
  - [ ] Filter by category
  - [ ] Search tickets
  - [ ] View ticket details
  - [ ] Reply to tickets
  - [ ] Mark as resolved
  - [ ] Assign to admin user
  - [ ] Priority management
  - [ ] Export tickets

### 8.6 Additional Page Features
- [ ] **Newsletter Signup (Optional):**
  - [ ] Add to homepage footer
  - [ ] Add to support page
  - [ ] Email input
  - [ ] Subscribe button
  - [ ] Privacy notice
  - [ ] Confirmation email
  - [ ] Store in database
  - [ ] Integration with email service
- [ ] **Privacy Policy Page:**
  - [ ] Create `/app/privacy/page.tsx`
  - [ ] Data collection disclosure
  - [ ] Cookie usage
  - [ ] Discord OAuth data
  - [ ] Email usage
  - [ ] Data retention policy
  - [ ] User rights
  - [ ] Contact information
  - [ ] Last updated date
- [ ] **Terms of Service Page:**
  - [ ] Create `/app/terms/page.tsx`
  - [ ] User agreements
  - [ ] Tournament rules
  - [ ] Code of conduct
  - [ ] Liability disclaimers
  - [ ] Account termination terms
  - [ ] Dispute resolution
  - [ ] Last updated date
- [ ] **404 Not Found Page:**
  - [ ] Custom design matching brand
  - [ ] Error message
  - [ ] Search bar
  - [ ] Links to main pages
  - [ ] "Go Home" button
  - [ ] Report broken link option
- [ ] **500 Error Page:**
  - [ ] Custom design matching brand
  - [ ] Friendly error message
  - [ ] Retry button
  - [ ] Contact support link
  - [ ] Status page link

---

## Phase 9: UI Components & Styling

### 9.1 Core UI Components
- [ ] Button component (primary, secondary, danger variants)
- [ ] Input component (text, email, password)
- [ ] Textarea component
- [ ] Select/Dropdown component
- [ ] Modal/Dialog component
- [ ] Loading spinner/skeleton
- [ ] Toast notifications
- [ ] Alert/Banner component
- [ ] Card component
- [ ] Badge component
- [ ] Avatar component
- [ ] Tooltip component

### 9.2 Navigation Components
- [ ] Header/Navbar:
  - [ ] Logo
  - [ ] Navigation links
  - [ ] User menu (when authenticated)
  - [ ] Mobile hamburger menu
- [ ] Footer:
  - [ ] Copyright
  - [ ] Social links
  - [ ] Quick links
- [ ] Breadcrumbs
- [ ] Sidebar (for admin panel)

### 9.3 Form Components
- [ ] Form wrapper with validation
- [ ] Color picker
- [ ] Date/time picker
- [ ] File upload with preview
- [ ] Rich text editor (for tournament descriptions)
- [ ] Multi-select component
- [ ] Checkbox and radio buttons
- [ ] Toggle/Switch component

### 9.4 Data Display Components
- [ ] Table with sorting/filtering
- [ ] Pagination
- [ ] Stats card
- [ ] Progress bar
- [ ] Timeline
- [ ] Tabs
- [ ] Accordion
- [ ] Empty state component

### 9.5 Animation & Transitions
- [ ] Page transitions
- [ ] Hover effects
- [ ] Loading states
- [ ] Scroll animations (optional)
- [ ] Micro-interactions

---

## Phase 10: Testing & Quality Assurance

### 10.1 Functionality Testing
- [ ] Test Discord OAuth login flow
- [ ] Test admin role verification
- [ ] Test roster CRUD operations
- [ ] Test tournament CRUD operations
- [ ] Test registration and email verification
- [ ] Test bracket generation (single & double elim)
- [ ] Test Discord bot DM functionality
- [ ] Test all forms and validation
- [ ] Test file uploads
- [ ] Test API error handling

### 10.2 UI/UX Testing
- [ ] Test responsive design on multiple devices
- [ ] Test all pages in light/dark mode
- [ ] Test navigation and routing
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Test loading states
- [ ] Test error states
- [ ] Verify brand colors throughout site

### 10.3 Performance Testing
- [ ] Check page load times
- [ ] Optimize images
- [ ] Test with slow network
- [ ] Check Lighthouse scores
- [ ] Optimize bundle size
- [ ] Implement lazy loading where appropriate

### 10.4 Security Testing
- [ ] Verify authentication on protected routes
- [ ] Test rate limiting
- [ ] Check for SQL injection vulnerabilities
- [ ] Verify CSRF protection
- [ ] Test XSS protection
- [ ] Secure environment variables
- [ ] Test bot token security

---

## Phase 11: Deployment & DevOps

### 11.1 Vercel Configuration
- [ ] Create `vercel.json` configuration
- [ ] Configure build settings
- [ ] Setup environment variables in Vercel:
  - [ ] DATABASE_URL
  - [ ] DISCORD_CLIENT_ID
  - [ ] DISCORD_CLIENT_SECRET
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL
  - [ ] EMAIL_API_KEY (Resend/SendGrid)
  - [ ] DISCORD_BOT_TOKEN
  - [ ] Upload storage keys (if using Vercel Blob)
- [ ] Configure serverless function limits
- [ ] Setup Vercel Postgres or external database
- [ ] Configure cron jobs (if using Vercel Cron)

### 11.2 Custom Domain Setup
- [ ] Add retaliationesports.net to Vercel project
- [ ] Configure DNS records:
  - [ ] A record or CNAME
  - [ ] Verify domain ownership
- [ ] Enable HTTPS/SSL
- [ ] Test domain propagation
- [ ] Redirect www to non-www (or vice versa)

### 11.3 Database Deployment
- [ ] Deploy database (Vercel Postgres, Railway, Supabase, or other)
- [ ] Run production migrations
- [ ] Seed initial data if needed
- [ ] Setup database backups
- [ ] Configure connection pooling

### 11.4 Bot Deployment
- [ ] Deploy Discord bot (if separate service)
- [ ] Configure bot environment variables
- [ ] Ensure bot has 24/7 uptime
- [ ] Setup bot monitoring
- [ ] Configure webhook endpoints (if applicable)

### 11.5 Monitoring & Analytics
- [ ] Setup Vercel Analytics
- [ ] Configure error tracking (Sentry)
- [ ] Setup logging
- [ ] Monitor API performance
- [ ] Track user metrics
- [ ] Setup uptime monitoring

### 11.6 Git Workflow
- [ ] Create development branch
- [ ] Setup branch protection rules
- [ ] Configure Vercel preview deployments
- [ ] Create staging environment
- [ ] Setup CI/CD pipeline
- [ ] Document deployment process

---

## Phase 12: Documentation & Handoff

### 12.1 Technical Documentation
- [ ] Update README.md with:
  - [ ] Project overview
  - [ ] Tech stack
  - [ ] Setup instructions
  - [ ] Environment variables
  - [ ] Development workflow
  - [ ] Deployment process
- [ ] Document API endpoints
- [ ] Document database schema
- [ ] Add code comments
- [ ] Create architecture diagram

### 12.2 User Documentation
- [ ] Admin dashboard user guide
- [ ] How to create rosters
- [ ] How to create tournaments
- [ ] How to manage registrations
- [ ] How to update brackets
- [ ] Troubleshooting guide

### 12.3 Maintenance Plan
- [ ] Document update procedures
- [ ] Database backup strategy
- [ ] Security update schedule
- [ ] Performance monitoring checklist
- [ ] Incident response plan

---

## Phase 12: Error Handling & Recovery Systems

### 12.1 Global Error Handling
- [ ] Create global error boundary component
- [ ] Implement 404 Not Found page
- [ ] Implement 500 Internal Server Error page
- [ ] Implement 403 Forbidden page
- [ ] Implement 401 Unauthorized page
- [ ] Create API error response standardization
- [ ] Implement retry logic for failed requests
- [ ] Add graceful degradation for missing data
- [ ] Log all errors to monitoring service

### 12.2 Data Validation & Sanitization
- [ ] Create validation schemas with Zod
- [ ] Validate all API inputs
- [ ] Sanitize user inputs (XSS prevention)
- [ ] Validate file uploads (type, size, content)
- [ ] Validate image dimensions and formats
- [ ] URL validation for external links
- [ ] Email format validation
- [ ] Discord username format validation
- [ ] Color format validation (hex codes)
- [ ] Date range validation

### 12.3 Database Error Handling
- [ ] Handle connection failures gracefully
- [ ] Implement transaction rollbacks
- [ ] Handle unique constraint violations
- [ ] Handle foreign key constraint violations
- [ ] Database connection retry logic
- [ ] Implement database query timeouts
- [ ] Log database errors
- [ ] Handle migration failures

### 12.4 Tournament Error Scenarios
- [ ] Handle tournament registration after deadline
- [ ] Handle duplicate team registrations
- [ ] Handle max teams reached scenario
- [ ] Handle bracket generation with odd teams
- [ ] Handle bracket generation failures
- [ ] Handle match score update conflicts
- [ ] Handle team disqualification mid-tournament
- [ ] Handle no-show teams
- [ ] Handle forfeit scenarios
- [ ] Bracket reset/regeneration safety

### 12.5 Email & Discord Error Handling
- [ ] Handle email delivery failures
- [ ] Handle invalid email addresses
- [ ] Handle Discord DM failures (disabled DMs)
- [ ] Handle Discord API rate limits
- [ ] Retry failed notifications
- [ ] Queue system for bulk notifications
- [ ] Log all notification attempts
- [ ] Fallback notification methods

---

## Phase 13: Team Management System

### 13.1 Team Database Model
- [ ] Create Team model in Prisma:
  - [ ] Team name
  - [ ] Team tag/abbreviation
  - [ ] Team logo
  - [ ] Team colors
  - [ ] Captain user ID
  - [ ] Created date
  - [ ] Status (active/inactive)
- [ ] Create TeamMember junction table:
  - [ ] Team ID
  - [ ] Player/User ID
  - [ ] Role (captain, player, substitute)
  - [ ] Join date

### 13.2 Admin Team Management
- [ ] Create team management page (`/app/admin/teams/page.tsx`)
- [ ] List all teams with search/filter
- [ ] Create new team manually
- [ ] Edit team information
- [ ] Add/remove team members
- [ ] Assign team captain
- [ ] Deactivate/delete teams
- [ ] Merge duplicate teams
- [ ] View team tournament history

### 13.3 Team Verification System
- [ ] Approve/reject team registrations
- [ ] Verify team roster completeness
- [ ] Check team eligibility for tournaments
- [ ] Flag suspicious teams
- [ ] Team verification status badges

### 13.4 Team API Routes
- [ ] `GET /api/admin/teams` - List all teams
- [ ] `POST /api/admin/teams` - Create team
- [ ] `PATCH /api/admin/teams/[id]` - Update team
- [ ] `DELETE /api/admin/teams/[id]` - Delete team
- [ ] `GET /api/teams/[id]` - Get public team info

---

## Phase 14: Advanced Bracket Management

### 14.1 Bracket Error Prevention
- [ ] Validate bracket before generation
- [ ] Check minimum team requirements
- [ ] Prevent bracket generation during active tournament
- [ ] Lock bracket after tournament starts
- [ ] Backup bracket state before modifications

### 14.2 Manual Bracket Controls (Admin)
- [ ] Manually adjust seeding
- [ ] Swap team positions
- [ ] Mark match as played/unplayed
- [ ] Override match results
- [ ] Disqualify team (auto-advance opponent)
- [ ] Award bye to team
- [ ] Reschedule match
- [ ] Add penalty points
- [ ] Undo last bracket action
- [ ] Bracket history/audit log

### 14.3 Score Dispute System
- [ ] Allow teams to report scores
- [ ] Flag matches with disputed scores
- [ ] Admin review disputed matches
- [ ] Override reported scores
- [ ] Add match notes/comments
- [ ] Screenshot upload for proof
- [ ] Notify teams of decisions

### 14.4 Check-in System
- [ ] Create tournament check-in period
- [ ] Team check-in interface
- [ ] Track check-in status
- [ ] Auto-disqualify no-show teams
- [ ] Send check-in reminders
- [ ] Admin view of check-in status
- [ ] Manual check-in by admin

### 14.5 Match Management
- [ ] Create match detail page
- [ ] Display match schedule
- [ ] Add match notes
- [ ] Upload match VODs/replays
- [ ] Live match status updates
- [ ] Match chat/comments
- [ ] Report technical issues
- [ ] Request match restart

---

## Phase 15: Security & Permissions

### 15.1 API Security
- [ ] Implement rate limiting on all API routes
- [ ] Add CORS configuration
- [ ] Implement CSRF protection
- [ ] Add request validation middleware
- [ ] API key authentication (for bot)
- [ ] IP whitelist for sensitive operations
- [ ] Request logging and monitoring
- [ ] Brute force protection on login

### 15.2 Role-Based Permissions
- [ ] Define permission levels:
  - [ ] Super Admin (full access)
  - [ ] Admin (most access)
  - [ ] Moderator (limited admin access)
  - [ ] Verified User
  - [ ] Guest/Public
- [ ] Create permission check utilities
- [ ] Implement permission-based UI rendering
- [ ] Protect API routes by permission level
- [ ] Allow admins to assign moderator roles
- [ ] Audit log for permission changes

### 15.3 Data Privacy & Compliance
- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] Cookie consent banner
- [ ] GDPR compliance features:
  - [ ] User data export
  - [ ] User data deletion
  - [ ] Cookie preferences
- [ ] Email unsubscribe functionality
- [ ] Data retention policies
- [ ] Anonymize deleted user data

### 15.4 Content Security
- [ ] Implement Content Security Policy (CSP)
- [ ] Sanitize all HTML output
- [ ] Validate and sanitize file uploads
- [ ] Scan uploaded images for malware
- [ ] Implement upload file type whitelist
- [ ] Set maximum file sizes
- [ ] Use secure headers
- [ ] Enable HTTPS only

---

## Phase 16: Backup & Recovery

### 16.1 Database Backups
- [ ] Configure automated daily backups
- [ ] Store backups in separate location
- [ ] Implement point-in-time recovery
- [ ] Test backup restoration process
- [ ] Document recovery procedures
- [ ] Set backup retention policy
- [ ] Monitor backup success/failure

### 16.2 Data Export & Import
- [ ] Export tournaments to JSON
- [ ] Export rosters to JSON/CSV
- [ ] Export teams to CSV
- [ ] Export participant lists
- [ ] Import teams from CSV
- [ ] Bulk import functionality
- [ ] Data migration tools

### 16.3 Audit Logging
- [ ] Log all admin actions:
  - [ ] Tournament creation/edits
  - [ ] Roster changes
  - [ ] Team modifications
  - [ ] Bracket adjustments
  - [ ] User permission changes
- [ ] Create audit log viewer in admin panel
- [ ] Filter logs by action type, user, date
- [ ] Export audit logs
- [ ] Retain logs for compliance

---

## Phase 17: Performance & Optimization

### 17.1 Image Optimization
- [ ] Setup image CDN (Vercel Blob or Cloudinary)
- [ ] Implement automatic image compression
- [ ] Generate responsive image sizes
- [ ] Use WebP format with fallbacks
- [ ] Lazy load images below fold
- [ ] Implement image placeholders/blur-up
- [ ] Optimize logo and icon files
- [ ] Cache static images

### 17.2 Code Optimization
- [ ] Implement code splitting
- [ ] Lazy load heavy components
- [ ] Use dynamic imports for routes
- [ ] Optimize bundle size
- [ ] Remove unused dependencies
- [ ] Tree-shake unused code
- [ ] Minimize client-side JavaScript
- [ ] Use server components where possible

### 17.3 Database Optimization
- [ ] Add database indexes:
  - [ ] Tournament status, date
  - [ ] Roster active status
  - [ ] Team lookups
  - [ ] User email, Discord ID
- [ ] Optimize expensive queries
- [ ] Implement query result caching
- [ ] Use connection pooling
- [ ] Paginate large data sets
- [ ] Implement database query monitoring

### 17.4 Caching Strategy
- [ ] Cache static pages
- [ ] Cache API responses (with revalidation)
- [ ] Cache tournament data
- [ ] Cache roster data
- [ ] Implement Redis for session storage (optional)
- [ ] Set appropriate cache headers
- [ ] Invalidate cache on data updates

### 17.5 Loading States
- [ ] Loading skeletons for all pages
- [ ] Loading spinners for actions
- [ ] Progress indicators for uploads
- [ ] Optimistic UI updates
- [ ] Streaming server components
- [ ] Suspense boundaries

---

## Phase 18: User Experience Enhancements

### 18.1 Notification System
- [ ] In-app notification center
- [ ] Notification badge on navbar
- [ ] Mark notifications as read
- [ ] Notification preferences:
  - [ ] Email notifications on/off
  - [ ] Discord DM on/off
  - [ ] Tournament reminders
  - [ ] Match updates
- [ ] Clear all notifications
- [ ] Notification history

### 18.2 Search & Filtering
- [ ] Global search bar
- [ ] Search tournaments
- [ ] Search teams
- [ ] Search rosters
- [ ] Filter by date ranges
- [ ] Filter by status
- [ ] Sort options (A-Z, date, popularity)
- [ ] Save search preferences

### 18.3 User Preferences
- [ ] Theme preference (light/dark)
- [ ] Timezone settings
- [ ] Language preference (future)
- [ ] Notification preferences
- [ ] Default view preferences
- [ ] Accessibility settings

### 18.4 Mobile Optimization
- [ ] Touch-friendly UI elements
- [ ] Mobile-optimized navigation
- [ ] Swipe gestures
- [ ] Mobile bracket view
- [ ] Responsive images
- [ ] Optimize for slow connections
- [ ] PWA features (optional)

---

## Phase 19: SEO & Discoverability

### 19.1 SEO Optimization
- [ ] Add metadata to all pages:
  - [ ] Title tags
  - [ ] Meta descriptions
  - [ ] Open Graph tags
  - [ ] Twitter Card tags
- [ ] Generate dynamic OG images
- [ ] Create XML sitemap
- [ ] Create robots.txt
- [ ] Implement structured data (JSON-LD):
  - [ ] Organization schema
  - [ ] Event schema for tournaments
  - [ ] SportsTeam schema for rosters
- [ ] Optimize page titles
- [ ] Add canonical URLs

### 19.2 Social Sharing
- [ ] Share tournament buttons
- [ ] Share bracket images
- [ ] Share roster cards
- [ ] Custom OG images for tournaments
- [ ] Pre-filled social media posts
- [ ] Share to Discord integration

### 19.3 Analytics & Tracking
- [ ] Setup Vercel Analytics
- [ ] Track page views
- [ ] Track tournament registrations
- [ ] Track button clicks
- [ ] Track user flow
- [ ] Track conversion rates
- [ ] Custom event tracking
- [ ] Heatmap tracking (optional)

---

## Phase 20: Maintenance & Operations

### 20.1 Maintenance Mode
- [ ] Create maintenance page
- [ ] Toggle maintenance mode from admin
- [ ] Allow admin access during maintenance
- [ ] Schedule maintenance windows
- [ ] Display estimated downtime
- [ ] Redirect all users during maintenance

### 20.2 System Health Monitoring
- [ ] Create health check endpoint (`/api/health`)
- [ ] Monitor API response times
- [ ] Monitor database connection
- [ ] Monitor email service status
- [ ] Monitor Discord bot status
- [ ] Setup uptime monitoring (UptimeRobot, etc.)
- [ ] Alert on critical failures
- [ ] Status page for users

### 20.3 Logging & Debugging
- [ ] Implement structured logging
- [ ] Log levels (error, warn, info, debug)
- [ ] Log API requests/responses
- [ ] Log authentication attempts
- [ ] Log failed operations
- [ ] Setup error tracking (Sentry)
- [ ] Log performance metrics
- [ ] Create debug mode for admins

### 20.4 Database Maintenance
- [ ] Create database cleanup scripts
- [ ] Archive old tournaments
- [ ] Delete expired verification tokens
- [ ] Prune old audit logs
- [ ] Optimize database tables periodically
- [ ] Monitor database size
- [ ] Plan for scaling

---

## Phase 21: API Documentation & Webhooks

### 21.1 API Documentation
- [ ] Create API documentation page
- [ ] Document all public endpoints
- [ ] Document authentication
- [ ] Document rate limits
- [ ] Provide example requests/responses
- [ ] Document error codes
- [ ] Create API playground (optional)
- [ ] Version API endpoints

### 21.2 Webhook System
- [ ] Implement webhook subscriptions
- [ ] Trigger webhooks on events:
  - [ ] Tournament created
  - [ ] Tournament started
  - [ ] Team registered
  - [ ] Match completed
  - [ ] Bracket updated
- [ ] Webhook configuration in admin
- [ ] Webhook delivery retry logic
- [ ] Webhook event logs

### 21.3 Third-Party Integrations
- [ ] Twitch integration (embed streams)
- [ ] YouTube integration
- [ ] Twitter/X API integration
- [ ] Rocket League API (if available)
- [ ] Steam API integration
- [ ] Partner APIs

---

## Phase 22: Testing Strategy

### 22.1 Unit Testing
- [ ] Setup Jest and React Testing Library
- [ ] Test utility functions
- [ ] Test validation schemas
- [ ] Test API route handlers
- [ ] Test bracket generation logic
- [ ] Test authentication logic
- [ ] Test email formatting
- [ ] Achieve 70%+ code coverage

### 22.2 Integration Testing
- [ ] Test API endpoint flows
- [ ] Test database operations
- [ ] Test authentication flow
- [ ] Test tournament registration flow
- [ ] Test bracket generation end-to-end
- [ ] Test email sending
- [ ] Test Discord bot commands

### 22.3 End-to-End Testing
- [ ] Setup Playwright or Cypress
- [ ] Test complete user journeys:
  - [ ] User registration for tournament
  - [ ] Admin creating tournament
  - [ ] Admin generating bracket
  - [ ] Viewing public pages
- [ ] Test critical paths
- [ ] Test on multiple browsers

### 22.4 Manual Testing Checklist
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Accessibility testing (WCAG compliance)
- [ ] Performance testing (Lighthouse)
- [ ] Security testing (OWASP Top 10)
- [ ] Load testing (stress test API)
- [ ] User acceptance testing

---

## Phase 23: Deployment Pipeline & DevOps

### 23.1 Environment Setup
- [ ] Development environment
- [ ] Staging environment
- [ ] Production environment
- [ ] Environment-specific configs
- [ ] Separate databases per environment
- [ ] Environment variable management

### 23.2 CI/CD Pipeline
- [ ] Setup GitHub Actions workflow
- [ ] Automated testing on PR
- [ ] Automated linting on PR
- [ ] Automated type checking
- [ ] Build verification
- [ ] Automated preview deployments
- [ ] Automated production deployments
- [ ] Deployment notifications

### 23.3 Database Migrations
- [ ] Create migration strategy
- [ ] Test migrations on staging first
- [ ] Backup before migrations
- [ ] Rollback procedures
- [ ] Migration documentation
- [ ] Zero-downtime migration strategy

### 23.4 Rollback Procedures
- [ ] Document rollback steps
- [ ] Quick rollback command
- [ ] Database rollback procedures
- [ ] Communication plan for incidents
- [ ] Post-mortem template

### 23.5 Monitoring & Alerts
- [ ] Setup error alerts (Sentry)
- [ ] Setup performance alerts
- [ ] Setup uptime alerts
- [ ] Monitor database performance
- [ ] Monitor API usage
- [ ] Setup on-call rotation (if team)
- [ ] Incident response runbook

---

## Phase 24: Documentation & Handoff

### 24.1 Technical Documentation
- [ ] Update README.md with:
  - [ ] Project overview
  - [ ] Tech stack
  - [ ] Prerequisites
  - [ ] Setup instructions
  - [ ] Environment variables list
  - [ ] Development workflow
  - [ ] Testing instructions
  - [ ] Deployment process
  - [ ] Troubleshooting guide
- [ ] Document API endpoints
- [ ] Document database schema with ERD
- [ ] Add inline code comments
- [ ] Create architecture diagram
- [ ] Document design decisions

### 24.2 User Documentation
- [ ] Admin dashboard guide:
  - [ ] How to access admin panel
  - [ ] How to create rosters
  - [ ] How to add players
  - [ ] How to create tournaments
  - [ ] How to configure tournament settings
  - [ ] How to manage registrations
  - [ ] How to generate brackets
  - [ ] How to update match scores
  - [ ] How to handle disputes
- [ ] Public user guide:
  - [ ] How to register for tournaments
  - [ ] How to verify email
  - [ ] How to view brackets
  - [ ] How to contact support

### 24.3 Operational Documentation
- [ ] Maintenance procedures
- [ ] Backup and restore procedures
- [ ] Database cleanup procedures
- [ ] Monitoring checklist
- [ ] Incident response plan
- [ ] Security update schedule
- [ ] Contact information
- [ ] Vendor/service credentials location

### 24.4 Video Tutorials (Optional)
- [ ] Admin dashboard walkthrough
- [ ] Creating a tournament
- [ ] Managing brackets
- [ ] Troubleshooting common issues

---

## Phase 25: Launch Preparation

### 25.1 Pre-Launch Checklist
- [ ] All critical features tested
- [ ] All admin features tested by multiple admins
- [ ] Performance optimization completed
- [ ] Security audit completed
- [ ] Backup systems tested
- [ ] Monitoring and alerts configured
- [ ] Error tracking configured
- [ ] Domain and DNS configured
- [ ] SSL certificate verified
- [ ] Email delivery verified
- [ ] Discord bot verified
- [ ] Privacy policy published
- [ ] Terms of service published

### 25.2 Launch Plan
- [ ] Set launch date
- [ ] Prepare announcement content
- [ ] Create launch checklist
- [ ] Plan soft launch vs full launch
- [ ] Prepare support team
- [ ] Monitor logs during launch
- [ ] Have rollback plan ready

### 25.3 Post-Launch Monitoring
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Monitor user feedback
- [ ] Quick response to issues
- [ ] Collect user feedback
- [ ] Plan hotfix releases if needed

---

## Phase 27: User Account System & Social Features

### 27.1 User Account Creation & Management
- [ ] **Account Registration:**
  - [ ] Create account page (`/app/account/register/page.tsx`)
  - [ ] Username creation form (unique, validation)
  - [ ] Email input and verification
  - [ ] Password creation (optional, since Discord OAuth)
  - [ ] Discord account linking/connection
  - [ ] Terms of service acceptance
  - [ ] Avatar/profile picture upload
- [ ] **User Profile:**
  - [ ] Unique user ID generation
  - [ ] Profile page (`/app/profile/[userId]/page.tsx`)
  - [ ] Display name, username, avatar
  - [ ] Bio/description field
  - [ ] Linked Discord account display
  - [ ] Account creation date
  - [ ] Public/private profile toggle
  - [ ] Edit profile functionality
- [ ] **Database Schema Extensions:**
  - [ ] Add username field to User model
  - [ ] Add unique user ID field
  - [ ] Add bio/description field
  - [ ] Add privacy settings
  - [ ] Create Friendship model (user relationships)
  - [ ] Create Group model (user groups)
  - [ ] Create GroupMember model (group membership)

### 27.2 Friend System
- [ ] **Friend Management:**
  - [ ] Send friend request functionality
  - [ ] Accept/decline friend requests
  - [ ] Friend list page (`/app/friends/page.tsx`)
  - [ ] Search users by username/user ID
  - [ ] Friend request notifications
  - [ ] Remove friend functionality
  - [ ] Block user functionality
  - [ ] Friend status indicators (online, offline, in-game)
- [ ] **Friend API Routes:**
  - [ ] `POST /api/friends/request` - Send friend request
  - [ ] `PATCH /api/friends/request/[id]` - Accept/decline request
  - [ ] `GET /api/friends` - Get friend list
  - [ ] `DELETE /api/friends/[id]` - Remove friend
  - [ ] `POST /api/friends/block` - Block user
  - [ ] `GET /api/users/search` - Search users

### 27.3 Group/Party System
- [ ] **Group Creation:**
  - [ ] Create group page (`/app/groups/new/page.tsx`)
  - [ ] Group name input
  - [ ] Group description
  - [ ] Group avatar/icon
  - [ ] Privacy settings (public, private, invite-only)
  - [ ] Maximum member limit
  - [ ] Group tags/interests
- [ ] **Group Management:**
  - [ ] Group page (`/app/groups/[id]/page.tsx`)
  - [ ] Invite friends to group
  - [ ] Accept/decline group invitations
  - [ ] Kick/remove members (group owner)
  - [ ] Leave group functionality
  - [ ] Transfer group ownership
  - [ ] Group settings page
  - [ ] Member list with roles
  - [ ] Group activity feed
- [ ] **Group Features:**
  - [ ] Group chat integration
  - [ ] Group tournament registration
  - [ ] Group statistics
  - [ ] Group achievements
- [ ] **Group API Routes:**
  - [ ] `POST /api/groups` - Create group
  - [ ] `GET /api/groups` - List user's groups
  - [ ] `GET /api/groups/[id]` - Get group details
  - [ ] `PATCH /api/groups/[id]` - Update group
  - [ ] `DELETE /api/groups/[id]` - Delete group
  - [ ] `POST /api/groups/[id]/invite` - Invite member
  - [ ] `POST /api/groups/[id]/join` - Join group
  - [ ] `DELETE /api/groups/[id]/members/[userId]` - Remove member

### 27.4 In-Website Chat System
- [ ] **Chat Infrastructure:**
  - [ ] Install WebSocket library (Socket.io or Pusher)
  - [ ] Setup WebSocket server/connection
  - [ ] Create Message model in database
  - [ ] Create Conversation model
  - [ ] Message encryption (optional)
- [ ] **Direct Messages:**
  - [ ] Chat interface component (`/components/chat/ChatInterface.tsx`)
  - [ ] Message list page (`/app/messages/page.tsx`)
  - [ ] Conversation view (`/app/messages/[conversationId]/page.tsx`)
  - [ ] Real-time message sending
  - [ ] Real-time message receiving
  - [ ] Message notifications
  - [ ] Unread message counter
  - [ ] Message history loading
  - [ ] Message search functionality
  - [ ] File/image sharing in chat
  - [ ] Emoji support
  - [ ] Message editing and deletion
  - [ ] Typing indicators
  - [ ] Read receipts
- [ ] **Group Chat:**
  - [ ] Group conversation support
  - [ ] Group chat page (`/app/groups/[id]/chat/page.tsx`)
  - [ ] Member mentions (@username)
  - [ ] Group chat notifications
  - [ ] Chat moderation tools
  - [ ] Message pinning
  - [ ] Chat history
- [ ] **Chat Features:**
  - [ ] Online status indicators
  - [ ] Last seen timestamp
  - [ ] Message reactions
  - [ ] Reply/quote functionality
  - [ ] Chat themes/customization
  - [ ] Do Not Disturb mode
  - [ ] Mute conversations
  - [ ] Block users from messaging
- [ ] **Chat API Routes:**
  - [ ] `GET /api/messages` - Get conversations list
  - [ ] `GET /api/messages/[conversationId]` - Get messages
  - [ ] `POST /api/messages/[conversationId]` - Send message
  - [ ] `PATCH /api/messages/[messageId]` - Edit message
  - [ ] `DELETE /api/messages/[messageId]` - Delete message
  - [ ] `POST /api/messages/read` - Mark messages as read
  - [ ] WebSocket event handlers for real-time

### 27.5 User Settings & Preferences
- [ ] **Account Settings:**
  - [ ] Settings page (`/app/settings/page.tsx`)
  - [ ] Change username
  - [ ] Update email
  - [ ] Change password (if applicable)
  - [ ] Link/unlink Discord account
  - [ ] Privacy settings
  - [ ] Notification preferences
  - [ ] Account deletion
- [ ] **Notification Settings:**
  - [ ] Email notifications toggle
  - [ ] Discord DM notifications toggle
  - [ ] Friend request notifications
  - [ ] Message notifications
  - [ ] Tournament notifications
  - [ ] Group invitation notifications

### 27.6 Integration with Existing Systems
- [ ] **Tournament Integration:**
  - [ ] Register as group for tournaments
  - [ ] User tournament history
  - [ ] Friend tournament invitations
  - [ ] Group tournament performance tracking
- [ ] **Roster Integration:**
  - [ ] Link user profiles to player profiles
  - [ ] User can claim player profile
  - [ ] Display user's teams/rosters
- [ ] **Social Features:**
  - [ ] User activity feed
  - [ ] Friend activity notifications
  - [ ] Share tournament results
  - [ ] Achievement sharing

---

## Phase 26: Future Enhancements (Post-Launch)

### 26.1 Additional Features
- [ ] User profiles for participants
- [ ] Tournament history and stats
- [ ] Leaderboards and rankings
- [ ] Stream integration (Twitch embeds)
- [ ] News/blog system
- [ ] Team applications page
- [ ] Merchandise store integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support

### 26.2 Advanced Tournament Features
- [ ] Swiss system format
- [ ] Round robin format
- [ ] Automatic score reporting (API integration)
- [ ] Live match updates (WebSocket)
- [ ] Replay uploads and viewing
- [ ] Tournament statistics dashboard
- [ ] Auto-scheduling matches with calendar
- [ ] Best player awards
- [ ] Tournament templates

### 26.3 Community Features
- [ ] User comments on tournaments
- [ ] Team forums/discussion boards
- [ ] Public player profiles
- [ ] Match predictions and betting
- [ ] Social media auto-posting
- [ ] Newsletter system
- [ ] Fan voting systems
- [ ] Achievement system

### 26.4 Advanced Admin Features
- [ ] Bulk operations for teams/tournaments
- [ ] Custom tournament workflows
- [ ] Advanced analytics dashboard
- [ ] Revenue tracking (if paid tournaments)
- [ ] Sponsor management
- [ ] Content management system
- [ ] Multi-admin permission granularity

---

## Critical Success Factors

### Must-Have for Launch
1. ✅ Discord OAuth with role-based admin access
2. ✅ Roster management (create, edit, display)
3. ✅ Tournament creation and management
4. ✅ Tournament registration with email verification
5. ✅ Bracket generation (single & double elimination)
6. ✅ Admin bracket management
7. ✅ Discord bot for reminders
8. ✅ All main pages (home, rosters, tournaments, links, support)
9. ✅ Mobile responsive design
10. ✅ Custom domain deployment on Vercel

### Critical for User Experience
1. Error handling and validation
2. Loading states everywhere
3. Clear feedback messages
4. Intuitive admin interface
5. Fast page loads (<3 seconds)
6. Works on mobile devices
7. Accessible navigation

### Critical for Operations
1. Database backups
2. Error monitoring
3. Audit logging
4. Rollback procedures
5. Documentation

---

## Current Status
- ✅ Git repository initialized
- ✅ Connected to GitHub
- ✅ Complete TODO roadmap created
- ✅ **PHASE 1 COMPLETE** - Project foundation with Next.js 16, TypeScript, Tailwind v4, Prisma 7
- ✅ Database schema created with all models
- ✅ Build successful
- ⏳ Next: Phase 2 - Discord OAuth and Admin Dashboard

## Priority Order (Refined)
1. **PHASE 1:** Project foundation (Next.js, database, structure) - IMMEDIATE
2. **PHASE 2:** Admin authentication (Discord OAuth, roles) - CRITICAL
3. **PHASE 3:** Roster management - HIGH PRIORITY
4. **PHASE 4:** Tournament management - CRITICAL
5. **PHASE 5:** Public tournament display & signup - CRITICAL
6. **PHASE 6:** Bracket system - CRITICAL
7. **PHASE 12:** Error handling throughout - CONCURRENT
8. **PHASE 13:** Team management - HIGH PRIORITY
9. **PHASE 14:** Advanced bracket features - HIGH PRIORITY
10. **PHASE 7:** Discord bot integration - MEDIUM PRIORITY
11. **PHASE 8:** Additional pages - MEDIUM PRIORITY
12. **PHASE 15:** Security & permissions - CONCURRENT
13. **PHASE 17:** Performance optimization - BEFORE LAUNCH
14. **PHASE 9:** UI Polish - BEFORE LAUNCH
15. **PHASE 22:** Testing - BEFORE LAUNCH
16. **PHASE 11:** Deployment - LAUNCH
17. **Remaining phases:** As needed/time permits
- ✅ Git repository initialized
- ✅ Connected to GitHub
- ⏳ Next: Initialize Next.js project and setup foundation

## Priority Order
1. **PHASE 1:** Project foundation (setup Next.js, database, structure)
2. **PHASE 2:** Admin authentication and dashboard (CRITICAL)
3. **PHASE 3:** Roster management system
4. **PHASE 4:** Tournament management system (CRITICAL)
5. **PHASE 5:** Public tournament signup and display
6. **PHASE 6:** Bracket system
7. **PHASE 7:** Discord bot integration
8. **PHASE 8:** Additional pages
9. **PHASE 9:** Polish UI/UX
10. **PHASE 10:** Testing
11. **PHASE 11:** Deployment
12. **PHASE 12:** Documentation
