const { MessageEmbed, version: djsversion } = require("discord.js");
const { utc } = require('moment');

module.exports = {
    name: "botinfo",
    category: "Info",
    cooldown: 3,
    description: "Check the information about this bot.",
    aliases: ["bot"],
    run: async (client, message, args) => {

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 60 / 60 % 24);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setColor('#f78cf6')
            .addField('Bot Information', [
                `**-> Client:** ${client.user.tag} (${client.user.id})`,
                `**-> Commands:** ${client.commands.size}`,
                `**-> Servers:** ${client.guilds.cache.size.toLocaleString()} `,
                `**-> Users:** ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
                `**-> Channels:** ${client.channels.cache.size.toLocaleString()}`,
                `**-> Creation Date:** ${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
                `**-> Node.js:** ${process.version}`,
                `**-> Discord.js:** v${djsversion}`,
                `**-> Bot Uptime:** v${uptime}`
            ])
            .addField('General Information', [
                `**-> Bot Owner:** \`${client.users.cache.get("625877119989186570").tag}\` and \`marley\``,
                `**-> Type:** ${client.user.username} is a Multi Purpose bot`,
                `**-> Purpose of creation:** To make a bot that can do anything *and also because the developer was bored so thought to do something xD*`,
                `**-> Theme:** This bot is themed as "Crona" from Soul Eater anime `,
                `**-> Why Crona:** Well... Because it is the favourite character of someone i love the most~ So, if it can make her smile then why not? :grin:`,
                `**-> Time took for creation:** 2 months ;-; *i am lazy guy ahh (jk i actually got some issues irl xo took a long time)*`
            ])
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL());
        message.channel.send(embed);
    }
}