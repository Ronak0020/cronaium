module.exports = {
    name: "volume",
    aliases: ["vol"],
    description: "Adjusts the volume of the bot.",
    category: "Music",
    usage: "<input>",
    run: async (client, message, args) => {
        const player = client.musicManager.players.get(message.guild.id);
        if (!player) return message.channel.send("I am not playing any song in this server.");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel) return message.channel.send("You need to be in a voice channel to adjust the volume.");

        if (!args[0]) return message.channel.send(`Current Volume: ${player.volume}`);
        if (Number(args[0]) <= 0 || Number(args[0]) > 100) return message.channel.send("You may only set the volume to 1-100");

        player.setVolume(Number(args[0]));
        return message.channel.send(`Successfully set the volume to: \`${args[0]}\``);
    }
}