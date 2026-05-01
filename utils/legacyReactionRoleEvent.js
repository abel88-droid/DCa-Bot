const { ensureReactionRoleMessages } = require("./reactionRoleManager");

async function syncLegacyReactionRole(client, groupId) {
    const { config } = await ensureReactionRoleMessages(client);
    return config.reactionRoles.find(group => group.id === groupId)?.messageId || null;
}

module.exports = {
    syncLegacyReactionRole
};
