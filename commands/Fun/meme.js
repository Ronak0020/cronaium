const Discord = require('discord.js');
const randomPuppy = require('random-puppy');

module.exports = {
    name: "meme",
    category: "Fun",
    cooldown: 5,
    description: "Get some funny memes!",
    category: "Fun",
    run: async (client, message, args) => {
        const subReddits = ["dankmeme", "meme", "me_irl"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const meme = await randomPuppy(random);
        const embed = new Discord.MessageEmbed()
            .setTitle(`Meme Time!`)
            .setColor('#dfc67d')
            .setTimestamp()
            .setImage(meme)
            .setFooter(client.user.username, client.user.displayAvatarURL())
        message.channel.send(embed)
    }
}