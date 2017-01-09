import { ipcRenderer } from 'electron';
import { List, Map } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as FinanceModel from '../model/finance';


export type SpendingState = Map<string, any>;


class SpendingStore extends IpcReduceStore<SpendingState, Action<any>> {
    getInitialState() {
        return Map<string, any>({
            'categories': prepareCategories()
        });
    }
     
    reduce(state: SpendingState, action: Action<any>) {
        switch(action.type) {
            case Actions.setEditSpending:
                return setNewSpending(state, action.payload as FinanceModel.EditSpendingCommand);
            case Actions.cleanEditSpending:
                return setNewSpending(state, null);
        }

        return state;
    }

    getCategories(): List<FinanceModel.Category> {
        return this.getState().get('categories');
    }

    getCurrentlyEditSpending() {
        return this.getState().get('spending.edit') || new FinanceModel.Spending(this.getCategories().first(), 0);
    }

    registerIpcRenderer() {
    }
}

function prepareCategories(): List<FinanceModel.Category> {
    return List<FinanceModel.Category>([
        new FinanceModel.Category('food', 'Food', '#80D651', 'fa-cutlery'),
        new FinanceModel.Category('home', 'Home', '#45ABCD', 'fa-home'),
        new FinanceModel.Category('fun', 'Fun', '#FEAF20', 'fa-birthday-cake'),
        new FinanceModel.Category('health', 'Health', '#d73814', 'fa-heartbeat'),
        new FinanceModel.Category('car', 'Car', '#47887E', 'fa-car'),
        new FinanceModel.Category('other', 'Other', '#7f7f84', 'fa-money'),
    ]);
}

function setNewSpending(state: SpendingState, spending: FinanceModel.EditSpendingCommand) {
    let spendingRow = null;

    if (spending !== null) {
        let category = prepareCategories().find(x => x.code === spending.category);
        spendingRow = new FinanceModel.Spending(category, spending.amount)
    }

    return state.set('spending.edit', spendingRow);
}

export let spendingStore = new SpendingStore(Dispatcher);