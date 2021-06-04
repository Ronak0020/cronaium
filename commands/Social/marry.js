const Discord = require("discord.js");
const User = require("../../models/user");
const utils = require("../../utils/utils");
const moment = require("moment");
const ms = require("ms");

module.exports = {
    name: "marry",
    description: "Send a marry request to a user. Let's see if they accept you or not :3 It is an in-game marriage!",
    category: "Social",
    cooldown: 10,
    usage: "<@user | userID>",
    example: "marry @Rem#8948",
    info: "Using this bot, you can marry people who are not even in the same server. But they must be in a server where this bot is available so bot can fetch their data and can also DM them.",
    run: async(client, message, args) => {
        const embed = new Discord.MessageEmbed()
        .setTitle("Marry Request~")
        .setColor("#e00c68")
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();
        let object;
        const msg = args.slice(1).join(" ") || "I wanna marry you.";

        const sender = await User.findOne({userID: message.author.id}).catch(e => console.log(e));
        if(!sender) {
            const newUser = new User({userID: message.author.id, userName: message.author.username});
            await newUser.save().catch(e => console.log(e));
            message.reply("You were not in bot's database. Your profile has just been created. Re-use the command to make it work.");
        }
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.tag === args[0]);
        if(!args[0] && !sender.married) message.channel.send(embed.setDescription(`Sorry to say but the user whom you are trying to ask for marry is either not existing or is not in any server where I am or You did not mention them?\nPlease try again and provide a valid mention/id/username + tag.\nWISH YOU LUCK!`));
        if(!args[0] && sender.married) {
            embed.setTitle("Marriage Status~")
            embed.setDescription(`**${message.author.username}**, You are happily married to **${client.users.cache.get(sender.marriedTo.userID).tag || sender.marriedTo.userName}** !!\n**Married For :** ${ms(Date.now() - sender.marriedTo.date, {long: true})}\nYou both are awesome!!!`);
            message.channel.send(embed)
        }
        let receiver;
        if(message.mentions.users.size > 0) receiver = await User.findOne({userID: user.id}).catch(e => console.log(e));
        if(!receiver) {
            const newUser = new User({userID: user.id, userName: user.username});
            await newUser.save().catch(e => console.log(e));
            message.reply("The user was not in bot's database. Their profile has just been created. Re-use the command to make it work.");
        }

        if(sender.married) return message.channel.send(embed.setDescription(`You are already married to **${sender.marriedTo.userName}** since **${moment(sender.marriedTo.date).format("LT")}**\nYou need to divorce them before you can marry someone else.`));
        if(receiver.married) return message.channel.send(embed.setDescription(`I am sorry to say but the person you are trying to marry is already married to **${receiver.marriedTo.userName}**. They can not marry anyone till they divorce them first.`));
        
        let alreadySent = receiver.requests.findIndex(e => e.userID === message.author.id);
        if(alreadySent > -1) return message.reply(`Seems like you have already sent a request to this user. Wait to receive response for your request. I wish you luck!`);
        let code = utils.makeid(6);

        message.channel.send(embed.setDescription(`Are you sure you want to send a marry proposal to ${user}?\nSay \`yes\` or \`no\` withing **30 seconds**`));
        let verification = await utils.verify(message.channel, message.author);
        if(!verification) return message.reply("The proposal has been cancelled.");
        if(verification) {
            message.channel.send(`:white_check_mark: Request sent!`);

            await message.author.send(embed.setDescription(`**You sent a marry request!!!**
**To User :** ${user.tag} (${user.id})
**Request ID :** ${code}
**Message :** ${msg}
**Date :** ${moment(message.createdTimestamp).format("LT LL")}
            
            I will DM you if they accept your request. Wish you best of luck!!!`));

            await user.send(embed.setDescription(`**You got a marry request!!!**
**From User :** ${message.author.tag} (${message.author.id})
**Request ID :** ${code}
**Message :** ${msg}
**Date :** ${moment(message.createdTimestamp).format("LT LL")}
            
            If you accept this proposal, type \`c.acceptrequest ${code}\` in any server where I am available.`));

            object = {
                "requestCode": code,
                "fromUser": message.author.tag,
                "userID": message.author.id,
                "date": message.createdTimestamp,
                "message": msg,
                "type": "marry"
            };
            receiver.requests.push(object);
            await receiver.save().catch(e => conole.log(e));
        }
    }
}