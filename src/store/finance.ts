import { ipcRenderer } from 'electron';
import { List, Map, Record } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import { Category } from '../model/finance';

export type FinanceState = Map<string, any>;

class FinanceStore extends IpcReduceStore<FinanceState, Action<any>> {
    getInitialState() {
        return Map<string, any>();
    }
     
    reduce(state: FinanceState, action: Action<any>) {
        return state;
        
    }

    registerIpcRenderer() {
    }
}

export let financeStore = new FinanceStore(Dispatcher);