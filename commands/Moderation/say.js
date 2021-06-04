const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "say",
    description: "Says your text.",
    usage: "<text>",
    category: "Moderation",
    cooldown: 5,
    example: "say Hello! I am a bot!",
    permission: "MANAGE_MESSAGES",
    info: "You can add `embed` after the command name to say the text in an embed. For eg: `say embed I am Rem's creation`",
    run: (client, message, args) => {
        message.delete();

        if (args.length < 1)
            return message.reply("Nothing to say? Well then, I can say nothing as well.").then(m => m.delete({ timeout: 5000 }));

        const roleColor = message.guild.me.roles.highest.hexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new MessageEmbed()
                .setDescription(args.slice(1).join(" "))
                .setFooter(message.author.username, message.author.displayAvatarURL())
                .setTimestamp()
                .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}