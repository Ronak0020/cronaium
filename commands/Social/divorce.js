const Discord = require("discord.js");
const User = require("../../models/user");
const utils = require("../../utils/utils");
const ms = require("ms");

module.exports = {
    name: "divorce",
    category: "Social",
    cooldown: 5,
    description: "Divorce a person you are married to.",
    example: "divorce Sorry had to do that.",
    usage: "[reason]",
    run: async(client, message, args) => {

        const embed = new Discord.MessageEmbed()
        .setTitle("Accept Request~")
        .setColor("#e00c68")
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

        User.findOne({
            userID: message.author.id
        }, async(err, user) => {
            if(err) console.log(err);
            if(!user) {
                const newUser = new User({userID: message.author.id, userName: message.author.username});
                await newUser.save().catch(e => console.log(e));
                message.reply("Your profile has just been created. You are not married atm.");
            }

            if(!user.married) return message.reply(`You are not married. You need to be married first before divorcing lol.`);
            const sender = await User.findOne({userID: user.marriedTo.userID}).catch(e => console.log(e));
            message.channel.send(embed.setDescription(`Are you sure you want to divorce?
**User :** ${user.marriedTo.user} (${user.marriedTo.userID})
**Duration :** ${ms(Date.now() - user.marriedTo.date, {long: true})}
Say \`yes\` or \`no\` withing **30 seconds**`));

            const user2 = client.users.cache.get(user.marriedTo.userID);

            let validate = await utils.verify(message.channel, message.author);
            if(!validate) return message.reply("You cancelled divorcing.");
            if(validate) {
                user.married = false;
                user.marriedTo = {};
                await user2.send(embed.setDescription(`You have been divorced!
**User :** ${message.author.tag} (${message.author.id})
**Duration :** ${ms(Date.now() - sender.marriedTo.date, {long: true})}
**Message :** ${args.join(" ") || "No message given"}

I am very sorry to hear that~`));
                sender.married = false;
                sender.marriedTo = {};
                await sender.save().catch(e => console.log(e));
                await user.save().catch(e => console.log(e));
                message.channel.send(`You succesfully divorced.`);
            }
        })
    }
}