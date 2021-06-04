const Discord = require("discord.js");
const { Canvas, resolveImage } = require('canvas-constructor');
const request = require('node-superfetch');
const { shorten } = require("../../utils/utils");
const { registerFont } = require('canvas');
registerFont("./assets/fonts/Pineapple Grass.ttf", { family: "pine" });

module.exports = {
    name: "ship",
    category: "Fun",
    cooldown: 5,
    description: "Shio 2 users and check thier compatibility level :3",
    usage: "<@user1> [@user2]",
    example: "ship @Rem#8948 @marley#1218",
    run: async (client, message, args) => {
        const shipped = message.mentions.members.size === 2 ? message.mentions.members.array()[1] : message.member;
        const shipper = message.mentions.members.size === 1 || message.mentions.members.size === 2 ? message.mentions.members.array()[0] : message.member;
        const first_length = Math.round(shipper.displayName.length / 2);
        const first_half = shipper.displayName.slice(0, first_length);
        const second_length = Math.round(shipped.displayName.length / 2);
        const second_half = shipped.displayName.slice(second_length);
        const final_name = first_half + second_half;
        const score = Math.random() * (0, 100);
        const prog_bar = Math.ceil(Math.round(score) / 100 * 10);
        const counter = "💝".repeat(prog_bar) + "💔".repeat(10 - prog_bar);
        const m = await message.channel.send('*Please Wait... Generating the results...*');

        const shipcard = async (person, person2) => {
            const main = await resolveImage('./assets/images/ship.png');
            const personn = await request.get(person);
            const avatar = await resolveImage(personn.body);
            const personn2 = await request.get(person2);
            const avatar2 = await resolveImage(personn2.body);
            const card = new Canvas(728, 409)
                .printImage(main, 0, 0, 728, 409)
                .setColor("#FD2C67")
                .setTextFont('32px pine')
                .printText(shorten(shipper.user.tag, 14), 15, 293)
                .printText(shorten(shipped.user.tag, 14), 485, 293)
                .printText(`#${final_name}`, 231, 45)
                .setTextFont('36px pine')
                .printText(`${Math.floor(score)}%`, 35, 390)
                .printText(`${counter}`, 160, 390)
                .printCircularImage(avatar, 144, 145, 103)
                .printCircularImage(avatar2, 614, 140, 103);
            return card.toBuffer();
        };
        try {
            const person = shipper.user.avatarURL({ format: "png" });
            const person2 = shipped.user.avatarURL({ format: "png" });
            const result = await shipcard(person, person2);
            await message.channel.send({ files: [{ attachment: result, name: 'usership.png' }] });
        } catch (error) {
            console.log(error);
        }
    }
}