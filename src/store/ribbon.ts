import { ipcRenderer } from 'electron';
import { List, Map } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as CalendarModel from '../model/calendar'

export type RibbonState = Map<string, any>;

class RibbonStore extends IpcReduceStore<RibbonState, Action<any>> {
    getInitialState() {
        return Map<string, any>();
    }
     
    reduce(state: RibbonState, action: Action<any>) {
        switch(action.type) {
            case Actions.activateRibbonTab:
                return setActiveRibbonTab(state, action.payload);
            case Actions.ribbonCalendarSetYear:
                return setRibbonCalendarSetYear(state, Number.parseInt(action.payload));
            case Actions.ribbonCalendarSetMonth:
                return setRibbonCalendarSetMonth(state, Number.parseInt(action.payload));
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

    registerIpcRenderer() {
    }
}

function setActiveRibbonTab(state: RibbonState, tabName: string) {
    return state.set('ribbon.activeTab', tabName);
}

function setRibbonCalendarSetYear(state: RibbonState, year: number) {
    return state.set('ribbon.calendar.year', year);
}

function setRibbonCalendarSetMonth(state: RibbonState, month: number) {
    return state.set('ribbon.calendar.month', month);
}

export let ribbonStore = new RibbonStore(Dispatcher);