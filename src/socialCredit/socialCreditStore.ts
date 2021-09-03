import {SocialCredit} from './socialCredit';
import { JSONStorage} from "node-localstorage";
import {EventEmitter} from 'events';
import { LeaderBoardItem } from './leaderBoardItem';

let localStorage = new JSONStorage('./scratch');
export const socialCreditEmitter = new EventEmitter();
export const ADD_EVENT = 'addSocialCredit';
export const CUT_EVENT = 'cutSocialCredit';
export const LEADERBOARD_EVENT = 'leaderBoard';

const MAX_CREDIT = 150;
const INITIAL_CREDIT = 100;

//loads social credit form file
export function onStartUp(idList : string[]){
    idList.forEach((i) => {
        if(!localStorage.getItem(i)) {
            localStorage.setItem(i, {score: INITIAL_CREDIT});
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
    const original : number = Math.max(localStorage.getItem( userId ).score, 0);
    const newCredit : SocialCredit = { score: Math.min(original + amount , MAX_CREDIT)};
    localStorage.setItem(userId,newCredit!);
}

export function reduceSocialCredit(userId: string, amount: number) {
    if(!localStorage.getItem(userId)) {
        return;
    }
    const original : SocialCredit = localStorage.getItem(userId);
    if(original.score === 0) {
        return;
    }
    const delta = Math.max(amount,0);
    let value = Math.max( original.score - delta , 0);
    const newCredit : SocialCredit = { score: value};
    localStorage.setItem(userId,newCredit!);
}

export function getSocialCredit(userId: string) : SocialCredit{
    if(!localStorage.getItem(userId)) {
        return {score: 0};
    }
    return localStorage.getItem(userId);
}

export function getLeaderBoard() : LeaderBoardItem[] {
    const n = localStorage.length;
    let list: LeaderBoardItem[] = [];
    for(let x = 0; x<n ;x++){
        const item : LeaderBoardItem= {id: localStorage.key(x), credit: {
            score: localStorage.getItem(localStorage.key(x)).score
        }}
        list.push(item);
    }
    list = list.sort((a,b) => {
        return b.credit.score-a.credit.score;
    });
    list.length = Math.min(list.length, 10);
    return list;
}
