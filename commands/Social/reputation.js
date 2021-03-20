const Discord = require("discord.js");
const User = require("../../models/user");
const ms = require("ms");

module.exports = {
    name: "reputation",
    category: "Social",
    description: "Give +1 reputation point to a user!",
    usage: "<@user | userID>",
    example: "reputation @marley#1218",
    info: "This command has a cooldown of 12 hours. Once you have given a reputation point to a user, you need to wait for 12 hours to again give reputation point to another user. You also can not give reputation points to yourself.",
    aliases: ["rep", "giverep", "givereputation"],
    run: async(client, message, args) => {
        let member = message.mentions.users.first() || client.users.cache.get(args[0]);
        if(!member) return message.reply(":x: Can not find the user! please provide me a userID or @user to give reputation point to them!").then(m => m.delete({timeout: 10000}));
        if(member.id === message.author.id) return message.reply(":x: You can not give reputation point to yourself sadly... ;-;");
        let sender = await User.findOne({userID: message.author.id}).catch(e => console.log(e));
        if(!sender) {
            const newUser = new User({userID: message.author.id, userName: message.author.username});
            await newUser.save().catch(e => console.log(e));
        }
        let receiver = await User.findOne({userID: member.id}).catch(e => console.log(e));
        if(!receiver) {
            const newUser = new User({userID: member.id, userName: member.username});
            await newUser.save().catch(e => console.log(e));
        }
        if(sender.reputationCooldown > Date.now()) return message.reply(`SOrry! But you already gave reputation point to a user! You now need to wait for \`${ms(sender.reputationCooldown - Date.now(), {long: true})}\` more before you can give another reputation point to someone!`);
        receiver.reputation += 1;
        sender.reputationCooldown = Date.now() + 1000*60*60*12;
        await sender.save().catch(e => console.log(e));
        await receiver.save().catch(e => console.log(e));
        const embed = new Discord.MessageEmbed()
        .setTitle("Reputation point Sent!")
        .setFooter(message.author.username, message.author.displayAvatarURL())
        .setThumbnail(member.avatarURL())
        .setColor("#fccfff")
        .setTimestamp()
        .setDescription(`Congratulations ${message.author} ! You have successfully given +1 Reputation point to ${member} !
        They now have **${receiver.reputation} reputation points!**
        
        You can now again give a reputation point to someone after **12 hours**`);
        message.channel.send(embed);
    }
}