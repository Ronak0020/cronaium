module.exports = {
    name: "stop",
    aliases: ["destroy"],
    description: "Stops the song currently playing and destroys the queue.",
    category: "Music",
    cooldown: 5,
    run: (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);
        if (!player) return message.channel.send("No song/s currently playing in this guild.");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel) return message.channel.send("You need to be in a voice channel to use the stop command.");

        player.destroy();
        return message.channel.send("Successfully stopped playing songs and cleared the queue.");
    }
}