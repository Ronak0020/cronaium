const Discord = require('discord.js');
const serverUser = require("../../models/serverUser");
const ms = require("ms");

module.exports = {
    name: 'mute',
    description: "Mutes a member..",
    category: "Moderation",
    usage: "<@user> [time]",
    example: "mute @Rem 24h",
    cooldown: 5,
    run: async (client, message, args) => {
        if (!message.member.permissions.has(["MANAGE_MESSAGES"])) return message.reply("You do not have permission to use this command!").then(m => m.delete({ timeout: 10000 }));
        const toMute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!toMute) return message.reply("Please mention the user you want to mute!").then(m => m.delete({ timeout: 10000 }));
        let muterole = message.guild.roles.cache.find(r => r.name.toLowerCase() === "muted");
        if (toMute.roles.cache.has(muterole.id)) return message.reply("The user is already muted.").then(m => m.delete({ timeout: 10000 }));
        if (!muterole) {
            try {
                muterole = await message.guild.roles.create({
                    name: "Muted",
                    color: "#818386",
                    permissions: []
                })
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.updateOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        let mutetime = args[1];
        serverUser.findOne({
            userID: toMute.id,
            serverID: message.guild.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (!user) {
                const newUser = new serverUser({
                    serverID: message.guild.id,
                    userID: toMute.id
                })
                await newUser.save().catch(e => console.log(e));
            }
            if (!toMute.roles.cache.has(muterole.id) && mutetime) {

                await (toMute.roles.add(muterole.id));
                message.channel.send("User **" + toMute.displayName + "** has been successfully been muted for " + ms(ms(mutetime), { long: true }));
                user.muteCount += 1;
                user.mute = true;
                await user.save().catch(e => console.log(e));
                setTimeout(async () => {
                    if (toMute.roles.cache.has(muterole.id)) {
                        await (toMute.roles.remove(muterole.id))
                        message.channel.send(`<@${toMute.id}> has been unmuted!`);
                    }
                }, ms(mutetime));

            } else if (!toMute.roles.cache.has(muterole.id) && !mutetime) {

                toMute.roles.add(muterole.id);
                message.channel.send("User **" + toMute.displayName + "** has been successfully muted.");
                user.muteCount += 1;
                user.mute = true;
                await user.save().catch(e => console.log(e));
            }
        })

    }
}