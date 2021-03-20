const { MessageEmbed } = require("discord.js");
const { getMember } = require("../../utils/utils");

module.exports = {
    name: "love",
    aliases: ["affinity"],
    category: "Fun",
    description: "Calculates the love affinity you have for another person.",
    usage: "[mention | id | username]",
    cooldown: 5,
    example: "love Ronak",
    run: async (client, message, args) => {
        let person = getMember(message, args.join(" "));
        if (!person || message.author.id === person.id) {
            person = message.guild.members.cache
                .filter(m => m.id !== message.author.id)
                .random();
        }
        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖 ".repeat(loveIndex) + "💔 ".repeat(10 - loveIndex);

        const embed = new MessageEmbed()
            .setColor("#ffb6c1")
            .addField(`☁ **${person.displayName}** loves **${message.member.displayName}** this much:`,
                `💟 ${Math.floor(love)}%\n\n${loveLevel}`);

        message.channel.send(embed);
    }
}