const Discord = require("discord.js");

module.exports = {
    name: "unlock",
    category: "Moderation",
    description: "Unlock a channel and allow users to be able to chat in the channel again.",
    usage: "[#channel | channel ID]",
    cooldown: 5,
    example: "unlock #general",
    permission: "MANAGE_CHANNELS",
    run: async (client, message, args) => {
        const chn = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
        if (!chn) return message.channel.send("You also need to mention the channel to unlock.");
        chn.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: null
        });
        message.channel.send(`Successfully unlocked <#${chn.id}>. Use \`lock\` command to lock the channel again.`);
    }
}