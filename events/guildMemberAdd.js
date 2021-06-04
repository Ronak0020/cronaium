const { MessageEmbed } = require("discord.js");
const { replaceWelcomeMessage } = require("../utils/utils");
const Server = require("../models/server");

module.exports = async (client, member) => {
    console.log(member.guild);
    let server = await Server.findOne({ serverID: member.guild.id }).catch(e => console.log(e));
    if (!server) {
        const newServer = new Server({ serverID: member.guild.id })
        await newServer.save().catch(e => console.log(e));
    }
    if (member.user.bot) return;
    let channel;

    if (server.welcomeModule) {
        channel = member.guild.channels.cache.get(server.welcomeChannel);
    }
    if (!channel || channel === undefined) return;
    try {
        const embed = new MessageEmbed()
            .setTitle("A new user joined!")
            .setColor("#e7c65a")
            .setDescription(replaceWelcomeMessage(server.welcomeMessage, member))
        await channel.send(embed);
    } catch (error) {
        throw error;
    }
}
