import { ipcRenderer } from 'electron';
import { List, Map } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as CalendarModel from '../model/calendar'

export type ToolbarState = Map<string, any>;

class ToolbarStore extends IpcReduceStore<ToolbarState, Action<any>> {
    getInitialState() {
        return Map<string, any>();
    }
     
    reduce(state: ToolbarState, action: Action<any>) {
        switch(action.type) {
            case Actions.setCalendarYear:
                return setCalendarYear(state, Number.parseInt(action.payload));
            case Actions.setCalendarMonth:
                return setCalendarMonth(state, Number.parseInt(action.payload));
        }

        return state;
    }

    getCalendarOptions() {
        let options = new CalendarModel.SelectedDate();
        options.year = this.getState().get('calendar.year') as number;
        options.month = this.getState().get('calendar.month') as number;
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

function setCalendarYear(state: ToolbarState, year: number) {
    return state.set('calendar.year', year);
}

function setCalendarMonth(state: ToolbarState, month: number) {
    return state.set('calendar.month', month);
}

export let toolbarStore = new ToolbarStore(Dispatcher);