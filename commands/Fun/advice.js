const { MessageEmbed } = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = {
    name: "advice",
    cooldown: 5,
    description: "Get some helpful advices!",
    example: "advice",
    aliases: ["giveadvice"],
    category: "Fun",
    run: async (client, message, args) => {
        let r = await snekfetch.get('http://api.adviceslip.com/advice');
        let advice = JSON.parse(r.body).slip.advice;
        const embed = new MessageEmbed()
        .setTitle("Advice")
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setColor("#cf67cf")
        .setTimestamp()
        .setDescription(advice)
        message.channel.send(embed);
    }
}