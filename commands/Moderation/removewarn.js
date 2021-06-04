const Discord = require("discord.js");
const User = require("../../models/serverUser.js");
const { verify } = require("../../utils/utils");

module.exports = {
    name: "removewarn",
    aliases: ["clearwarn", "deletewarn", "removecase", "deletecase"],
    description: "Remove a specific warning from a user or remove all the warnings from a user.",
    cooldown: 5,
    usage: "<@user | userID> <warn Number | all>",
    example: "removewarn @Rem 3",
    category: "Moderation",
    permission: "MANAGE_MESSAGES",
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Remove Warning`)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send(embed.setDescription("Can not find the member... They either left the server or you provided me wrong user ID.").setColor("RED"));
        if (!args[1]) return message.reply("Please provide the warning number with the command as well. Check the warn number using `warnings @user` command.");
        if (isNaN(args[1]) && args[1].toLowerCase() !== "all") return message.reply("You need to provide either `all` or the number of warning.");
        User.findOne({
            userID: member.id
        }, async (err, user) => {
            if (err) console.log(err);
            if (!user) return message.channel.send(embed.setDescription("The user has no warnings to remove. They are good boy/girl! Follows the server rules!").setColor("RED").setAuthor(member.displayName, member.user.displayAvatarURL()));
            if (!user.warnReason.length) return message.channel.send(embed.setDescription("The user has no warnings to remove. They are good boy/girl! Follows the server rules!").setColor("RED").setAuthor(member.displayName, member.user.displayAvatarURL()));
            let number;
            args[1].toLowerCase() === "all" ? number = user.warnReason.length - 1 : number = parseInt(args[1]) - 1;

            const msg = await message.channel.send(embed.setDescription(args[1] === "all" ? `Are you sure you want to clear the warning for the user?\nReply \`yes/no\`` : `Are you sure you want to remove this warning from the user:\n**${user.warnReason[number]} - ${user.warnMod[number]}**\nReply \`yes/no\``).setColor("RED"))
            const verification = await verify(message.channel, message.author);
            if (!verification) return msg.edit(embed.setDescription(`Action cancelled. No warning was removed from the user.`));

            if (args[1].toLowerCase() === "all") {
                user.warnReason = [];
                user.warnMod = [];
                await user.save().catch(e => console.log(e));
                msg.edit(embed.setDescription(`Successfully cleared all the warning for the user!`).setAuthor(member.displayName, member.user.displayAvatarURL()).setColor("#fcfa5c"));
            } else if (!isNaN(args[1])) {
                user.warnReason.splice(number, 1);
                user.warnMod.splice(number, 1);
                await user.save().catch(e => console.log(e));
                msg.edit(embed.setDescription(`Successfully removed the warning for the user!`).setAuthor(member.displayName, member.user.displayAvatarURL()).setColor("#fcfa5c"));
            }
        })
    }
}