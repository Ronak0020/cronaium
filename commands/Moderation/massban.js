const Discord = require("discord.js");
const serverUser = require("../../models/serverUser");
const { promptMessage } = require("../../utils/utils")

module.exports = {
    name: "massban",
    aliases: ["mban"],
    description: "Ban multiple people together using their ID/Mentions.",
    usage: "<User1> | <user2> | <user3> | and more...",
    example: "massban 668925478569656914 | 736903852212748358",
    cooldown: 30,
    category: "Moderation",
    permission: "BAN_MEMBERS",
    info: "You can also use this command with MENTIONING users you want to ban. While mentioning, you do not need to add `|`. For eg: massban @Rem @marley @Someone",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();
        if (!args[0]) {
            return message.reply("Please provide ID of members you want to ban.")
                .then(m => m.delete({ timeout: 10000 }));
        }
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({ timeout: 10000 }));
        }
        const toBan = message.mentions.members.map(e => e.user.id) || args.join(" ").split("|");
        if(toBan.length > 10) return message.reply("Sorry but you can ban ONLY 10 USERS at once.");

        let users = [];
        let noBan = [];
        let admin = [];

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setFooter(client.user.username, client.user.displayAvatarURL());

        toBan.forEach(async (r) => {
            const u = message.guild.members.cache.get(r);
            if (!u) noBan.push(r);
            if (u.permissions.has("ADMINISTRATOR")) admin.push(u);
            if(!admin.includes(u)) users.push(u);
        })
        promptEmbed.setDescription(`Are you sure you want to ban all of the people you provided IDs of?\n**This verification will become invalid in 30 seconds.**\n**USERS YOU MENTIONED:**\n${message.mentions.members.size > 0 ? message.mentions.members.map(m => m).join(" `|` ") : args.join(" ").split("|").join(" `|` ")}`)

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();
                users.forEach(u => {
                    setTimeout(async () => {
                        let user = await serverUser.findOne({
                            userID: u.id,
                            serverID: message.guild.id
                        }).catch(e => console.log(e));
                        if (!user) {
                            const newserverUser = new serverUser({
                                serverID: message.guild.id,
                                userID: u.id,
                                banCount: 1
                            })
                            await newserverUser.save().catch(e => console.log(e));
                            u.ban({reason: "Mass ban"});
                        }
                        user.banCount += 1;
                        await user.save().catch(e => console.log(e));
                        u.ban({reason: "Mass ban"});
                    }, 1000)
                })
                const embed = new Discord.MessageEmbed()
                    .setColor("#faf5cf")
                    .setTitle("Mass Ban Successfull!")
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(`BANNED USERS:\n${users.join("` | `")}\n\nFAILED TO BAN (no user found):\n${noBan.map(e => `${e}`).join(", ")}\n\nFAILED TO BAN (user Admin):\n${admin.join(", ")}`);
                message.channel.send(embed)
            } else if (emoji === "❌") {
                msg.delete();
                message.reply(`The ban command was cancelled. No members were banned.`)
                    .then(m => m.delete({ timeout: 10000 }));
            }
        });
    }
}