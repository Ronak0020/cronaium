const Discord = require("discord.js");

module.exports = {
    name: "moveuser", 
    aliases: ["move", "moveto"],
    category: "Moderation",
    cooldown: 5,
    usage: "<@User | userID> <channel name | channelID>",
    example: "moveuser @Ronak General VC",
    run: async(client, message, args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.reply("The member was not found. Make sure you provided correct mention/memberID and try again.");
        let channel = message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.slice(1).join(" ").toLowerCase() && c.type === "voice");
        if(!channel) return message.reply("The channel was not found. Make sure you provided correct name/channelID and try again.");
        if(!member.voice.channel) return message.reply("The member is not in any voice channel. I can not move them to any voice channel if they are not in one.");
        if(member.voice.channel.id === channel.id) return message.reply("The member is already in that channel. I can not move them in a channel where they already are?");
        member.voice.setChannel(channel).then(message.channel.send(`Successfully moved - **${member.displayName}** to voice channel - **${channel.name}**`));
    }
}