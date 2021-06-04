const Utils = require("../../utils/utils");
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    description: "Displays what the bot is currently playing.",
    category: "Music",
    run: async (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);
        if (!player || !player.queue.current) return message.channel.send("I am not playing any songs in this server right now.");
        if(!message.member.voice.channel || message.member.voice.channel.id !== player.voiceChannel) return message.reply("You need to be in a voice channel to run the music commands.")

        const { title, author, duration, thumbnail } = player.queue.current;

        const embed = new MessageEmbed()
            .setAuthor("Current Song Playing.", message.author.displayAvatarURL())
            .setThumbnail(thumbnail)
            .setColor("YELLOW")
            .setDescription(stripIndents`
            ${player.playing ? "▶️" : "⏸️"} **${title}** \`${Utils.formatTime(duration)}\` by ${author}
            `);
        return message.channel.send(embed);
    }
}