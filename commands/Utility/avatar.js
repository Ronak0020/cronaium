const {MessageEmbed} = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: ["av"],
  description: "Check your/someone else' avatar.",
  usage: "[@user]",
  exaple: "avatar @Ronak#7611",
  cooldown: 5,
  category: "Utility",
  run: async(client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const embed = new MessageEmbed()
    .setTitle(user.tag + "'s Avatar -'")
    .setColor(message.guild.me.roles.highest.hexColor)
    .setTimestamp()
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setImage(user.displayAvatarURL({ size: 512, dynamic: true }).replace(".webp", ".png"))
    .setAuthor("Requested by- " + message.author.username, message.author.displayAvatarURL());
    message.channel.send(embed);
  }
}