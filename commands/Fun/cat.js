const Discord = require("discord.js");
const request = require("node-superfetch");
const facts = require("../../assets/json/cat-fact");

module.exports = {
    name: "cat",
    category: "Fun",
    description: "Get some kawaii cat pics + random cat fact :D",
    cooldown: 5,
    run: async(client, message, args) => {
        const embed = new Discord.MessageEmbed()
        .setTitle("A cutie cat is here!! Meow~")
        .setColor("#f2c67c")
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL());

        try {
            const { body } = await request.get('https://aws.random.cat/meow');
            embed.setImage(body.file);
            embed.setDescription(facts[Math.floor(Math.random() * facts.length)]);
            message.channel.send(embed);
        } catch (err) {
            message.reply(`Uh oh~ An error occured! \`${err.message}\`. Try again later!`)
        }
    }
}