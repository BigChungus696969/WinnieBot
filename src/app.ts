// Require the necessary discord.js classes
import { Client, Intents, User } from "discord.js";
import { token, guildId } from '../config.json';
import { bootStrapCommands } from "./deploy-commands";
import { addSocialCredit, ADD_EVENT, CUT_EVENT, getSocialCredit, LEADERBOARD_EVENT, onStartUp, reduceSocialCredit, socialCreditEmitter } from "./socialCredit/socialCreditStore";
import { FilterStore, FILTER_ADD_EVENT, FILTER_FOUND_EVENT, FILTER_REMOVE_EVENT} from "./filter/filterStore";
import { badFilterStore, bootStrapFilterEvents, goodFilterStore } from "./filter/filterEventHandler";
import { bootStrapSocialCreditEvents } from "./socialCredit/socialCreditEventHandler";
import { FilterMeta } from "./filter/filterMeta";

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]});

// When the client is ready, run this code (only once)
client.once('ready', async () => {
	bootStrapCommands();
	bootStrapFilterEvents(goodFilterStore,true);
	bootStrapFilterEvents(badFilterStore,false);
	bootStrapSocialCreditEvents(client);
	const guild = await client.guilds.fetch(guildId);
	const members = await (await guild.members.fetch()).map(m => m.user.id);
	onStartUp(members);
	console.log(members);
	console.log('Ready!');
});

client.on('messageCreate', async message => {
	let content : string = message.content;
	let cost : number = 0;
	cost += checkFilter(content,badFilterStore);
	cost -= checkFilter(content,goodFilterStore);
	console.log(cost);
	if(cost > 0){
		badFilterStore.getEmitter().emit(FILTER_FOUND_EVENT,message, cost);
	}else if(cost < 0){
		goodFilterStore.getEmitter().emit(FILTER_FOUND_EVENT,message, cost);
	}
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
		const sub = interaction.options.getSubcommand(false) as string;
		const subCommand = interaction.options.getString(sub);
		if(subCommand === 'good'){
			console.log('here')
			goodFilterStore.getEmitter().emit(FILTER_ADD_EVENT, interaction);
		}else if(subCommand === 'bad'){
			badFilterStore.getEmitter().emit(FILTER_ADD_EVENT, interaction);
		}
	}
	else if (commandName === 'cut_filter'){
		const sub = interaction.options.getSubcommand(false) as string;
		const subCommand = interaction.options.getString(sub);
		if(subCommand === 'good'){
			goodFilterStore.getEmitter().emit(FILTER_REMOVE_EVENT, interaction);
		}else if(subCommand === 'bad'){
			badFilterStore.getEmitter().emit(FILTER_REMOVE_EVENT, interaction);
		}}
	else if(commandName === 'leader_board'){
		socialCreditEmitter.emit(LEADERBOARD_EVENT, interaction);
	}
});

client.login(token);

function checkFilter(s : string, flterStore : FilterStore) : number{
	s = s.toLocaleLowerCase();
	const n = flterStore.localStorage.length;
	let cost : number = 0;
    for(let x = 0; x<n ;x++){
		const key = flterStore.localStorage.key(x);
		if(s.includes(key)){
			cost += flterStore.getFilter(key)?.cost as number;
		}
    }
	return cost;
}
