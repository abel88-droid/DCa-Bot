const { syncLegacyReactionRole } = require("../utils/legacyReactionRoleEvent");

module.exports = {
    name: "reactionRolesRules",
    async execute(client) {
        return syncLegacyReactionRole(client, "rules-confirmation");
    }
};
