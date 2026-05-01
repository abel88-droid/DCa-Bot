const { syncLegacyReactionRole } = require("../utils/legacyReactionRoleEvent");

module.exports = {
    name: "reactionRolesTournament",
    async execute(client) {
        return syncLegacyReactionRole(client, "tournament-adventure");
    }
};
