const { syncLegacyReactionRole } = require("../utils/legacyReactionRoleEvent");

module.exports = {
    name: "reactionRolesUnlock3",
    async execute(client) {
        return syncLegacyReactionRole(client, "language-unlock");
    }
};
