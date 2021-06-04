module.exports = {
    name: "pause",
    description: "Makes the bot pause the music currently playing.",
    category: "Music",
    run: (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);
        if (!player) return message.channel.send("I am not playing any song in this server.");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel) return message.channel.send("You need to be in a voice channel to pause music.");

        if(player.paused) return message.reply("I have already paused the currently playing song. Use `resume` to resume the song.")
        player.pause(true);
        return message.channel.send(`Player is now paused. Use \`resume\` command to resume the song.`);
    }
}