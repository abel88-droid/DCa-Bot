function renderMemberTemplate(template, member) {
    const user = member.user || {};
    const replacements = {
        member: `<@${member.id}>`,
        username: user.username || member.displayName || "member",
        displayName: member.displayName || user.username || "member",
        tag: user.tag || user.username || "member",
        server: member.guild?.name || "this server",
        memberCount: String(member.guild?.memberCount || "")
    };

    return String(template || "").replace(/\{(member|username|displayName|tag|server|memberCount)\}/g, (_, key) => {
        return replacements[key];
    });
}

module.exports = {
    renderMemberTemplate
};
