const Discord = require("discord.js");

module.exports = {
  name: "unban",
  description: "Unban a user from the server.",
  category: "Moderation",
  cooldown: 5,
  usage: "<userTag | userID>",
  example: "unban Ronak#7611 **or** unban 625877119989186570",
  run: async(client, message, args) => {
    let user;

		if(!args[0]){
			return message.channel.send("You shuld also provide me the user ID or user Tag of whom you want to unban from this server.");
		}

		if(!isNaN(args[0])){
			await client.users.fetch(args[0]).then((u) => {
				user = u;
			}).catch(() => {});
		} else if(isNaN(args[0])) {
			const arr = args[0].split("#");
			if(arr.length < 2){
				return message.channel.send(`No user was found with the provided user tag. Try using their ID.`);
			}
			user = client.users.cache.filter((u) => u.username === arr[0]).find((u) => u.discriminator === arr[1]);
		}

		if(!user){
			return message.channel.send(`No user was found with id \`${args[0]}\`.`)
		}
		const banned = await message.guild.fetchBans();
		if(!banned.some((e) => e.user.id === user.id)){
			return message.channel.send("Member is not banned. There is no need to unban someone who is not even banned?");
		}
		message.guild.members.unban(user).catch(() => {});

		message.channel.send(`Member has been successfully unbanned.`)
	}
  }