const { loadDashboardConfig, saveDashboardConfig } = require("./dashboardConfig");
let syncPromise = null;

function normalizeForSearch(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function reactionKeys(emoji) {
    const keys = new Set();

    if (!emoji) return keys;
    if (emoji.name) keys.add(emoji.name);
    if (emoji.id) {
        keys.add(emoji.id);
        keys.add(`${emoji.name}:${emoji.id}`);
        keys.add(`<:${emoji.name}:${emoji.id}>`);
        keys.add(`<a:${emoji.name}:${emoji.id}>`);
    }

    try {
        keys.add(emoji.toString());
    } catch {
        // Some partial emoji objects do not stringify cleanly.
    }

    return keys;
}

function optionMatchesReaction(option, emoji) {
    const expected = String(option.emoji || "").trim();
    if (!expected) return false;

    const keys = reactionKeys(emoji);
    if (keys.has(expected)) return true;

    const customMatch = expected.match(/^<a?:[^:]+:(\d+)>$/) || expected.match(/^[^:]+:(\d+)$/);
    return Boolean(customMatch && keys.has(customMatch[1]));
}

function buildReactionRoleMessageMap(config) {
    const map = new Map();

    for (const group of config.reactionRoles || []) {
        if (!group.enabled || !group.messageId) continue;
        map.set(group.messageId, group);
    }

    return map;
}

async function findExistingBotMessage(channel, client, group) {
    if (!channel.messages?.fetch) return null;

    const messages = await channel.messages.fetch({ limit: 25 });
    const expected = normalizeForSearch(group.message);
    const firstLine = normalizeForSearch(String(group.message || "").split("\n")[0]);

    return messages.find(message => (
        message.author?.id === client.user.id &&
        normalizeForSearch(message.content) === expected
    )) || messages.find(message => (
        message.author?.id === client.user.id &&
        firstLine.length >= 16 &&
        normalizeForSearch(message.content).includes(firstLine)
    )) || null;
}

async function fetchConfiguredMessage(channel, group) {
    if (!group.messageId || !channel.messages?.fetch) return null;

    try {
        return await channel.messages.fetch(group.messageId);
    } catch {
        return null;
    }
}

async function ensureGroupMessage(client, group) {
    if (!group.enabled) {
        return { id: group.id, name: group.name, skipped: true, reason: "disabled" };
    }

    if (!group.channelId) {
        return { id: group.id, name: group.name, skipped: true, reason: "missing channel" };
    }

    if (!group.options.length) {
        return { id: group.id, name: group.name, skipped: true, reason: "missing options" };
    }

    let channel;
    try {
        channel = await client.channels.fetch(group.channelId);
    } catch (error) {
        return { id: group.id, name: group.name, skipped: true, reason: error.message };
    }

    if (!channel?.isTextBased?.() || !channel.messages?.fetch) {
        return { id: group.id, name: group.name, skipped: true, reason: "channel is not text based" };
    }

    let botMessage = await fetchConfiguredMessage(channel, group);
    if (botMessage?.author?.id !== client.user.id) botMessage = null;
    if (!botMessage) botMessage = await findExistingBotMessage(channel, client, group);

    const created = !botMessage;
    if (!botMessage) {
        botMessage = await channel.send({ content: group.message });
    } else if (botMessage.content !== group.message) {
        await botMessage.edit({ content: group.message });
    }

    const reactionErrors = [];
    for (const option of group.options) {
        try {
            await botMessage.react(option.emoji);
        } catch (error) {
            reactionErrors.push(`${option.emoji}: ${error.message}`);
        }
    }

    return {
        id: group.id,
        name: group.name,
        messageId: botMessage.id,
        channelId: group.channelId,
        created,
        reactionErrors
    };
}

async function runReactionRoleSync(client) {
    if (!client?.isReady?.()) {
        throw new Error("Discord client is not ready yet.");
    }

    const config = loadDashboardConfig();
    const reactionRoles = [];
    const results = [];
    let changed = false;

    for (const group of config.reactionRoles) {
        const result = await ensureGroupMessage(client, group);
        results.push(result);

        if (result.messageId && result.messageId !== group.messageId) {
            reactionRoles.push({ ...group, messageId: result.messageId });
            changed = true;
        } else {
            reactionRoles.push(group);
        }
    }

    const nextConfig = changed
        ? saveDashboardConfig({ ...config, reactionRoles })
        : config;

    client.reactionRoleMessageMap = buildReactionRoleMessageMap(nextConfig);
    return { config: nextConfig, results };
}

async function ensureReactionRoleMessages(client) {
    if (syncPromise) return syncPromise;

    syncPromise = runReactionRoleSync(client).finally(() => {
        syncPromise = null;
    });

    return syncPromise;
}

async function handleReactionRole(client, reaction, user, add) {
    if (user.bot) return;

    try {
        if (reaction.partial) reaction = await reaction.fetch();
        if (reaction.message?.partial) await reaction.message.fetch();

        const messageId = reaction.message?.id;
        if (!messageId) return;

        if (!client.reactionRoleMessageMap) {
            client.reactionRoleMessageMap = buildReactionRoleMessageMap(loadDashboardConfig());
        }

        let group = client.reactionRoleMessageMap.get(messageId);
        if (!group) {
            client.reactionRoleMessageMap = buildReactionRoleMessageMap(loadDashboardConfig());
            group = client.reactionRoleMessageMap.get(messageId);
        }

        if (!group?.enabled) return;

        const option = group.options.find(item => optionMatchesReaction(item, reaction.emoji));
        if (!option) return;

        const guild = reaction.message.guild;
        if (!guild) return;

        const member = await guild.members.fetch(user.id);
        if (!member) return;

        if (add) {
            await member.roles.add(option.roleId, `Reaction role: ${group.name}`);
        } else {
            await member.roles.remove(option.roleId, `Reaction role: ${group.name}`);
        }
    } catch (error) {
        console.error("Reaction role update failed:", error);
    }
}

module.exports = {
    buildReactionRoleMessageMap,
    ensureReactionRoleMessages,
    handleReactionRole
};
