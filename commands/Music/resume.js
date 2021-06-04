module.exports = {
    name: "resume",
    description: "Makes the bot resume the music currently playing.",
    category: "Music",
    run: (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);
        if (!player) return message.channel.send("I am not playing any song in this server.");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel) return message.channel.send("You need to be in a voice channel to resume music.");

        if(!player.paused) return message.reply("I have already resumed the currently playing song. Use `pause` to pause the song.")
        player.pause(false);
        return message.channel.send(`Player is now resumed. Use \`pause\` command to pause the song.`);
    }
}