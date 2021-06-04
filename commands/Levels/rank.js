const Discord = require('discord.js');
const Levels = require('../../utils/levels');
const canvacord = require("canvacord");
const User = require("../../models/user");

module.exports = {
    name: 'rank',
    category: 'Levels',
    description: "Check your server level.",
    aliases: ["level"],
    usage: "[@user]",
    example: "rank @Rem#7611",
    cooldown: 5,
    run: async (client, message, args) => {
        const target = message.mentions.users.first() || message.author;
        const user = await Levels.fetch(target.id, message.guild.id);
        if (!user) return message.channel.send("Hmm... Seems like this user is inactive. They have not earned any xp. No details to show...");
        const userDB = await User.findOne({ userID: target.id }).catch(e => console.log(e));
        if (!userDB) {
            const newUser = new User({ userID: target.id, userName: target.username });
            await newUser.save().catch(e => console.log(e));
        }
        let color;
        let status = target.presence.status;
        if (status === "dnd") { color = "#ff0048"; }
        else if (status === "online") { color = "#00fa81"; }
        else if (status === "idle") { color = "#ffbe00"; }
        else { status = "streaming"; color = "#a85fc5"; }

        const rawLeaderboard = await Levels.rawLeaderboard(message.guild.id, message.guild.members.cache.size);
        const pos = rawLeaderboard.findIndex(i => i.guildID === message.guild.id && i.userID === target.id) + 1;
        const rank = new canvacord.Rank()
            .setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp, userDB.allColor)
            .setRequiredXP(Levels.xpFor(user.level + 1), userDB.allColor)
            .setStatus(status, true, 7)
            .setBackground(userDB.backgroundType, userDB.backgroundData)
            .renderEmojis(true)
            .setProgressBar(userDB.progressColor, userDB.progressType, true)
            .setRankColor(userDB.allColor, "COLOR")
            .setLevelColor(userDB.allColor, "COLOR")
            .setUsername(target.username, userDB.allColor)
            .setRank(pos, "Rank", true)
            .setLevel(user.level, "Level", true)
            .setDiscriminator(target.discriminator, userDB.allColor);
        rank.build()
            .then(async data => {
                const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                //define embed
                // const embed = new Discord.MessageEmbed()
                //     .setTitle(`Ranking of:  ${target.username}`)
                //     .setColor(userDB.allColor)
                //     .setImage("attachment://RankCard.png")
                //     .attachFiles(attachment)
                await message.channel.send(attachment);
                return;
            });
    }
}