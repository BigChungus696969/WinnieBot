import { Client, CommandInteraction, User } from 'discord.js';
import {socialCreditEmitter,ADD_EVENT,CUT_EVENT, addSocialCredit, getSocialCredit, reduceSocialCredit} from '../socialCredit/socialCreditStore'

export function bootStrapSocialCreditEvents() : void{
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
}
