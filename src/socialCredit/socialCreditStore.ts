import {SocialCredit} from './socialCredit';
import { JSONStorage} from "node-localstorage";
import {EventEmitter} from 'events';

let localStorage = new JSONStorage('./scratch');
export const socialCreditEmitter = new EventEmitter();
export const ADD_EVENT = 'addSocialCredit';
export const CUT_EVENT = 'cutSocialCredit';

//loads social credit form file
export function onStartUp(idList : string[]){
    idList.forEach((i) => {
        if(!localStorage.getItem(i)) {
            localStorage.setItem(i, {score: 100});
        }
    });
    socialCreditEmitter.emit('startUp');
}
//adds social credit to user
export function addSocialCredit(userId: string, amount: number) {
    console.log(userId);
    if(!localStorage.getItem(userId)) {
        return;
    }
    const original : SocialCredit = localStorage.getItem(userId);
    const newCredit : SocialCredit = { score: Math.min(original.score + amount , 100)};
    localStorage.setItem(userId,newCredit!);
}

export function reduceSocialCredit(userId: string, amount: number) {
    if(!localStorage.getItem(userId)) {
        return;
    }
    const original : SocialCredit = localStorage.getItem(userId);
    const newCredit : SocialCredit = { score: Math.max(original.score - amount, 0)};
    
    localStorage.setItem(userId,newCredit!);
}

export function getSocialCredit(userId: string) : SocialCredit{
    if(!localStorage.getItem(userId)) {
        return {score: 0};
    }
    return localStorage.getItem(userId);
}
