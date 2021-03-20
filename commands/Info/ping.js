module.exports = {
    name: "ping",
    category: "Info",
    cooldown: 3,
    description: "Check the bot ping",
    example: "c.ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send('Pinging...');
        const latency = msg.createdTimestamp - message.createdTimestamp;

        msg.edit(`${client.user.username}'s ping is :
        Server Latency -> \`${latency}\` ms
        API Latency -> \`${Math.round(client.ws.ping)}\` ms`);
    }
}