const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "roleinfo",
    category: "Info",
    cooldown: 5,
    usage: "<role name | id | mention>",
    description: "Get information about a role.",
    example: "roleinfo Members",
    aliases: ["rolei", "ri"],
    run: async(client, message, args) => {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(" ").toLowerCase());
        if (!role) return message.channel.send("Role was not found in the server.")
        const embed = new Discord.MessageEmbed()
        .setTitle("Role Info")
        .setColor(role.hexColor)
        .setAuthor(message.member.displayName, message.author.displayAvatarURL())
        .setThumbnail(message.guild.iconURL())
        .addField("Role Name:", role.name, true)
        .addField("Role Creation:", moment(role.createdTimestamp).format('LT'), true)
        .addField("Role Position:", message.guild.roles.cache.size - role.position, true)
        .addField("Mentionable:", role.mentionable ? "Yes. Anyone can mention this role." : "No one can mention this role except admins.", true)
        .addField("Role Color:", role.hexColor, true)
        .addField("Role ID:", role.id, true)
        .addField("Total members with this Role:", role.members.size, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp()
        message.channel.send(embed)
    }
}