const Discord = require("discord.js");
const ms = require("ms");
const currentGame = new Discord.Collection();

module.exports = {
    name: "numberguess",
    aliases: ["guessthenumber", "numguess", "guessnum"],
    description: "Play guess the number game with as much people as you want!",
    category: "Games",
    cooldown: 10,
    run: async (client, message, args) => {
        const game = currentGame.get(message.guild.id);
        if (game) {
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setDescription("A game has already started in another channel. You can not play this game in two different channels together.")
                .setColor("#CAF98D")
                .setFooter(client.user.username, client.user.displayAvatarURL)
            return message.channel.send(embed);
        }

        let participants = [],
            number = Math.floor(Math.random() * 9999) + 1;

        message.channel.send(`Number determined, you can start to guess the number now!`);

        let createdAt = Date.now();

        const embed = new Discord.RichEmbed();
        embed.setTitle("Game Finished!");
        embed.setColor("#FFFF00");
        embed.setFooter(client.user.username, client.user.displayAvatarURL);
        embed.setTimestamp();

        let collector = new Discord.MessageCollector(message.channel, (m) => !m.author.bot, {
            time: 480000
        });
        currentGame.set(message.guild.id, message.channel.id);

        collector.on("collect", async (msg) => {

            if (!participants.includes(msg.author.id)) {
                participants.push(msg.author.id);
            }
            if (isNaN(msg.content)) {
                return;
            }

            if (parseInt(msg.content) === number) {
                const won = Math.floor(Math.random() * 39) + 1;
                let time = ms(Date.now() - createdAt);
                message.channel.send(embed.setDescription(`:tada: | ${msg.author} found the number! It was __**${number}**__ !\n\n\n**States of the game: **\n__**Time**__: ${time}\n__** Number of participants**__ : ${participants.length}\n__**Participants**__ : \n${participants.map((p) => "<@" + p + ">").join("\n")}`));
                collector.stop(msg.author.username);
            }
            if (parseInt(msg.content) < number) {
                message.channel.send(`${msg.author} | The number is **larger** than \`${msg.content}\` !`);
            }
            if (parseInt(msg.content) > number) {
                message.channel.send(`${msg.author} | The number is **smaller** than \`${msg.content}\` !`);
            }

        });

        collector.on("end", (collected, reason) => {
            currentGame.delete(message.guild.id);
            if (reason === "time") {
                return message.channel.send(`Time is over! No one could find the number! It was ${number} !`);
            }
        });
    }
}