const { MessageEmbed } = require('discord.js');
const { Aki } = require('aki-api');
const { stripIndents } = require('common-tags');
const { verify } = require('../../utils/utils');

module.exports = {
    name: "akinator",
	category: "Games",
    run: async(client, message, args) => {
        const current = client.games.get(message.channel.id);
		if (current) return message.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		try {
			const aki = new Aki('en', !message.channel.nsfw);
			let ans = null;
			let win = false;
			let timesGuessed = 0;
			let guessResetNum = 0;
			let wentBack = false;
			let forceGuess = false;
			const guessBlacklist = [];
			client.games.set(message.channel.id, { name: this.name });
			while (timesGuessed < 3) {
				if (guessResetNum > 0) guessResetNum--;
				if (ans === null) {
					await aki.start();
				} else if (wentBack) {
					wentBack = false;
				} else {
					try {
						await aki.step(ans);
					} catch {
						await aki.step(ans);
					}
				}
				if (!aki.answers || aki.currentStep >= 79) forceGuess = true;
				const answers = aki.answers.map(answer => answer.toLowerCase());
				answers.push('end');
				if (aki.currentStep > 0) answers.push('back');
				await message.channel.send(stripIndents`
					**${aki.currentStep + 1}.** ${aki.question} (${Math.round(Number.parseInt(aki.progress, 10))}%)
					${aki.answers.join(' | ')}${aki.currentStep > 0 ? ` | Back` : ''} | End
				`);
				const filter = res => res.author.id === message.author.id && answers.includes(res.content.toLowerCase());
				const messages = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!messages.size) {
					await message.channel.send('Sorry, time is up!');
					win = 'time';
					break;
				}
				const choice = messages.first().content.toLowerCase();
				if (choice === 'end') {
					forceGuess = true;
				} else if (choice === 'back') {
					if (guessResetNum > 0) guessResetNum++;
					wentBack = true;
					await aki.back();
					continue;
				} else {
					ans = answers.indexOf(choice);
				}
				if ((aki.progress >= 90 && !guessResetNum) || forceGuess) {
					timesGuessed++;
					guessResetNum += 10;
					await aki.win();
					const guess = aki.answers.filter(g => !guessBlacklist.includes(g.id))[0];
					if (!guess) {
						await message.channel.send('I can\'t think of anyone.');
						win = true;
						break;
					}
					guessBlacklist.push(guess.id);
					const embed = new MessageEmbed()
						.setColor("#D6FF33")
						.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's-`)
						.setDescription(stripIndents`
							${guess.name}${guess.description ? `\n_${guess.description}_` : ''}
							_**Am I correct?\nType \`yes\` or \`no\`.**_
						`)
						.setThumbnail(guess.absolute_picture_path || null)
						.setFooter(forceGuess ? 'Final Guess' : `Guess ${timesGuessed}`);
					await message.channel.send(embed);
					const verification = await verify(message.channel, message.author);
					if (verification === 0) {
						win = 'time';
						break;
					} else if (verification) {
						win = false;
						break;
					} else if (timesGuessed >= 3 || forceGuess) {
						win = true;
						break;
					} else {
						await message.channel.send('Hmm... Then let\'s keep guessing!');
					}
				}
			}
			client.games.delete(message.channel.id);
			if (win === 'time') return message.channel.send('You have not replied in time therefore, I won.');
			if (win) return message.channel.send('Oh! You defeated me!.');
			return message.channel.send('Yeah! I got it right! I won.');
		} catch (err) {
			client.games.delete(message.channel.id);
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
    }