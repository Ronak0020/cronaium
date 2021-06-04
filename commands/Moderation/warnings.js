module.exports = {
    name: "warnings",
    aliases: ["warnings", "warns"],
    description: "Check warnings of a user.",
    usage: "<@user | userID>",
    category: "Moderation",
    example: "warnings @Rem",
    permission: "MANAGE_MESSAGES",
    cooldown: 5,
    run: async (client, message, args) => {
        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply("Please mention the user or provide their user ID to check their warnings.").then(m => m.delete({ timeout: 10000 }));
        Warn.findOne({
            serverID: message.guild.id,
            userID: target.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (!user) return message.reply("This user has no warnings! :tada:").then(m => m.delete({ timeout: 10000 }));
            let warnings = [];
            for (i = 0; i < user.warnReason.length; i++) {
                warnings.push(`\`${i + 1}\` - ${user.warnReason[i]} - ${user.warnMod[i]}`)
            }
            if (warnings.length < 1) warnings.push("No warnings!")
            const embed = new Discord.MessageEmbed()
                .setTitle(`Warnings of **${target.username}** :`)
                .setDescription(`${warnings.join("\n")}`)
                .setFooter(`Warns: ${user.warnReason.length} | Mutes: ${user.muteCount} | Kicks: ${user.kickCount} | Bans: ${user.banCount}`, client.user.displayAvatarURL())
                .setTimestamp()
                .setColor("#af78cf")
            message.channel.send(embed);
        })
    }
}