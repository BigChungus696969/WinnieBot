import { Client, CommandInteraction, User } from 'discord.js';
import {socialCreditEmitter,ADD_EVENT,CUT_EVENT, addSocialCredit, getSocialCredit, reduceSocialCredit, LEADERBOARD_EVENT, getLeaderBoard} from '../socialCredit/socialCreditStore'

export function bootStrapSocialCreditEvents(client : Client) : void{
    socialCreditEmitter.on(ADD_EVENT,async (interaction: CommandInteraction) => {
        const mention : User = interaction.options.getMentionable('mentionable') as User;
		const credit = interaction.options.getInteger('credit') as number;
		addSocialCredit(mention?.id,credit);
		const newNum = getSocialCredit(mention?.id);
		await interaction.reply(`${mention} Your credit is now: `+ newNum.score);
    });
    
    socialCreditEmitter.on(CUT_EVENT, async (interaction: CommandInteraction) => {
        const mention : User = interaction.options.getMentionable('mentionable') as User;
		const credit = interaction.options.getInteger('credit') as number;
		reduceSocialCredit(mention?.id,credit);
		const newNum = getSocialCredit(mention?.id);
		await interaction.reply(`${mention} Your credit is now: `+ newNum.score);
    });

	socialCreditEmitter.on(LEADERBOARD_EVENT, async (interaction: CommandInteraction) => {
		const list = getLeaderBoard();
		let result : string = " ";
		for(let [index, item] of list.entries()){
			const guild = await client.guilds.fetch(interaction.guildId as string);
			const name = await (await guild.members.fetch(item.id)).displayName;
			result += `${index + 1}. ${name}     ${JSON.stringify(item.credit.score)} \n `;
		}
		console.log(JSON.stringify(list));
		await interaction.reply(result);
    });
}
