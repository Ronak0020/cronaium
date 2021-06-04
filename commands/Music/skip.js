module.exports = {
    name: "skip",
    aliases: ["next"],
    description: "Skips the song currently playing.",
    category: "Music",
    cooldown: 5,
    run: (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);
        if (!player) return message.channel.send("No song/s currently playing in this guild.");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel) return message.channel.send("You need to be in a voice channel to use the skip command.");

        player.stop();
        return message.channel.send("Skipped the current song!");
    }
}