import {socialCreditEmitter,ADD_EVENT,CUT_EVENT} from './socialCreditStore'

socialCreditEmitter.on(ADD_EVENT, (user, amount, newCredit) => {
});

socialCreditEmitter.on(CUT_EVENT, (user, amount, newCredit) => {
});

