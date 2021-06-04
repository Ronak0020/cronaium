const Discord = require('discord.js');

module.exports = {
    name: "role",
    category: "Moderation",
    description: "Add/remove a role from a user.",
    usage: "<@user> <@role | role name | role ID>",
    example: "role @Rem @Member",
    permission: "MANAGE_ROLES",
    cooldown: 5,
    run: async (client, message, args) => {
        let role = args.slice(1).join(" ");
        if (!role) return message.reply("Uhh... Provide a role as well please!");
        let gRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === role.toLowerCase()) || message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!gRole) return message.reply("Hmm... Seems like that role doesn't exists. Please recheck the spelling/ID of the role you provided.");
        if (message.member.roles.highest.position < gRole.position) return message.reply("You can not assign a role to someone which is higher than your roles!");
        let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (rMember) {
            await (rMember.roles.cache.has(gRole.id) ? rMember.roles.remove(gRole.id) : rMember.roles.add(gRole.id));
            message.channel.send(`Successfully ${rMember.roles.cache.has(gRole.id) ? "added" : "removed"} **${gRole.name}** role ${rMember.roles.cache.has(gRole.id) ? "to" : "from"} **${rMember.user.username}**.`)
        } else if (!rMember) {
            switch (args[0]) {
                case "everyone":
                    let count = message.guild.members.cache.filter(m => !m.roles.cache.has(gRole.id));
                    await message.guild.members.cache.forEach(m => {
                        setTimeout(() => {
                            if (!m.roles.cache.has(gRole.id)) {
                                m.roles.add(gRole.id)
                            }
                        }, 1000)
                    })
                    message.reply(`Successfully assigned **${gRole.name}** role to **${count.size}** members.`);
                    break;
                case "bots":
                    let botcount = message.guild.members.cache.filter(m => !m.roles.cache.has(gRole.id) && m.user.bot);
                    await botcount.forEach(m => {
                        setTimeout(() => {
                            m.roles.add(gRole.id)
                        }, 1000)
                    })
                    message.reply(`Successfully assigned **${gRole.name}** role to **${botcount.size}** bots.`);
                    break;
                case "humans":
                    let humancount = message.guild.members.cache.filter(m => !m.roles.cache.has(gRole.id) && !m.user.bot);
                    await humancount.forEach(m => {
                        setTimeout(() => {
                            m.roles.add(gRole.id)
                        }, 1000)
                    })
                    message.reply(`Successfully assigned **${gRole.name}** role to **${humancount.size}** humans.`);
                    break;
            }
        }

    }
}