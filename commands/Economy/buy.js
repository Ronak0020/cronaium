const Discord = require("discord.js");
const Items = require("../../assets/json/items.json");
const Utils = require("../../utils/utils");
const User = require("../../models/user");

module.exports = {
    name: "buy",
    category: "Economy",
    cooldown: 5,
    description: "Purchase stuffs from the shop!",
    usage: "<itemID>",
    example: "buy 102",
    run: async(client, message, args) => {
        let user = await User.findOne({ userID: message.author.id }).catch(e => console.log(e));
        if (!user) {
            const newUser = new User({ userID: message.author.id, userName: message.author.username });
            await newUser.save().catch(e => console.log(e));
            message.reply("You have just been added to database. Please re-use the command to claim your dailies.")
        }
        const embed = new Discord.MessageEmbed()
        .setTitle("Item Purchased!")
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

        if(!args[0]) return message.reply("Please provide item ID you want to purchase.").then(m => m.delete({timeout: 10000}));

        let amount = parseInt(args[1]) || 1;
        let index = Items.findIndex(item => item.id === args[0]);
        if(index < 0) return message.channel.send(embed.setColor("#C70039").setDescription(`Sorry but it seems like there are no items with ID \`${args[0]}\` in the shop yet. Please provide a valid item ID.\nUse \`shop\` command to get a list of available items in the shop!`));

        if(user.coins < amount*Items[index].price) return message.channel.send(embed.setColor("#C70039").setDescription(`Sorry but it seems like you do not have enough <:spirits:814860320828817408> Spirits to make this purchase.\n**Item Total Cost :** ${amount*Items[index].price}\n**You need more :** ${amount.Items[index].price - user.coins} <:spirits:814860320828817408>\n\nCome back later when you have enough spirits!`));
        if(user.inventory.includes(Items[index].id) && Items[index].category === "bgimages") return message.reply(`You already have this background purchased! Use it using \`profile set background ${Items[index].id}\`!`);
        if(Items[index].category === "bgimages") amount = 1;
        for(i=0;i<amount;i++) {
            user.coins -= Items[index].price;
            user.inventory.push(Items[index].id);
        }
        await user.save().catch(e => console.log(e));
        embed.setColor("#D6F21F");
        embed.setDescription(`You have successfully purchased the Item!!
**Item Purchased :** ${Items[index].emoji} ${Items[index].name}
**Amount Paid :** ${amount*Items[index].price} <:spirits:814860320828817408>

You can check all your Items in your inventory!`);
embed.setImage(Items[index].image)
message.channel.send(embed);
    }
}