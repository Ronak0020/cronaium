const Discord = require("discord.js");

module.exports = {
    name: "addrole",
    category: "Moderation",
    cooldown: 5,
    description: "Create a role for your server.",
    aliases: ["createrole"],
    usage: "<Role-Name> [#hexcolour-code]",
    permission: "MANAGE_ROLES",
    example: "addrole Members #fac67f",
    run: async (client, message, args) => {
        let rolename = args.join(" ");
        let rolecolor = args.slice(args.length - 1);
        if (rolecolor[0].startsWith("#") && rolecolor[0].length === 7) rolename = args.slice(0, args.length - 1).join(" ");
        if (!rolename) return message.reply("I can not create a role without a name. Please provide me a name for the role.").then(m => m.delete({ timeout: 10000 }));
        message.guild.roles.create({
            data: {
                name: rolename,
                color: rolecolor[0].startsWith("#") ? rolecolor[0] : "#000000"
            }
        })
        const embed = new Discord.MessageEmbed();
        embed.setTitle("Role created!")
        embed.setColor(rolecolor[0].startsWith("#") ? rolecolor[0] : "#000000")
        embed.setFooter(client.user.username, client.user.displayAvatarURL())
        embed.setTimestamp()
        embed.setDescription(`Role with name **${rolename}** has been successfully created!`);
        message.channel.send(embed);
    }
}