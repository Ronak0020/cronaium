const Discord = require("discord.js");
const request = require("node-superfetch");
const facts = require("../../assets/json/dog-fact");

module.exports = {
    name: "dog",
    dogegory: "Fun",
    description: "Get some kawaii dog pics + random dog fact :D",
    cooldown: 5,
    run: async(client, message, args) => {
        const embed = new Discord.MessageEmbed()
        .setTitle("A dog has spawned!! Bhow bhow!")
        .setColor("#f2c67c")
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL());

        try {
            const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
            embed.setImage(body.message);
            embed.setDescription(facts[Math.floor(Math.random() * facts.length)]);
            message.channel.send(embed);
        } catch (err) {
            message.reply(`Uh oh~ An error occured! \`${err.message}\`. Try again later!`)
        }
    }
}