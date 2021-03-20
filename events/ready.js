module.exports = async (client) => {
    console.log(`Oh yeah! ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "idle",
        activity: {
            name: `${client.users.cache.size} users`,
            type: "WATCHING"
        }
    })
}