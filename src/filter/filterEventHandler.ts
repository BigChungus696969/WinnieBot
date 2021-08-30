import { CommandInteraction, Interaction, Message } from "discord.js";
import { addFilter, checkFilter, filterEmitter, FILTER_ADD_EVENT, FILTER_FOUND_EVENT, FILTER_REMOVE_EVENT, getFilter, removeFilter } from "./filterStore";
import { getSocialCredit, reduceSocialCredit } from "../socialCredit/socialCreditStore";

export function bootStrapFilterEvents(){
    filterEmitter.on(FILTER_FOUND_EVENT, async (message: Message, word: string) => {
        const userId = message.author.id;
        console.log(message);
        const cost : number = getFilter(word)?.cost as number;
        reduceSocialCredit(userId,cost);
        const newNum = getSocialCredit(userId);
		await message.reply(`${message.author} Your said nono word, now your social credit is: `+ newNum.score);
    });

    filterEmitter.on(FILTER_ADD_EVENT, async (interaction: CommandInteraction) => {
        const cost: number = interaction.options.getInteger('cost') as number;
        const filter: string = interaction.options.getString('filter') as string;
        addFilter(filter,{cost : cost});
		await interaction.reply(`${filter} is added as a filter`);
    });

    filterEmitter.on(FILTER_REMOVE_EVENT, async (interaction: CommandInteraction) => {
        const cost: number = interaction.options.getInteger('cost') as number;
        const filter: string = interaction.options.getString('filter') as string;
        removeFilter(filter);
		await interaction.reply(`${filter} is removed as a filter`);
    });
}