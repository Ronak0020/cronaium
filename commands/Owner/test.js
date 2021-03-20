const Discord = require("discord.js");
const bot = new Discord.Client();

module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission(["MANAGE_MESSAGES"])) {
        const embed = new Discord.MessageEmbed()
        embed.setColor(0xFF0000)
        embed.setDescription(`❌ You don't have permissions to DM anyone using ${bot.user.username}. Please contact a staff member.[Missing Permission:- Manage Messages]`)
        return message.channel.send(embed);
    }

    if (message.author.id === "448410421339095041") return
    if (message.author.id === "485494651835383828") return

    const mention = message.mentions.members.first();
    if (!mention) return message.reply("You Need To Mention A User!");

    const mentioned = mention.id;

    const msgtosend = args.join(" ").slice(25);
    message.delete();


    if (!msgtosend) return message.reply("You Need To Provide A Text To DM Others!")

    const embed1 = new Discord.MessageEmbed()
    embed1.setColor(0x00FFFF)
    embed1.setThumbnail(bot.user.displayAvatarURL())
    embed1.setDescription(`:loudspeaker: **You just received a new direct message!**`);
    embed1.addField(`:speaking_head: **From:**`, `═══════ \n  __${message.author.tag}__ \n **--------------------------------------------**`);
    embed1.addField(`:speech_balloon: **Message:**`, `═════════ \n  ${msgtosend}`)
    embed1.setFooter(message.author.tag, message.author.displayAvatarURL())
    embed1.setTimestamp();
    let blocked;
         bot.users.cache.get(mentioned).send(embed1).catch(error => {
        // Only log the error if the user's dm is off
        if (error.code === 50007) {
            blocked = true
          console.log(blocked)
        } else {
            blocked = false
            console.log(blocked)
        }
    });
    if(blocked === true){
        console.log("error")
        const embed2 = new Discord.MessageEmbed()
        embed2.setColor(0xFF0000)
        embed2.setDescription(`:x: I was unable to dm that User! `);
         message.reply(embed2)
    } 
    if(blocked === false) {
    const embed3 = new Discord.MessageEmbed()
    embed3.setColor(0x00FFFF)
    embed3.setDescription(`<:AXVsuccess:754538270028726342> DM Sent! `);
    message.channel.send(embed3);
    }
}

module.exports.help = {
    name: "dm",
    aliases: ["Direct_Message", "PM"]
}