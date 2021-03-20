const Discord = require("discord.js");


module.exports = {
    name: "eval",
    description: "You can evaluate any command without it being in the code.",
    usage: "<code>",
    category: "Owner",
    run: async(client, message, args) => {
      let owners = ['625877119989186570'];
      if (!owners.includes(message.author.id)) return;
      try {
        var code = args.join(" ");
        if (code === "client.token") return message.channel.send("Dont wanna do that 0_0")
        var evaled = eval(code);
  
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        
        const embed = new Discord.MessageEmbed()
          .setColor(0x00A2E8)
          .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
          .addField(":outbox_tray: output: ", `\`\`\`js\n${clean(evaled)}\n\`\`\``)
        message.channel.send({embed})
      } catch (err) {
        const embed = new Discord.MessageEmbed()
        .setColor(0x00A2E8)
        .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
        .addField(":outbox_tray: output: ", `\`\`\`${clean(err)}\`\`\``)
      message.channel.send({embed})
      }
  
  function clean(text) {
    if (typeof(text) === 'string')
      return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else
        return text;
    }
    }
  }