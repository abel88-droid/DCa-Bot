const path = require("path");
const express = require("express");
const { ChannelType } = require("discord.js");
const { loadDashboardConfig, saveDashboardConfig } = require("./dashboardConfig");
const { ensureReactionRoleMessages } = require("./reactionRoleManager");
const {
    getOAuthConfig,
    getSession,
    registerDashboardAuthRoutes,
    requireDashboardAuth
} = require("./dashboardAuth");

const DASHBOARD_DIR = path.join(__dirname, "..", "dashboard");
const TEXT_CHANNEL_TYPES = new Set([
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement
]);

function avatarUrl(user) {
    if (!user?.avatar) return "";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=80`;
}

async function getGuildLookups(client) {
    const guildId = process.env.DISCORD_GUILD_ID || "";

    if (!client?.isReady?.() || !guildId) {
        return {
            ready: Boolean(client?.isReady?.()),
            guild: null,
            channels: [],
            roles: []
        };
    }

    const guild = await client.guilds.fetch(guildId);
    await Promise.all([
        guild.channels.fetch(),
        guild.roles.fetch()
    ]);

    const channels = [...guild.channels.cache.values()]
        .filter(channel => TEXT_CHANNEL_TYPES.has(channel.type))
        .sort((a, b) => a.rawPosition - b.rawPosition || a.name.localeCompare(b.name))
        .map(channel => ({
            id: channel.id,
            name: channel.parent?.name ? `${channel.parent.name} / #${channel.name}` : `#${channel.name}`
        }));

    const roles = [...guild.roles.cache.values()]
        .filter(role => role.id !== guild.id && !role.managed)
        .sort((a, b) => b.position - a.position || a.name.localeCompare(b.name))
        .map(role => ({
            id: role.id,
            name: role.name,
            color: role.hexColor === "#000000" ? "" : role.hexColor,
            position: role.position
        }));

    return {
        ready: true,
        guild: {
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL({ size: 80 }) || ""
        },
        channels,
        roles
    };
}

async function syncReactionRolesIfReady(client) {
    if (!client?.isReady?.()) {
        return { skipped: true, reason: "Discord client is not ready yet." };
    }

    try {
        return await ensureReactionRoleMessages(client);
    } catch (error) {
        console.error("Dashboard reaction role sync failed:", error);
        return { error: error.message };
    }
}

function registerDashboardRoutes(app, client) {
    const requireAuth = requireDashboardAuth(client);

    registerDashboardAuthRoutes(app, client);

    app.use("/dashboard", express.static(DASHBOARD_DIR, {
        index: false,
        maxAge: "1h"
    }));

    app.get(["/dashboard", "/dashboard/"], (req, res) => {
        res.sendFile(path.join(DASHBOARD_DIR, "index.html"));
    });

    app.get("/api/dashboard/me", (req, res) => {
        const session = getSession(req);
        const oauth = getOAuthConfig(req, client);

        res.json({
            authenticated: Boolean(session),
            user: session ? {
                ...session.user,
                avatarUrl: avatarUrl(session.user)
            } : null,
            setup: {
                configured: oauth.configured,
                missing: oauth.missing
            },
            bot: {
                ready: Boolean(client?.isReady?.()),
                user: client?.user ? {
                    id: client.user.id,
                    tag: client.user.tag
                } : null
            }
        });
    });

    app.get("/api/dashboard/config", requireAuth, async (req, res) => {
        try {
            const [config, lookups] = await Promise.all([
                Promise.resolve(loadDashboardConfig()),
                getGuildLookups(client)
            ]);

            res.json({ config, lookups });
        } catch (error) {
            console.error("Dashboard config load failed:", error);
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/dashboard/config", requireAuth, async (req, res) => {
        try {
            const saved = saveDashboardConfig(req.body || {});
            const sync = await syncReactionRolesIfReady(client);

            res.json({
                config: sync.config || saved,
                sync
            });
        } catch (error) {
            console.error("Dashboard config save failed:", error);
            res.status(400).json({ error: error.message });
        }
    });

    app.post("/api/dashboard/reaction-roles/sync", requireAuth, async (req, res) => {
        const sync = await syncReactionRolesIfReady(client);
        if (sync.error) {
            res.status(500).json(sync);
            return;
        }

        res.json(sync);
    });
}

module.exports = {
    registerDashboardRoutes
};
