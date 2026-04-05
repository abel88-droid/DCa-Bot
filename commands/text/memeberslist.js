module.exports = {
    name: "team",
    description: "Show team member list",

    async execute(message, args) {
        const leaderRoleId = "1346297821120299028";
        const coLeaderRoleId = "1341452771567599617";
        const driverRoleId = "1374284876982784072";

        const guild = message.guild;

        function formatMembers(role) {
            if (!role) return "No role found.";

            const members = role.members.map((m, i) => {
                const name = m.nickname || m.user.username;
                return `${i + 1}. ${name}`;
            });

            return members.length ? members.join("\n") : "No members.";
        }

        const leaderRole = guild.roles.cache.get(leaderRoleId);
        const coLeaderRole = guild.roles.cache.get(coLeaderRoleId);
        const driverRole = guild.roles.cache.get(driverRoleId);

        let msg = `**Discord 3™ (Auto Updated)**\n\n`;

        msg += `🟡 **Leader**\n${formatMembers(leaderRole)}\n\n`;
        msg += `🔴 **Co-Leaders**\n${formatMembers(coLeaderRole)}\n\n`;
        msg += `🟢 **Drivers**\n${formatMembers(driverRole)}`;

        message.channel.send(msg);
    }
};
