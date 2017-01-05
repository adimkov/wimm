import { ipcRenderer } from 'electron';
import { List, Map, Record } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as FinanceModel from '../model/finance';

export type FinanceState = Map<string, List<FinanceModel.Spending>>;

class FinanceStore extends IpcReduceStore<FinanceState, Action<any>> {
    getInitialState() {
        return Map<string, List<FinanceModel.Spending>>();
    }
     
    getSpendings(year: number, month: number): List<FinanceModel.Spending> {
        return this.getState().get(`${year}_${month}`);
    }

    reduce(state: FinanceState, action: Action<any>) {
        switch(action.type) {
            case Actions.CommitSpending:
            return commitSpending(state, action.payload as FinanceModel.CommitSpendingCommand);
        }
        return state;
        
    }

    registerIpcRenderer() {
    }
}

function commitSpending(state: FinanceState, command: FinanceModel.CommitSpendingCommand) {
    let dateString = `${command.date.getFullYear()}_${command.date.getMonth()}`;
    let spendings = state.get(dateString) as List<FinanceModel.Spending> || List<FinanceModel.Spending>()
    
    return state.set(dateString, spendings.push(new FinanceModel.Spending(command.category, command.amount)));
}

export let financeStore = new FinanceStore(Dispatcher);