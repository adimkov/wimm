import { ipcRenderer } from 'electron';
import { List, Map } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import { SidebarCommand } from '../model/sidebar';


export type SidebarState = Map<string, any>;


class SidebarStore extends IpcReduceStore<SidebarState, Action<any>> {
    getInitialState() {
        return Map<string, any>();
    }
     
    reduce(state: SidebarState, action: Action<any>) {
        switch(action.type) {
            case Actions.showEditSpendingDialog:
                return openSidebar(state, new SidebarCommand('addSpending', action.payload));
            case Actions.showDeleteSpending:
                return openSidebar(state, new SidebarCommand('deleteSpending', action.payload));
            case Actions.closeSidebar:
                return closeSidebar(state);
        }

        return state;
    }

    getSidebarContent(): SidebarCommand<any> {
        return this.getState().get('sidebar'); 
    }

    registerIpcRenderer() {
    }
}

function openSidebar(state: SidebarState, command: SidebarCommand<any>) {
    return state.set('sidebar', command);
}

function closeSidebar(state: SidebarState) {
    return state.remove('sidebar');
}

export let sidebarStore = new SidebarStore(Dispatcher);