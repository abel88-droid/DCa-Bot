const { syncLegacyReactionRole } = require("../utils/legacyReactionRoleEvent");

module.exports = {
    name: "reactionRolesGCcall",
    async execute(client) {
        return syncLegacyReactionRole(client, "garage-change-pings");
    }
};
