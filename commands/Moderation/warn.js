const Discord = require('discord.js');
const moment = require("moment");
const Warn = require("../../models/serverUser");

module.exports = {
    name: 'warn',
    usage: "<@member> <reason>",
    category: "Moderation",
    description: "Warn a member for breaking rules!",
    cooldown: 5,
    example: "warn @Ronak swearing is not a good thing!",
    permission: "MANAGE_MESSAGES",
    run: async (client, message, args) => {
        const created = moment(message.createdTimestamp).format('LT') + ", " + moment(message.createdTimestamp).format('LL')
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (target.permissions.has(["ADMINISTRATOR"])) return message.reply("You can not warn an Admin. This person seems to be an Admin of this server.").then(m => m.delete({ timeout: 10000 }));
        if (!target) return message.reply("Whom you wanna warn? Please mention the user.").then(m => m.delete({ timeout: 10000 }));
        const reason = args.slice(1).join(" ");
        if (!reason) return message.reply("Please provide a reason to warn!").then(m => m.delete({ timeout: 10000 }));
        Warn.findOne({
            serverID: message.guild.id,
            userID: target.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (!user) {
                const newWarn = new Warn({
                    serverID: message.guild.id,
                    userID: target.id
                })
                await newWarn.save().catch(e => console.log(e));
                newWarn.warnMod.push(message.author.tag);
                newWarn.warnReason.push(reason + ` (${created})`);
                await newWarn.save().catch(e => console.log(e));
            } else if (user) {
                user.warnReason.push(reason + ` (${created})`)
                user.warnMod.push(message.author.tag)
                await user.save().catch(e => console.log(e));
            }
            const embed = new Discord.MessageEmbed()
                .setColor("RED")
                .setFooter(client.user.username, client.user.displayAvatarURL());
            target.send(embed.setTitle("⚠ You have been warned! ⚠").setDescription(`**Server -** ${message.guild.name}\n**Moderator -** ${message.author.username}\n**Reason -** ${reason}\n**Date -** ${created}`));
            message.channel.send(embed.setTitle("⚠ User has been warned! ⚠").setDescription(`**User -** ${target.displayName}\n**Moderator -** ${message.author.username}\n**Reason -** ${reason}\n**Date -** ${created}`))
        })
    }
}