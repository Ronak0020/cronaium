const Discord = require("discord.js");
const User = require("../../models/user");
const Utils = require("../../utils/utils");
const Item = require("../../assets/json/items");

module.exports = {
    name: "sell",
    description: "Sell an item from your inventory for some spirits!",
    category: "Economy",
    cooldown: 15,
    usage: "<item ID> [amount of items]",
    example: "110 1",
    info: "If you do not provide the amount of item, the bot will sell 1 item by default.",
    run: async (client, message, args) => {
        let user = await User.findOne({ userID: message.author.id }).catch(e => console.log(e));
        if (!user) {
            const newUser = new User({ userID: message.author.id, userName: message.author.username });
            await newUser.save().catch(e => console.log(e));
            message.reply("You have just been added to database. You do not have anything in your inventory to sell.")
        }
        const embed = new Discord.MessageEmbed()
            .setTitle("Item Sold!")
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        if (!args[0]) return message.reply("Please provide item ID you want to sell.").then(m => m.delete({ timeout: 10000 }));

        let amount = parseInt(args[1]) || 1;
        let index = user.inventory.findIndex(item => item === args[0]);
        if (index < 0) return message.channel.send(embed.setColor("#C70039").setDescription(`Sorry but it seems like there are no items with ID \`${args[0]}\` in your inventory. Please provide a valid item ID.\nUse \`inventory\` command to get a list of items in your inventory!`));
        let item = Item.findIndex(e => e.id === args[0]);

        let msg = await message.channel.send(embed.setDescription(`Are you sure you want to sell the following items?
**Item Name :** ${Item[item].emoji} ${Item[item].name} * ${amount}
**Amount You Receive :** ${amount * Item[item].price / 5} <:spirits:814860320828817408>
If you want to sell the item, type \`yes\` in the chat within 30 seconds. To cancel, type \`no\``).setColor("#f78ccf").setTitle("Item selling Confirmation"));

        let verification = await Utils.verify(message.channel, message.author);
        if(!verification) return message.reply("You have cancelled selling the item.");

        msg.delete();

        for (i = 0; i < amount; i++) {
            let indexx = user.inventory.findIndex(item => item === args[0]);
            user.coins += Item[item].price / 5;
            user.inventory.splice(1, indexx);
        }
        await user.save().catch(e => console.log(e));
        embed.setColor("#D6F21F");
        embed.setDescription(`You have successfully sold the Item!!
**Item Sold :** ${Item[item].emoji} ${Item[item].name} * ${amount}
**Amount Received :** ${amount * Item[item].price / 5} <:spirits:814860320828817408>

You can check your balance using \`balance\` command!`);
        message.channel.send(embed);
    }
}