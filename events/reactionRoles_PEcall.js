const { syncLegacyReactionRole } = require("../utils/legacyReactionRoleEvent");

module.exports = {
    name: "reactionRolesPECall",
    async execute(client) {
        return syncLegacyReactionRole(client, "event-pings");
    }
};
