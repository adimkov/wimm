import { ipcRenderer } from 'electron';
import { List, Map } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';

export type FinanceState = Map<Date, string>;


class FinanceStore extends IpcReduceStore<FinanceState, Action<any>> {
    getInitialState() {
        return Map<Date, string>();
    }
     
    reduce(state: FinanceState, action: Action<any>) {
        return state;
    }

    registerIpcRenderer() {
    }
}

export let financeStore = new FinanceStore(Dispatcher);