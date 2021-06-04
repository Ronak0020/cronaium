const Discord = require("discord.js");
const User = require("../../models/user.js");

module.exports = {
    name: "balance",
    aliases: ["bal"],
    category: "Economy",
    description: "Check your or another user's balance! How many spirits do a user have??",
    example: "balance @Rem#8948",
    usage: "[@user]",
    cooldown: 5,
    run: async (client, message, args) => {
        const target = message.mentions.users.first() || message.author;
        User.findOne({
            userID: target.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (!user) return message.channel.send("Seems like the user has not started using me yet ;-; They got no spirits in their crate.");
            const embed = new Discord.MessageEmbed()
                .setTitle("Spirits Crate!")
                .setColor("#f56cf6")
                .setFooter(message.author.username, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`Balance for **${target.username}**\n<:spirits:814860320828817408> - ${user.coins.toLocaleString()} Spirits\n<:legendaryspirits:814860322460532776> - ${user.gems.toLocaleString()} Legendary Spirits`)
                .setThumbnail(target.avatarURL())
            message.channel.send(embed)
        })
    }
}