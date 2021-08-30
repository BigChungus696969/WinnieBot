// Require the necessary discord.js classes
import { Client, Intents, User } from "discord.js";
import { token, guildId } from '../config.json';
import { bootStrapCommands } from "./deploy-commands";
import { addSocialCredit, getSocialCredit, onStartUp, reduceSocialCredit } from "./socialCreditStore";

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]});

// When the client is ready, run this code (only once)
client.once('ready', async () => {
	bootStrapCommands();
	const guild = await client.guilds.fetch(guildId);
	const members = await (await guild.members.fetch()).map(m => m.user.id);
	onStartUp(members);
	console.log(members);
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction?.guild?.name}\nTotal members: ${interaction?.guild?.memberCount}`);
	} else if (commandName === 'deez') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	} else if (commandName === 'add') {
		const mention : User = interaction.options.getMentionable('mentionable') as User;
		const credit = interaction.options.getInteger('credit') as number;
		addSocialCredit(mention?.id,credit);
		const newNum = getSocialCredit(mention?.id);
		await interaction.reply(`${mention} Your credit is now: `+ newNum.score);
	}
	else if (commandName === 'cut') {
		const mention : User = interaction.options.getMentionable('mentionable') as User;
		const credit = interaction.options.getInteger('credit') as number;
		reduceSocialCredit(mention?.id,credit);
		const newNum = getSocialCredit(mention?.id);
		await interaction.reply(`${mention} Your credit is now: `+ newNum.score);
	}
	else if (commandName === 'check') {
		const mention : User = interaction.options.getMentionable('mentionable') as User;
		const num = getSocialCredit(mention?.id);
		await interaction.reply(`${mention} Your credit is: `+ num.score);
	}
});

client.login(token);


