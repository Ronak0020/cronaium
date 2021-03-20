const Discord = require("discord.js");
const Levels = require("../../utils/levels");
const { createEmbedPage } = require("../../utils/utils");

module.exports = {
    name: 'leaderboard',
    description: 'Shows level leaderboard.',
    category: 'Levels',
    aliases: ["lb", "rlb"],
    cooldown: 5,
    run: async (client, message, args) => {
        const rawLeaderboard = await Levels.rawLeaderboard(message.guild.id, 50);

        if (rawLeaderboard.length < 1) return message.reply("Nobody's in leaderboard yet.");

        const leaderboard = Levels.mainLeaderboard(client, rawLeaderboard);
        const lb = leaderboard.map(e => `**${e.position}.** **${e.username}#${e.discriminator}**\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);

        createEmbedPage(lb, message, 5, type="leaderboard", {AUTHOR: `${message.guild.name}'s Leaderboard!`, FOOTER:`${client.user.username}`, FOOTERIMAGE:`${message.author.displayAvatarURL()}`});

    }
}