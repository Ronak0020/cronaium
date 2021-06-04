const { MessageEmbed } = require("discord.js");
const Util = require("../../utils/utils");

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "Displays what the current queue is.",
    category: "Music",
    run: async (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);
        if (!player || !player.queue.current) return message.channel.send("I am not playing any song in this server.");

        const embed = new MessageEmbed()
            .setAuthor(`Current Queue for ${message.guild.name}`, message.guild.iconURL())
            .setThumbnail(player.queue.current.thumbnail)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setColor("YELLOW")
            .setAuthor(`🎶 Now Playing ${player.queue.current.title} (${Util.formatTime(player.queue.current.duration)}) - Requested by ${player.queue.current.requester.username}.\n\n`)
            .setTimestamp();

        let object = {
            AUTHOR: `Current Queue for ${message.guild.name}`,
            COLOR: "YELLOW",
            FOOTER: `${client.user.username}`,
            FOOTERIMAGE: `${client.user.displayAvatarURL()}`
        }

        let queueArray = [];

        if (player.queue.length === 1) return client.commands.get("nowplaying").run(client, message, args);
        if (player.queue.lenght <= 10) {
            message.channel.send(embed.setDescription(`__**Now Playing:**__\n${player.queue.current.title} (${Util.formatTime(player.queue.current.duration)}) - **Requested by ${player.queue.current.requester.username}**\n\n__**Rest of queue:**__\n ${player.queue.slice(1, 10).map(x => `**${index++})** ${x.title} (${Util.formatTime(x.duration)}) - **Requested by ${x.requester.username}**.`).join("\n")}`))
        } else if (player.queue.length > 10) {
            let index = 1;
            player.queue.forEach(x => {
                queueArray.push(`**${index++})** ${x.title} (${Util.formatTime(x.duration)}) - **Requested by ${x.requester.username}**.`)
            });
            Util.createEmbedPage(queueArray, message, 10, "queue", object, player);
        }
    }
}