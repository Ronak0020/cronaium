module.exports = {
    name: "purge",
    aliases: ["clear"],
    category: "Moderation",
    description: "Purge a specific amount of messages from a channel.",
    example: "purge 10",
    usage: "<amount>",
    permission: "MANAGE_MESSAGES",
    cooldown: 5,
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Hmm... How about you provide me a valid number which is greater than 0?").then(m => m.delete({ timeout: 5000 }));
        }
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("Sorry... I can't delete messages. I do not have permissions to do so.").then(m => m.delete({ timeout: 5000 }));
        }
        let deleteAmount;
        if (parseInt(args[0]) > 200) {
            deleteAmount = 200;
        } else {
            deleteAmount = parseInt(args[0]);
        }
        message.channel.bulkDelete(deleteAmount, true)
            .catch(err => message.reply(`Something went wrong... ${err}`));
        message.channel.send(`Successfully deleted \`${deleteAmount}\` messages from this channel.`).then(m => m.delete({ timeout: 5000 }));
    }
}