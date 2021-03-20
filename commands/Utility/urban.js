const Discord = require('discord.js');
const request = require("node-superfetch");
const { formatNumber, shorten } = require("../../utils/utils");

module.exports = {
    name: "urban",
    description: "Want meaning of any word? Try searching on Urban!",
    category: "Utility",
    usage: "<word>",
    aliases: ["ud"],
    example: "urban Accomplish",
    cooldown: 5,
    run: async (client, message, args) => {
        try {
            const { body } = await request
                .get('http://api.urbandictionary.com/v0/define')
                .query({ term: args.join(" ") });
            if (!body.list.length) return msg.say('Could not find any results.');
            const data = body.list[0];
            const embed = new Discord.MessageEmbed()
                .setColor(0x32A8F0)
                .setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
                .setURL(data.permalink)
                .setTitle(data.word)
                .setDescription(shorten(data.definition.replace(/\[|\]/g, '')))
                .setFooter(`👍 ${formatNumber(data.thumbs_up)} 👎 ${formatNumber(data.thumbs_down)}`)
                .setTimestamp(new Date(data.written_on))
                .addField('❯ Example', data.example ? shorten(data.example.replace(/\[|\]/g, ''), 1000) : 'None');
            return message.channel.send(embed);
        } catch (err) {
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}