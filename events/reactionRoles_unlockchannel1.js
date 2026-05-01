const { syncLegacyReactionRole } = require("../utils/legacyReactionRoleEvent");

module.exports = {
    name: "reactionRolesUnlock1",
    async execute(client) {
        return syncLegacyReactionRole(client, "social-categories");
    }
};
