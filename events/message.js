const { Client, Collection, MessageEmbed } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const mongoose = require("mongoose");
const Server = require("../models/server");
const serverUser = require("../models/serverUser");
const Levels = require("../utils/levels.js");
const { replaceLevelMessage } = require("../utils/utils");
const cooldowns = new Collection();
const lvlcool = new Set();
const dbUrl = "mongodb+srv://Rem:123Rem@akira.vljml.mongodb.net/Cronaium?retryWrites=true&w=majority";
Levels.setURL(dbUrl);
const noAutoDelete = "932";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


module.exports = async (client, message) => {
    if (message.author.bot) return;
    Server.findOne({
        serverID: message.guild.id
    }, async (err, server) => {
        if (err) console.log(err);
        if (!server) {
            const newServer = new Server({
                serverID: message.guild.id,
                //serverOwner: message.guild.owner.user.username,
                blacklistedChannels: [],
                blacklistedCommands: []
            });
            await newServer.save().catch(e => console.log(e));
        }

        const prefix = server.prefix;

        //============================ LEVELS ============================
        if (server.levelModule && !message.content.toLowerCase().startsWith(prefix) && !server.blacklistedChannels.includes(message.channel.id)) {
            if (message.author.bot) return;
            const randomAmountOfXp = Math.floor(Math.random() * server.earnXp);
            const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
            if (hasLeveledUp) {
                const user = await Levels.fetch(message.author.id, message.guild.id);
                const chn = message.guild.channels.cache.get(server.levelUpMessageChannel);
                if (server.levelUpMessageRedirect) {
                    if (!server.levelUpMessageModule) return;
                    if (!chn) return message.guild.owner.send("Sorry to bother you but seems like there is a problem in **" + message.guild.name + "** regarding my settings. The level up message channel is set but the channel which is in my database can not be found. Please change the channel using `config setlevelupchannel <#channel | channelID>`");
                    chn.send(replaceLevelMessage(server.levelUpMessage, message.author, user));
                } else {
                    if (!server.levelUpMessageModule) return;
                    message.channel.send(replaceLevelMessage(server.levelUpMessage, message.author, user))
                }
            }
        }

        //============================== AFK ==================================
        const target = message.mentions.users.first() || message.author;
        serverUser.findOne({
            userID: target.id,
            serverID: message.guild.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (user) {
                if (user.AFK && user.userID !== message.author.id) {
                    message.reply(`**${target.username}** is currently AFK: ${user.AFKreason} --(**Went AFK:** ${ms(Date.now() - parseInt(user.AFKtime), { long: true })} ago)`)
                } else if (user.AFK && user.userID === message.author.id) {
                    user.AFK = false;
                    await user.save().catch(e => console.log(e));
                    message.reply(`Welcome back! I removed your AFK!`);
                }
            }
        })

        //============================== MAIN ==============================
        if (!message.guild) return;
        if (!message.content.toLowerCase().startsWith(prefix)) return;
        if (!message.member) message.member = await message.guild.members.fetch(message);

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (server.blacklistedCommands.includes(command.name)) return;
        if(!message.member.permissions.has(command.permissions)) return message.reply(`Uh oh! You do not have permission to use this command!\nRequired Permission(s) : \`${command.permission.join(", ")}\``).then(m => m.delete({timeout: 10000}));
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown) * 1000;

        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        else {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const embed = new MessageEmbed()
                    .setTitle("Stop Right there!")
                    .setColor("#f67adf")
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setTimestamp();
                const timeLeft = expirationTime - now;
                const minLeft = ms(timeLeft, { long: true });
                const hourLeft = ms(timeLeft, { long: true });
                if (timeLeft > 60000 && timeLeft < 3600000) {
                    return message.reply(embed.setDescription(`Please wait ${minLeft} more before reusing the \`${command.name}\` command. `));
                } else if (timeLeft > 3600000) {
                    return message.reply(embed.setDescription(`Please wait ${hourLeft} more before reusing the \`${command.name}\` command. `));
                } else if (timeLeft < 60000) {
                    return message.reply(embed.setDescription(`Please wait ${timeLeft.toFixed(1) / 1000} more second(s) before reusing the \`${command.name}\` command. `));
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        try {
            if (command)
                command.run(client, message, args);
        }
        catch (error) {
            message.channel.send("There was an error with that command. Please report this to developers!")
        }
    })
}
