const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "poll",
	aliases: ["poll"],
	description: "Make a poll for your server members with or without a duration.",
	category: "Moderation",
	usage: "<questions> <options> <sec|min|hr>",
	permission: "MANAGE_CHANNELS",
	cooldown: 3000,
    run: async(client, message, args) => {
        let question;
        let option;
        let time;
        let channel = message.mentions.channels.first() || message.channel;
        const embed = new MessageEmbed()
		.setTitle("Poll Generation")
		.setDescription(`Type the question for the poll. What is this poll's title?\nYou have \`30 seconds\` to reply.`)
		.setAuthor(message.author.username, message.author.displayAvatarURL())
		.setColor("#fa56cf")
		.setFooter(client.user.username, client.user.displayAvatarURL())
		.setTimestamp();

        let emojiList = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        let filter = (m) => m.author.id === message.author.id && !m.author.bot;
        let collector = await message.channel.createMessageCollector(filter, {time: 30000, max: 3});
        let embedMessage = await message.channel.send(embed);
        collector.on("collect", async(response1) => {
            if(response1.content.length < 10 || response1.content.length > 100) return message.reply("Poll question must not exceed the limit of 100 characters and must be more than 10 characters long. Re-type the poll question.");
            response1.delete();
			question = response1.content;
            collector.stop();
            embedMessage.edit(embed.setDescription(`Type the options to choose for the poll. What should members choose?\nEach option must be separated using \`|\`. For example: **option 1 | option 2 | option 3**\nYou have \`30 seconds\` to reply.`));
            let collector2 = await message.channel.createMessageCollector(filter, {time: 30000, max: 3});
            collector2.on("collect", async(response2) => {
				response2.delete();
                if(response2.content.split("|").length < 2) return message.reply("Must provide at least 2 options to choose from. Each option should be separated using `|`");
				option = response2.content;
                collector2.stop();
                embedMessage.edit(embed.setDescription(`Type the time this poll will last for. Whe will the result of poll declare?\nType \`none\` for no duration.\nYou have \`30 seconds\` to reply.`));
                let collector3 = await message.channel.createMessageCollector(filter, {time: 30000, max: 3});
                collector3.on("collect", async(response3) => {
					response3.delete();
                    if(!ms(response3.content) && !response3.content.toLowerCase() === "none") return collector3.stop();
					if(ms(response3.content) && ms(response3.content) < 1000*60*5 || ms(response3.content) > 1000*60*60*24) return response3.reply("The poll duration should not exceed 24 hours and must be at least 5 minutes long. Please provide a valid duration.");
					time = ms(response3.content);
                    collector3.stop();
        
        let optionList = option.split("|");
		let optionText = [];

		for(var i = 0; i < optionList.length; i++) {
			optionText.push(`${emojiList[i]} \`-\` ${optionList[i]}`);
		}

        embed.setTitle(question);
		embed.setDescription(`${optionText.join("\n")}`)

		if(!isNaN(time)) {
			if(ms(time) < 600 || ms(time) > 1000*60*60*24) return message.reply("The poll duration should not exceed 1 day and must be at least 1 minute.");
			embed.setFooter(`The poll will last for ${ms(time)} | Moderation system powered by ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
		}

		channel.send(embed).then(async function(msg) {
			embedMessage.edit(embed.setDescription(`The poll has been successfully created in channel ${channel}.`))
			let reactions = [];
			for(var i = 0; i<optionList.length; i++) {
				reactions[i] = await msg.react(emojiList[i]);
			}

			if(!isNaN(time)) {
				setTimeout(() => {
					msg.channel.messages.fetch(msg.id).then(async function(msg) {
						let reactionCount = [];
						for(var i = 0; i<optionList.length; i++) {
							reactionCount[i] = await msg.reactions.cache.get(emojiList[i]).count - 1;
						}
						let max = -Infinity, iMax = [];
						for(var i = 0; i < reactionCount.length; i++) {
							if(reactionCount[i] > max) { max = reactionCount[i], iMax = [i] }
							else if(reactionCount === max) { iMax.push(i) }
						}

						let winner = [];
						if(reactionCount[iMax[0]] === 0) {
							winner.push("No one participated in the poll.")
						} else {
							for(var i = 0; i < iMax.length; i++) {
								winner.push(`${emojiList[i]} - ${optionList[iMax[i]]} - ${reactionCount[iMax[i]]} vote(s)`);
							}
						}

						embed.setDescription(`${optionText.join("\n")}\n\n**Winner(s) :**\n${winner.join("\n")}`);
						embed.setFooter(`This poll has ended | ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));
						embed.setTimestamp();

						msg.edit(" ", embed);
					})
				}, time);
			}

		}).catch(error => {
            console.log(error)
        });
                })
            })
        })

        collector.on("end", async(_, reason) => {
            if(reason === "time") return embedMessage.edit("Time's up! You need to restart the process. Yu took too long to reply.")
        })
    }
}