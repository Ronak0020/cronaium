const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const serverUser = require("../../models/serverUser");
const { promptMessage } = require("../../utils/utils.js");

module.exports = {
    name: "ban",
    category: "Moderation",
    description: "Ban a member from the server",
    usage: "<id | mention> [reason]",
    example: "ban @Rem warned you before!",
    permission: "BAN_MEMBERS",
    cooldown: 10,
    info: "You can not ban a member with `ADMINISTRATOR` permission. Please make sure that the bot role is above the members role in order to be able to ban them.",
    run: async (client, message, args) => {
        const logChannel = message.channel;

        if (message.deletable) message.delete();
        if (!args[0]) {
            return message.reply("No member was provided to ban. Please provide a user tag | user ID to ban.")
                .then(m => m.delete({ timeout: 10000 }));
        }
        var reason = args.slice(1).join(" ");
        if (!reason) reason = "No reason provided.";

        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({ timeout: 10000 }));
        }

        const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!toBan) {
            return message.reply("Did you provide me the correct user ID/user tag? I dont think so! Please re-check.")
                .then(m => m.delete({ timeout: 10000 }));
        }

        if (toBan.id === message.author.id) {
            return message.reply("I won't allow you to ban yourself!")
                .then(m => m.delete(10000));
        }
        if (toBan.permissions.has(["ADMINISTRATOR"])) return message.reply("You can not ban an Admin.").then(m => m.delete({ timeout: 10000 }));
        if (!toBan.bannable) {
            return message.reply("I can't ban that person due to either my role is not high enough or the member is an Admin.")
                .then(m => m.delete({ timeout: 10000 }));
        }

        let user = await serverUser.findOne({
            userID: toBan.id,
            serverID: message.guild.id
        }).catch(e => console.log(e));
        if (!user) {
            const newserverUser = new serverUser({
                serverID: message.guild.id,
                userID: toBan.id
            })
            await newserverUser.save().catch(e => console.log(e));
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(stripIndents`**- Banned member:** ${toBan} (${toBan.id})
            **- Banned by:** ${message.member} (${message.member.id})
            **- Reason:** ${reason}`);

        toBan.createDM()
            .then(DMChannel => {
                DMChannel.send(`You were banned from server __${message.guild.name}__ \n **REASON :-**\n ${reason}`)
                    .then(() => {
                        toBan.ban({reason: reason});
                        user.banCount += 1;
                        user.save().catch(e => console.log(e));
                    })
            })

        logChannel.send(embed);
    }
}