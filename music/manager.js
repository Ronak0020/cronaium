const { MessageEmbed } = require("discord.js");
const { Manager } = require("erela.js");
const Util = require("../utils/utils");

module.exports = function (client) {
    return new Manager({
        nodes: [
            {
                host: "localhost",
                port: 2333,
                password: "123ronak",
            },
        ],
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    })
        .on("nodeConnect", (node) =>
            console.log(`Node ${node.options.identifier} connected`)
        )
        .on("nodeError", (node, error) =>
            console.log(
                `Node ${node.options.identifier} had an error: ${error.message}`
            )
        )
        .on("trackStart", (player, track) => {
            const { title, author, duration, thumbnail, uri } = track;
            const embed = new MessageEmbed()
            .setTitle(`🎶 Now Playing : ${title} - ${Util.formatTime(duration)}`)
            .setURL(uri)
            .setColor("YELLOW")
            .setThumbnail(thumbnail)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`**Song By :** ${author}\n**Requested By :** ${player.queue.current.requester.username}`)
            client.channels.cache
                .get(player.textChannel)
                .send(embed);
        })
        .on("queueEnd", (player) => {
            client.channels.cache.get(player.textChannel).send("The song queue has been ended. I will leave the voice channel now.");
            player.destroy();
        });
};