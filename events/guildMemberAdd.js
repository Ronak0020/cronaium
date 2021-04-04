const {MessageEmbed} = require("discord.js");
const { Canvas, resolveImage } = require('canvas-constructor');
const request = require('node-superfetch');
const { shorten } = require("../utils/utils");
const { registerFont } = require('canvas');
registerFont("./assets/fonts/Lobster-Regular.ttf", { family: "lobster" });
const Server = require("../models/server");

module.exports = async (member) => {
    let server = await Server.findOne({serverID: member.guild.id}).catch(e => console.log(e));
    if(!server) {
        const newServer = new Server({serverID: member.guild.id})
        await newServer.save().catch(e => console.log(e));
    }
    if(member.user.bot) return;

    const profilecard = async (person) => {
        const plate = await resolveImage(`./assets/images/welcome-backgrounds/201.jpg`);
        const { body } = await request.get(person);
        const avatar = await resolveImage(body);
        const profilecard = new Canvas(1500, 500)
            .printImage(main, 0, 0, 1500, 500)
            .setColor("#ffffff")
            .setTextFont('120px lobster')
            .printText(username, 217, 244)
            .setTextFont('180px lobster')
            .printText(`Welcome to ${member.guild.name}!`, 69, 100)
            .setTextFont('90px lobster')
            .printText(`You are the ${member.guild.members.cache.size}th Member!`, 154, 427)
            .printCircularImage(avatar, 1248, 253, 214);
        return profilecard.toBuffer();
    };
}