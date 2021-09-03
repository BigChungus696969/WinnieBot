import { CommandInteraction, Interaction, Message } from "discord.js";
import { FilterStore, FILTER_ADD_EVENT, FILTER_FOUND_EVENT, FILTER_REMOVE_EVENT} from "./filterStore";
import { addSocialCredit, getSocialCredit, reduceSocialCredit } from "../socialCredit/socialCreditStore";
import { clientId } from "../../config.json";

export const badFilterStore : FilterStore = new FilterStore("./badwords");
export const goodFilterStore : FilterStore = new FilterStore("./goodwords");

const GOODMESSAGE = "You said good word, good citizen, now your social credit is:";
const BADMESSAGE = "You said nono word, now your social credit is:";

export function bootStrapFilterEvents(filterStore : FilterStore, isGood : boolean){
    filterStore.getEmitter().on(FILTER_FOUND_EVENT, async (message: Message, cost: number) => {
        if(message.author.id === clientId){
            return;
        }
        const userId = message.author.id;
        if(cost > 0){
            reduceSocialCredit(userId,cost);
        }else{
            addSocialCredit(userId,Math.abs(cost));
        }
        const newNum = getSocialCredit(userId);
        const strMessage = isGood? GOODMESSAGE : BADMESSAGE;
		await message.reply(`${message.author} ${strMessage} `+ newNum.score);
    });

    filterStore.getEmitter().on(FILTER_ADD_EVENT, async (interaction: CommandInteraction) => {
        const cost: number = interaction.options.getInteger('cost') as number;
        const filter: string = interaction.options.getString('filter') as string;
        filterStore.addFilter(filter,{cost : cost});
		await interaction.reply(`${filter} is added as a filter`);
    });

    filterStore.getEmitter().on(FILTER_REMOVE_EVENT, async (interaction: CommandInteraction) => {
        const cost: number = interaction.options.getInteger('cost') as number;
        const filter: string = interaction.options.getString('filter') as string;
        filterStore.removeFilter(filter);
		await interaction.reply(`${filter} is removed as a filter`);
    });
}