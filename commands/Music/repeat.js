const options = ["track", "queue"];

module.exports = {
    name: "loop",
    aliases: ["repeat"],
    description: "Set a track/queue on repeat.",
    category: "Music",
    usage: "[track | queue]",
    run: async (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);
        if (!player) return message.channel.send("I am not playing any song in this server.");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel) return message.channel.send("You need to be in a voice channel to adjust the volume.");

        let type = "track";
        if(args[0] && options.includes(args[0].toLowerCase())) type = args[0].toLowerCase();

        if(type === "track") {
            player.setTrackRepeat(player.trackRepeat ? false : true);
            message.channel.send(`The current track has been successfully ${player.trackRepeat ? "set to" : "removed from"} repeat.`);
        } else if(type === "queue") {
            player.setQueueRepeat(player.queueRepeat ? false : true);
            message.channel.send(`The current queue has been successfully ${player.queueRepeat ? "set to" : "removed from"} repeat.`);
        }
    }
}