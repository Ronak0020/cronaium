const Discord = require("discord.js");
const User = require("../../models/user");
const utils = require("../../utils/utils");
const moment = require("moment");

module.exports = {
    name: "acceptrequest",
    category: "Social",
    cooldown: 5,
    aliases: ["acceptreq", "accept"],
    description: "Accept a pending friend request or marry request.",
    usage: "<request ID>",
    example: "acceptrequest o0f5Fr",
    run: async(client, message, args) => {

        const embed = new Discord.MessageEmbed()
        .setTitle("Accept Request~")
        .setColor("#e00c68")
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

        const code = args[0];
        User.findOne({
            userID: message.author.id
        }, async(err, user) => {
            if(err) console.log(err);
            if(!user) {
                const newUser = new User({userID: message.author.id, userName: message.author.username});
                await newUser.save().catch(e => console.log(e));
                message.reply("Your profile has just been created. You have no requests atm.");
            }
            let index = user.requests.findIndex(e => e.requestCode === code);
            if(index === -1) return message.reply(`Found no request with ID \`${code}\`! Please re-check the code.`);

            const sender = await User.findOne({userID: user.requests[index].userID}).catch(e => console.log(e));

            if(user.requests[index].type === "marry" && user.married) return message.reply(`You are already married. Please divorce first before accepting another marry request.`);
            if(user.requests[index].type === "marry" && sender.married) return message.reply(`The user is already married. They need to divorce first before accepting another marry request.`);
            message.channel.send(embed.setDescription(`Are you sure you want to accept this marry request?
**From User :** ${user.requests[index].fromUser} (${user.requests[index].userID})
**Request ID :** ${user.requests[index].requestCode}
**Message :** ${user.requests[index].message}
**Date :** ${moment(user.requests[index].date).format("LT LL")}
Say \`yes\` or \`no\` withing **30 seconds**`));

            let validate = await utils.verify(message.channel, message.author);
            if(!validate) return message.reply("You cancelled accepting the request.");
            if(validate) {
                user.marriageHarem.push({
                    "user": user.requests[index].fromUser,
                    "userID": user.requests[index].userID,
                    "date": message.createdTimestamp,
                    "message": user.requests[index].message,
                    "type": "marry"
                });
                user.married = true;
                user.marriedTo = {
                    "user": user.requests[index].fromUser,
                    "userID": user.requests[index].userID,
                    "date": message.createdTimestamp,
                    "message": user.requests[index].message
                }
                await client.users.cache.get(user.requests[index].userID).send(embed.setDescription(`Your marry request has been accepted!
**To User :** ${message.author.tag} (${message.author.id})
**Request ID :** ${user.requests[index].requestCode}
**Message :** ${user.requests[index].message}
**Date :** ${moment(user.requests[index].date).format("LT LL")}
Wish you best of luck for future!! Congratulations!!`));

                sender.marriageHarem.push({
                    "user": message.author.tag,
                    "userID": message.author.id,
                    "date": message.createdTimestamp,
                    "message": user.requests[index].message,
                    "type": "marry"
                });
                sender.married = true;
                sender.marriedTo = {
                    "user": message.author.tag,
                    "userID": message.author.id,
                    "date": message.createdTimestamp,
                    "message": user.requests[index].message
                }
                user.requests.splice(index, 1);
                await sender.save().catch(e => console.log(e));
                await user.save().catch(e => console.log(e));
                message.channel.send(`Request successfully accepted! Congratulations!!`);
            }
        })
    }
}