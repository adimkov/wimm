import { ipcRenderer } from 'electron';
import { List, Map } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as CalendarModel from '../model/calendar'
import { SidebarCommand } from '../model/sidebar';

export type AppState = Map<string, any>;


class AppStore extends IpcReduceStore<AppState, Action<any>> {
    getInitialState() {
        return Map<string, any>();
    }
     
    reduce(state: AppState, action: Action<any>) {
        switch(action.type) {
            case Actions.activateRibbonTab:
                return setActiveRibbonTab(state, action.payload);
            case Actions.ribbonCalendarSetYear:
                return setRibbonCalendarSetYear(state, Number.parseInt(action.payload));
            case Actions.ribbonCalendarSetMonth:
                return setRibbonCalendarSetMonth(state, Number.parseInt(action.payload));
            case Actions.showAddSpending:
                return openSidebar(state, new SidebarCommand('addSpending', action.payload));
            case Actions.closeSidebar:
                return closeSidebar(state);
        }

        return state;
    }

    getRibbonActiveTab(): string {
        let activeTab = this.getState().get('ribbon.activeTab');
        if (activeTab === undefined) {
            activeTab = 'calendar'
        }
        
        return activeTab;
    }

    getRibbonCalendarOptions() {
        let options = new CalendarModel.RibbonCalendarState();
        options.year = this.getState().get('ribbon.calendar.year') as number;
        options.month = this.getState().get('ribbon.calendar.month') as number;
        let data = new Date();
        
        if (options.year === undefined) {
            options.year = data.getFullYear();
        }

        if (options.month === undefined) {
            options.month = data.getMonth();
        }

        return options;
    }

    getSidebarContent(): SidebarCommand<any> {
        return this.getState().get('sidebar'); 
    }

    registerIpcRenderer() {
    }
}

function setActiveRibbonTab(state: AppState, tabName: string) {
    return state.set('ribbon.activeTab', tabName);
}

function setRibbonCalendarSetYear(state: AppState, year: number) {
    return state.set('ribbon.calendar.year', year);
}

function setRibbonCalendarSetMonth(state: AppState, month: number) {
    return state.set('ribbon.calendar.month', month);
}

function openSidebar(state: AppState, command: SidebarCommand<void>) {
    return state.set('sidebar', command);
}

function closeSidebar(state: AppState) {
    return state.remove('sidebar');
}

export let appStore = new AppStore(Dispatcher);