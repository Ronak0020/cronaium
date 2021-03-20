const Discord = require("discord.js");
const User = require("../../models/user");
const utils = require("../../utils/utils");
const moment = require("moment");

module.exports = {
    name: "viewrequests",
    category: "Social",
    description: "Shows all the requests you have pending. Friend and marry requests together.",
    cooldown: 10,
    aliases: ["requests"],
    usage: "[requestID]",
    example: "viewrequest ik9lk4",
    info: "You can use filters to check for either friend requests or marry requests only by adding `-friend` or `-marry` at last. (COMING SOON)",
    run: async(client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setTitle("Pending Requests~")
            .setColor("#e00c68")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        let user = await User.findOne({userID: message.author.id}).catch(e => console.log(e));
        if(!user) {
            const newUser = new User({userID: message.author.id, userName: message.author.username});
            await newUser.save().catch(e => console.log(e));
            message.reply("Your profile has just been created. You have no requests atm.");
        }

        let requests = [];
        for(i=0; i < user.requests.length; i++) {
            requests.push(`\`${user.requests[i].requestCode}\` -> **${user.requests[i].type.toUpperCase()}** -> **${client.users.cache.get(user.requests[i].userID) || user.requests.userName}**`);
        }
        if(user.requests.length < 1) { requests.push("You have no requests right now. Its empty!"); }

        if(args[0]) {
            let index = user.requests.findIndex(e => e.requestCode === args[0]);
            if(index < 0) return message.channel.send(embed.setDescription(`No request was found with the provided code!`));
            embed.setDescription(`**From User :** ${user.requests[index].fromUser} (${user.requests[index].userID})
**Request ID :** ${user.requests[index].requestCode}
**Message :** ${user.requests[index].message}
**Date :** ${moment(user.requests[index].date).format("LT LL")}`);
            embed.setTitle(`Request Type - ${user.requests[index].type}`);
            return message.channel.send(embed)
        }

        let options = {
            AUTHOR: `Pending Requests~`,
            COLOR: "#e00c68",
            FOOTER: `${client.user.username}`,
            FOOTERIMAGE: `${client.user.displayAvatarURL()}`
        }

        if(user.requests.length < 10) {
            embed.setDescription(requests.join("\n"));
            message.channel.send(embed);
        } else if(user.requests.length > 10) {
            utils.createEmbedPage(requests, message, 10, "requests", options);
        }
    }
}