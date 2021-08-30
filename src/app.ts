// Require the necessary discord.js classes
import { Client, Intents, User } from "discord.js";
import { token, guildId } from '../config.json';
import { bootStrapCommands } from "./deploy-commands";
import { addSocialCredit, ADD_EVENT, CUT_EVENT, getSocialCredit, onStartUp, reduceSocialCredit, socialCreditEmitter } from "./socialCredit/socialCreditStore";
import { addFilter, checkFilter, filterEmitter, FILTER_ADD_EVENT, FILTER_FOUND_EVENT, FILTER_REMOVE_EVENT } from "./filter/filterStore";
import { bootStrapFilterEvents } from "./filter/filterEventHandler";
import { bootStrapSocialCreditEvents } from "./socialCredit/socialCreditEventHandler";

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]});

// When the client is ready, run this code (only once)
client.once('ready', async () => {
	bootStrapCommands();
	bootStrapFilterEvents();
	bootStrapSocialCreditEvents();
	const guild = await client.guilds.fetch(guildId);
	const members = await (await guild.members.fetch()).map(m => m.user.id);
	onStartUp(members);
	console.log(members);
	console.log('Ready!');
});

client.on('messageCreate', async message => {
	let content : string = message.content;
	const list = content.split(/[ ,]+/);
	list.forEach(s =>{
		//Check if the word is in the filter
		if(checkFilter(s)) {
			filterEmitter.emit(FILTER_FOUND_EVENT,message,s);
		}
	});
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
		socialCreditEmitter.emit(ADD_EVENT, interaction);
	}
	else if (commandName === 'cut') {
		socialCreditEmitter.emit(CUT_EVENT, interaction);
	}
	else if (commandName === 'check') {
		const mention : User = interaction.options.getMentionable('mentionable') as User;
		const num = getSocialCredit(mention?.id);
		await interaction.reply(`${mention} Your credit is: `+ num.score);
	}
	else if (commandName === 'add_filter'){
		filterEmitter.emit(FILTER_ADD_EVENT, interaction);
	}
	else if (commandName === 'cut_filter'){
		filterEmitter.emit(FILTER_REMOVE_EVENT, interaction);
	}
});

client.login(token);


