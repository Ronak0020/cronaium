const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const serverUser = require("../../models/serverUser");
const { promptMessage } = require("../../utils/utils.js");

module.exports = {
    name: "kick",
    category: "Moderation",
    description: "Kick a member from the server",
    usage: "<id | mention> [reason]",
    example: "kick @Ronak warned you before!",
    permission: "KICK_MEMBERS",
    cooldown: 10,
    info: "You can not kick a member with `ADMINISTRATOR` permission. Please make sure that the bot role is above the members role in order to be able to kick them.",
    run: async (client, message, args) => {
        const logChannel = message.channel;

        if (message.deletable) message.delete();
        if (!args[0]) {
            return message.reply("No member was provided to kick. Please provide a user tag | user ID to kick.")
                .then(m => m.delete({ timeout: 10000 }));
        }
        var reason = args.slice(1).join(" ");
        if (!reason) reason = "No reason provided.";

        if (!message.guild.me.permissions.has("KICK_MEMBERS")) {
            return message.reply("❌ I do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete({ timeout: 10000 }));
        }

        const toKick = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!toKick) {
            return message.reply("Did you provide me the correct user ID/user tag? I dont think so! Please re-check.")
                .then(m => m.delete({ timeout: 10000 }));
        }

        if (toKick.id === message.author.id) {
            return message.reply("I won't allow you to kick yourself!")
                .then(m => m.delete(10000));
        }
        if (toKick.permissions.has(["ADMINISTRATOR"])) return message.reply("You can not kick an Admin.").then(m => m.delete({ timeout: 10000 }));
        if (!toKick.kicknable) {
            return message.reply("I can't kick that person due to either my role is not high enough or the member is an Admin.")
                .then(m => m.delete({ timeout: 10000 }));
        }

        let user = await serverUser.findOne({
            userID: toKick.id,
            serverID: message.guild.id
        }).catch(e => console.log(e));
        if (!user) {
            const newserverUser = new serverUser({
                serverID: message.guild.id,
                userID: toKick.id
            })
            await newserverUser.save().catch(e => console.log(e));
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(stripIndents`**- Kicked member:** ${toKick} (${toKick.id})
            **- Kicked by:** ${message.member} (${message.member.id})
            **- Reason:** ${reason}`);

        toKick.createDM()
            .then(DMChannel => {
                DMChannel.send(`You were kicked from server __${message.guild.name}__ \n **REASON :-**\n ${reason}`)
                    .then(() => {
                        toKick.kick({reason: reason});
                        user.kickCount += 1;
                        user.save().catch(e => console.log(e));
                    })
            })

        logChannel.send(embed);
    }
}