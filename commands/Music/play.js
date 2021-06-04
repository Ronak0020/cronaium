const Utils = require("../../utils/utils.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "play",
    description: "Play a song/playlist or search for a song from youtube",
    usage: "<input>",
    category: "music",
    aliases: ["p", "pplay"],
    run: async (client, message, args) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music.");

        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!");
        if (!permissions.has("SPEAK")) return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!");

        if (!args[0]) return message.channel.send("Please provide a song name or link to search.");

        const player = client.musicManager.create({
            guild: message.guild.id,
            textChannel: message.channel.id,
            voiceChannel: voiceChannel.id
        });

        client.musicManager.search(args.join(" "), message.author).then(async res => {
            switch (res.loadType) {
                case "TRACK_LOADED":
                    if (!message.guild.members.cache.get(client.user.id).voice.channel || message.guild.members.cache.get(client.user.id).voice.channel.id !== player.voiceChannel) player.connect(); player.queue.add(res.tracks[0]);
                    message.channel.send(`Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``);
                    if (!player.playing && !player.paused && !player.queue.size) player.play();
                    break;

                case "SEARCH_RESULT":
                    let index = 1;
                    const tracks = res.tracks.slice(0, 10);
                    const embed = new MessageEmbed()
                        .setAuthor("Song Selection", message.author.displayAvatarURL())
                        .setColor("#c67faa")
                        .setDescription(tracks.map(video => `\`${index++}\` - ${video.title} (\`${Utils.formatTime(video.duration)}\`)`).join("\n") + `\n\nReply with the song number to add it to the queue.`)
                        .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");

                    await message.channel.send(embed);

                    const collector = message.channel.createMessageCollector(m => {
                        return m.author.id === message.author.id && new RegExp(`^([1-9]|10|cancel)$`, "i").test(m.content)
                    }, { time: 30000, max: 1 });

                    collector.on("collect", m => {
                        if (/cancel/i.test(m.content)) return collector.stop("cancelled")

                        const track = tracks[Number(m.content) - 1];
                        if (!message.guild.members.cache.get(client.user.id).voice.channel || message.guild.members.cache.get(client.user.id).voice.channel.id !== player.voiceChannel) player.connect();
                        player.queue.add(track)
                        message.channel.send(`Enqueuing \`${track.title}\` \`${Utils.formatTime(track.duration)}\``);
                        if (!player.playing && !player.paused && !player.queue.size) player.play();
                    });

                    collector.on("end", (_, reason) => {
                        if (["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled selection.")
                    });
                    break;

                case "PLAYLIST_LOADED":
                    if (!message.guild.members.cache.get(client.user.id).voice.channel || message.guild.members.cache.get(client.user.id).voice.channel.id !== player.voiceChannel) player.connect();
                    res.tracks.forEach(track => player.queue.add(track));
                    const duration = Utils.formatTime(res.playlist.duration);
                    message.channel.send(`Enqueuing \`${res.tracks.length}\` \`${duration}\` tracks in playlist \`${res.playlist.name}\``);
                    if (!player.playing && !player.paused && player.queue.size + 1 === res.tracks.length) player.play();
                    break;

                case "LOAD_FAILED":
                    player.destroy();
                    message.channel.send("Uh oh! Seems like an error occured. Please try again later!")
                    break;

                case "NO_MATCHES":
                    message.reply("No results found for the provided song name/url. Please try searching for another song.");
                    player.destroy();
                    break;
            }
        }).catch(err => message.channel.send(err.message))
    }
}