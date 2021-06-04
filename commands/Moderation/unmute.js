const Discord = require("discord.js");

module.exports = {
    name: "unmute",
    category: "Moderation",
    description: "Unmutes a member.",
    example: "unmute @Rem",
    cooldown: 5,
    usage: "<@user>",
    run: async (client, message, args) => {
        const muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === "muted");
        if (!message.member.permissions.has(["MANAGE_MESSAGES"])) return message.reply("You do not have permission to use this command!").then(m => m.delete({ timeout: 10000 }));
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply("You need to mention a user to unmute.").then(m => m.delete({ timeout: 10000 }));
        if (!user.roles.cache.has(muteRole.id)) return message.reply("User is not muted!").then(m => m.delete({ timeout: 10000 }));
        user.roles.remove(muteRole.id);
        message.channel.send("User was succesfully unmuted!");
    }
}