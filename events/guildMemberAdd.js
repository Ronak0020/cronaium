const { MessageEmbed } = require("discord.js");
const { Canvas, resolveImage } = require('canvas-constructor');
const request = require('node-superfetch');
const { shorten } = require("../utils/utils");
const { registerFont } = require('canvas');
registerFont("./assets/fonts/Lobster-Regular.ttf", { family: "lobster" });
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
            .setDescription(`Welcome to the server ${member.user}! Emjoy your stay in ${member.guild.name}!`)
        await channel.send(embed);
    } catch (error) {
        throw error;
    }
}
