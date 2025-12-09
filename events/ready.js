module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log("\n========================");
        console.log(`✅ Logged in as ${client.user.tag}`);
        console.log("========================\n");
    }
};
