module.exports = {
    name: "team",
    description: "Show team member list",

    async execute(message, args) {
        const leaderRoleId = "1345425056586661961";
        const coLeaderRoleId = "1346297821120299028";
        const driverRoleId = "1341452771567599617";

        const guild = message.guild;

        const leaderRole = guild.roles.cache.get(leaderRoleId);
        const coLeaderRole = guild.roles.cache.get(coLeaderRoleId);
        const driverRole = guild.roles.cache.get(driverRoleId);

        const leaders = leaderRole ? Array.from(leaderRole.members.values()) : [];
        const coLeaders = coLeaderRole ? Array.from(coLeaderRole.members.values()) : [];
        const drivers = driverRole ? Array.from(driverRole.members.values()) : [];

        // Remove duplicates
        const leaderIds = new Set(leaders.map(m => m.id));
        const coLeaderIds = new Set(coLeaders.map(m => m.id));

        const filteredCoLeaders = coLeaders.filter(m => !leaderIds.has(m.id));
        const filteredDrivers = drivers.filter(
            m => !leaderIds.has(m.id) && !coLeaderIds.has(m.id)
        );

        function formatList(members) {
            if (!members.length) return "No members.";

            return members
                .map((m, i) => {
                    let ign = m.nickname || m.user.username;

                    
                    ign = ign.replace(/^\d+\.\s*/, "");

                    return `${i + 1}. ${ign} - <@${m.id}>`;
                })
                .join("\n");
        }

        let msg = `**Discord 3™ (Auto Updated)**\n\n`;

        msg += `🟡 **Leader**\n${formatList(leaders)}\n\n`;
        msg += `🔴 **Co-Leaders**\n${formatList(filteredCoLeaders)}\n\n`;
        msg += `🟢 **Drivers**\n${formatList(filteredDrivers)}`;

        message.channel.send(msg);
    }
};
