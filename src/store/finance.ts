import { ipcRenderer } from 'electron';
import { List, Map, Record } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import { Category } from '../model/finance';

export type FinanceState = Map<string, any>;

class FinanceStore extends IpcReduceStore<FinanceState, Action<any>> {
    getInitialState() {
        return Map<string, any>({
            'categories': prepareCategories()
        });
    }
     
    reduce(state: FinanceState, action: Action<any>) {
        return state;
        
    }

    registerIpcRenderer() {
    }

    getCategories(): List<Category> {
        return this.getState().get('categories');
    }
}

function prepareCategories(): List<Category> {
    return List<Category>([
        new Category({code:'food', name:'Food', color: 'green', icon:'fa-cutlery'}),
        new Category({code:'home', name:'Home', color: 'blue', icon:'fa-home'}),
        new Category({code:'fun', name:'Fun', color: 'yellow', icon:'fa-birthday-cake'}),
        new Category({code:'health', name:'Health', color: 'red', icon:'fa-heartbeat'}),
        new Category({code:'other', name:'Other', color: 'gray', icon:'fa-money'}),
    ]);
}

export let financeStore = new FinanceStore(Dispatcher);