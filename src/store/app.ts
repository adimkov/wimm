import { ipcRenderer } from 'electron';
import { List, Map } from 'immutable';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as CalendarModel from '../model/calendar'
import { SidebarCommand } from '../model/sidebar';
import * as FinanceModel from '../model/finance';


export type AppState = Map<string, any>;


class AppStore extends IpcReduceStore<AppState, Action<any>> {
    getInitialState() {
        return Map<string, any>({
            'categories': prepareCategories()
        });
    }
     
    reduce(state: AppState, action: Action<any>) {
        switch(action.type) {
            case Actions.activateRibbonTab:
                return setActiveRibbonTab(state, action.payload);
            case Actions.ribbonCalendarSetYear:
                return setRibbonCalendarSetYear(state, Number.parseInt(action.payload));
            case Actions.ribbonCalendarSetMonth:
                return setRibbonCalendarSetMonth(state, Number.parseInt(action.payload));
            case Actions.showEditSpendingDialog:
                return openSidebar(state, new SidebarCommand('addSpending', action.payload));
            case Actions.setEditSpending:
                return setNewSpending(state, action.payload as FinanceModel.EditSpendingCommand);
            case Actions.cleanEditSpending:
                return setNewSpending(state, null);
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
        new FinanceModel.Category('food', 'Food', 'green', 'fa-cutlery'),
        new FinanceModel.Category('home', 'Home', 'blue', 'fa-home'),
        new FinanceModel.Category('fun', 'Fun', 'yellow', 'fa-birthday-cake'),
        new FinanceModel.Category('health', 'Health', 'red', 'fa-heartbeat'),
        new FinanceModel.Category('other', 'Other', 'gray', 'fa-money'),
    ]);
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

function setNewSpending(state: AppState, spending: FinanceModel.EditSpendingCommand) {
    let spendingRow = null;

    if (spending !== null) {
        let category = prepareCategories().find(x => x.code === spending.category);
        spendingRow = new FinanceModel.Spending(category, spending.amount)
    }

    return state.set('spending.edit', spendingRow);
}

export let appStore = new AppStore(Dispatcher);