const Discord = require("discord.js");

module.exports = {
    name: "lock",
    category: "Moderation",
    description: "Lock a channel and stop everyone from sendong messages in it.",
    usage: "[#channel | channel ID]",
    cooldown: 5,
    example: "lock #general",
    permission: "MANAGE_CHANNELS",
    run: async (client, message, args) => {
        const chn = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
        if (!chn) return message.channel.send("You also need to mention the channel to lock.");
        chn.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: false
        });
        message.channel.send(`Successfully locked <#${chn.id}>. Use \`unlock\` command to unlock the channel.`);
    }
}