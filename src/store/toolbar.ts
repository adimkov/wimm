import { ipcRenderer } from 'electron';
import { List, Map } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as CalendarModel from '../model/calendar'

export type ToolbarState = Map<string, any>;

const minYear = 2016;
const currentDate = new Date();

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
            case Actions.setPrevMonth:
                return setCalendarPrevMonth(state, this.getCalendarOptions());
            case Actions.setNextMonth:
                return setCalendarNextMonth(state, this.getCalendarOptions());
        }

        return state;
    }

    getCalendarOptions() {
        let options = new CalendarModel.SelectedDate();
        options.year = this.getState().get('calendar.year') as number;
        options.month = this.getState().get('calendar.month') as number;
        
        if (options.year === undefined) {
            options.year = currentDate.getFullYear();
        }

        if (options.month === undefined) {
            options.month = currentDate.getMonth();
        }

        return options;
    }

    getYears() {
        let years = new Array<number>();
        let currentYear = new Date().getFullYear();
        for(let i = minYear; i <= currentYear; i ++) {
            years.push(i)
        }

        return years;
    }

    getIsPrevMonthDisabled() {
        let calendarOptions = this.getCalendarOptions();
        return calendarOptions.year == minYear && calendarOptions.month == CalendarModel.Months.January;
    }

     getIsNextMonthDisabled() {
        let calendarOptions = this.getCalendarOptions();
        return calendarOptions.year == currentDate.getFullYear() && calendarOptions.month == currentDate.getMonth();
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

function setCalendarPrevMonth(state: ToolbarState, selectedDate: CalendarModel.SelectedDate) {
    if (selectedDate.year >= minYear) {
        if (selectedDate.month == CalendarModel.Months.January) {
            state = setCalendarYear(state, selectedDate.year - 1);
            return setCalendarMonth(state, CalendarModel.Months.December);
        }
        else {
            return setCalendarMonth(state, selectedDate.month - 1);
        }
    }

    return state;
}

function setCalendarNextMonth(state: ToolbarState, selectedDate: CalendarModel.SelectedDate) {
    if (selectedDate.year <= currentDate.getFullYear()) {
        if (selectedDate.month == CalendarModel.Months.December) {
            state = setCalendarYear(state, selectedDate.year + 1);
            return setCalendarMonth(state, CalendarModel.Months.January);
        }
        else {
            return setCalendarMonth(state, selectedDate.month + 1);
        }
    }

    return state;
}

export let toolbarStore = new ToolbarStore(Dispatcher);