## DC alliance bot

A private, multipurpose Discord bot with advanced moderation tools, YouTube video notifications, and a GitHub-powered feed editor. Built for server admins who want clean automation and simple controls.

## Active Bot Functions

### Moderation Commands (`-` and `/`)
- `-ban` / `-unban`
- `-kick`
- `-warn` / `-warnings` / `-clearwarns`
- `-clean` — Deletes messages
- `-whois` — View user info
- `-mute`
- `/roles add`
- `/roles remove`

### Utility
- **Welcome/Leave Messages** — Greets users on join/leave
- **YouTube Notifier** — Automatically posts new videos from specified channels
- **Reaction Roles** — Lets users assign roles with reactions

## Dashboard

The bot now serves an admin dashboard from the same Express server:

- `/dashboard` - Discord OAuth protected control panel
- `/api/dashboard/config` - authenticated settings API
- `/auth/discord` - Discord sign-in

Dashboard access is limited to users who have the configured Discord role in the configured guild. Set these environment variables before using it:

```env
DISCORD_CLIENT_ID=your_discord_application_id
DISCORD_CLIENT_SECRET=your_discord_oauth_secret
DISCORD_GUILD_ID=your_server_id
DASHBOARD_ALLOWED_ROLE_ID=role_that_can_open_dashboard
DASHBOARD_BASE_URL=https://your-render-app.onrender.com
DISCORD_REDIRECT_URI=https://your-render-app.onrender.com/auth/discord/callback
DASHBOARD_SESSION_SECRET=a_long_random_secret
DASHBOARD_CONFIG_PATH=/var/data/dashboardConfig.json
```

Add the same redirect URL in the Discord Developer Portal under OAuth2 redirects.
If your host has an ephemeral filesystem, point `DASHBOARD_CONFIG_PATH` at a persistent disk path.


## Tech Stack

- **Bot Framework:** Discord.js
- **Database:** Neon (PostgreSQL)
- **Dashboard:** Express + vanilla HTML/CSS/JS
- **Hosting:** Render (Bot) | Vercel (Dashboard)

## Contributors
- **Drago**
- **Devil**
- **BlackWing**


