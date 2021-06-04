const { stripIndents } = require('common-tags');
const { verify } = require('../../utils/utils');

module.exports = {
    name: "tictactoe",
	category: "Games",
	cooldown: 30,
	description: "Play tic tac toe with your friends",
	aliases: ["ttt"],
	usage: "<@user>",
	example: "tictactoe @Rem",
    run: async(client, message, args) => {
        const opponent = message.mentions.users.first();
        if (opponent.bot) return message.reply('Bots may not be played against.');
		if (opponent.id === message.author.id) return message.reply('You may not play against yourself.');
		if (client.games.get(message.channel.id)) return message.reply('Only one game may be occurring per channel.');
		client.games.set(message.channel.id, {name: "tictactoe"});
		try {
			await message.channel.send(`${opponent}, do you accept this challenge?`);
			const verification = await verify(message.channel, opponent);
			if (!verification) {
				client.games.delete(message.channel.id);
				return message.channel.send('Looks like they declined...');
			}
			const sides = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
			const taken = [];
			let userTurn = true;
			let winner = null;
			while (!winner && taken.length < 9) {
				const user = userTurn ? message.author : opponent;
				const sign = userTurn ? 'X' : 'O';
				await message.channel.send(stripIndents`
					${user}, which side do you pick?
					\`\`\`
					${sides[0]} | ${sides[1]} | ${sides[2]}
					—————————
					${sides[3]} | ${sides[4]} | ${sides[5]}
					—————————
					${sides[6]} | ${sides[7]} | ${sides[8]}
					\`\`\`
				`);
				const filter = res => {
					const choice = res.content;
					return res.author.id === user.id && sides.includes(choice) && !taken.includes(choice);
				};
				const turn = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!turn.size) {
					await message.channel.send('Sorry, time is up!');
					userTurn = !userTurn;
					continue;
				}
				const choice = turn.first().content;
				sides[Number.parseInt(choice, 10)] = sign;
				taken.push(choice);
				if (
					(sides[0] === sides[1] && sides[0] === sides[2])
					|| (sides[0] === sides[3] && sides[0] === sides[6])
					|| (sides[3] === sides[4] && sides[3] === sides[5])
					|| (sides[1] === sides[4] && sides[1] === sides[7])
					|| (sides[6] === sides[7] && sides[6] === sides[8])
					|| (sides[2] === sides[5] && sides[2] === sides[8])
					|| (sides[0] === sides[4] && sides[0] === sides[8])
					|| (sides[2] === sides[4] && sides[2] === sides[6])
				) winner = userTurn ? message.author : opponent;
				userTurn = !userTurn;
			}
			client.games.delete(message.channel.id);
			return message.channel.send(winner ? `Congrats, ${winner}!` : 'Oh... The cat won.');
		} catch (err) {
			client.games.delete(message.channel.id);
			throw err;
		}
	}
};