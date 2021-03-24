const { Canvas, resolveImage } = require('canvas-constructor');
const request = require('node-superfetch');
const { shorten } = require("../../utils/utils");
const { registerFont } = require('canvas');
registerFont("./assets/fonts/Pineapple Grass.ttf", { family: "pine" });
const User = require("../../models/user");
const options = ["about", "title", "color", "background"];
const ishex = require("is-hexcolor");

module.exports = {
    name: "profile",
    aliases: ["pf"],
    usage: "[@user | userID | set <about | title | color | wallpaper>]",
    category: "Social",
    description: "View your or a user's profile or change your profile details!",
    cooldown: 10,
    example: "profile @marley#1218 | profile set about I am just a cool person and marley is the best person.",
    run: async (client, message, args) => {
        let whoto = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        let username = shorten(whoto.username, 12);
        let user = await User.findOne({ userID: whoto.id }).catch(e => console.log(e));
        if (!user) {
            const newUser = new User({ userID: whoto.id, userName: whoto.username });
            await newUser.save().catch(e => console.log(e));
            message.reply("The user hs just been added to database. Please re-use the command to check their profile.")
        }
        const profilecard = async (person) => {
            const main = await resolveImage('./assets/images/profilecardmain.png');
            const plate = await resolveImage(`./assets/images/profile-backgrounds/${user.profileBackground}.jpg`);
            const { body } = await request.get(person);
            const avatar = await resolveImage(body);
            const profilecard = new Canvas(1980, 1200)
                .printImage(plate, 0, 0, 1980, 1200)
                .setGlobalAlpha(0.8)
                .printImage(main, 0, 0, 1980, 1200)
                .setGlobalAlpha(1.0)
                .setColor(user.profileColor)
                .setTextFont('180px pine')
                .printText(username, 560, 175)
                .setTextFont('120px pine')
                .printText(user.profileTitle, 545, 365)
                .setTextFont('90px pine')
                .printText(`#${whoto.discriminator}`, username.split("").length * 85 + 550, 180)
                .setTextFont('60px pine')
                .printWrappedText(user.profileAbout, 69, 600, 921)
                .setTextFont('75px pine')
                .printText(`${user.married ? `💝 ${client.users.cache.get(user.marriedTo.userID).tag || user.marriedTo.userName}` : "💔 Not married yet"}`, 1164, 541)
                .printText(`🎀 Reputation: ${user.reputation}`, 1164, 663)
                .printText(`💳 Spirits: ${user.coins} | ${user.gems}`, 1164, 775)
                .printText(`🏆 Achievements: ${user.achievements.length}`, 1164, 893)
                .printCircularImage(avatar, 280, 220, 174);
            return profilecard.toBuffer();
        };
        if (!args[0] || args[0].toLowerCase() !== "set") {
            try {
                const person = whoto.avatarURL({ format: "png" });
                const result = await profilecard(person);
                await message.channel.send({ files: [{ attachment: result, name: 'userprofile.png' }] });
            } catch (error) {
                throw error;
            }
        } else if (args[0] && args[0].toLowerCase() === "set") {
            if (!options.includes(args[1])) return message.reply(`Uhm... What exactly you want to update in your profile? Please choose from the below options~\n${options.map(o => `\`${o}\``).join("\n")}`)
            switch (args[1]) {
                case "about":
                    if (!args[2]) return message.reply("Uhm... I don't know about you ;-; I can not write about you on my own... You need to also tell me what you want to set as your `About` with the command.");
                    if (args[2].length > 300) return message.reply("That's way too long information! How about keeping it a little short? Characters limit -> 300 max");
                    user.profileAbout = args.slice(2).join(" ");
                    await user.save().catch(e => console.log(e));
                    try {
                        const person = whoto.avatarURL({ format: "png" });
                        const result = await profilecard(person);
                        await message.channel.send({ files: [{ attachment: result, name: 'userprofile.png' }] });
                    } catch (error) {
                        throw error;
                    }
                    break;
                case "title":
                    if (!args[2]) return message.reply("Uhm... I don't know about you ;-; I can not write a title for you on my own... You need to also tell me what you want to set as your `Title` with the command.");
                    if (args[2].length > 25) return message.reply("That's way too long information! How about keeping it a little short? Characters limit -> 25 max");
                    user.profileTitle = args.slice(2).join(" ");
                    await user.save().catch(e => console.log(e));
                    try {
                        const person = whoto.avatarURL({ format: "png" });
                        const result = await profilecard(person);
                        await message.channel.send({ files: [{ attachment: result, name: 'userprofile.png' }] });
                    } catch (error) {
                        throw error;
                    }
                    break;
                case "color":
                    if (!args[2] || !ishex(args[2])) return message.reply(`Uh oh! This is not a valid hex color code or maybe you didn't provide any? You can get some hex color codes from https://htmlcolorcodes.com !`);
                    user.profileColor = args[2];
                    await user.save().catch(e => console.log(e));
                    try {
                        const person = whoto.avatarURL({ format: "png" });
                        const result = await profilecard(person);
                        await message.channel.send({ files: [{ attachment: result, name: 'userprofile.png' }] });
                    } catch (error) {
                        throw error;
                    }
                    break;
                case "background":
                    if (!args[2] || !user.inventory.includes(args[2])) return message.reply(`Uh oh! Seems like you do not have profile background with that ID!`);
                    user.profileBackground = args[2];
                    await user.save().catch(e => console.log(e));
                    try {
                        const person = whoto.avatarURL({ format: "png" });
                        const result = await profilecard(person);
                        await message.channel.send({ files: [{ attachment: result, name: 'userprofile.png' }] });
                    } catch (error) {
                        throw error;
                    }
                    break;
            }
        }
    }
}