const { MessageEmbed } = require("discord.js");

const levels = {
    "none": 0.0,
    "low": 0.20,
    "medium": 0.30,
    "high": 0.35,
};

module.exports = {
    name: "bassboost",
    category: "Music",
    aliases: ["bb"],
    description: "Boost the bass of the songs",
    usage: "<level>",
    example: "bassboost high",
    run: async (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);

        if (!player || !player.queue.current) return message.channel.send("I am not playing any songs in this server right now.");

        const { channel } = message.member.voice;

        if (!channel) return message.reply("Uh oh! Sorry but you need to be in a voice channel to be able to use this command.");
        if (channel.id !== player.voiceChannel) return message.reply("You're not in the same voice channel as me!.");

        if (!args[0]) return message.channel.send("You need to provide a bassboost level. Available Levels are, `none`, `low`, `medium`, `high`.");

        let level = "none";
        if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();

        player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

        return message.channel.send(new MessageEmbed().setDescription(`Bass Boost level has been successfully set to **${level}**!`).setColor("GREEN"));
    }
}