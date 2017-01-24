import { ipcRenderer } from 'electron';
import { List, Map, Record, Iterable, fromJS } from 'immutable';
import * as c from 'calendar';
import homedir from '../services/homedir'; 
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as FinanceModel from '../model/finance';
import { formatDate, parseDateParts } from '../services/date';

export type FinanceState = Map<string, List<FinanceModel.Spending>>;

class FinanceStore extends IpcReduceStore<FinanceState, Action<any>> {
    getInitialState() {
        let stateJson = readStore();
        if (stateJson == null) {
            return Map<string, List<FinanceModel.Spending>>(); 
        }

        let state = fromJS(stateJson, (key, value) => {
            if (value.get('amount') != undefined) {
                let category = value.get('category');
                return new FinanceModel.Spending(FinanceModel.Category.fromMap(value.get('category')), value.get('amount'));
            }

            return Iterable.isIndexed(value) ? value.toList(): value.toMap();

        });

        return state;
    }
     
    getSpendings(year: number, month: number): Map<string, List<FinanceModel.Spending>> {
        return this.getState().takeWhile((val, key) => {
            let date = parseDateParts(key);
            return date.getFullYear() === year && date.getMonth() === month;
        }).toMap();
    }

    getSpendingsPerWeek(year: number, month: number): List<Map<string, List<FinanceModel.Spending>>> {
        var calendar = new c.Calendar(1);
        var weeks = calendar.monthDates(year, month);
        let weekSpendings = List<Map<string, List<FinanceModel.Spending>>>().asMutable();
        
        for(let week of weeks) {
            var daySpending = Map<string, List<FinanceModel.Spending>>().asMutable();
            for(let day of week) {
                daySpending.set(formatDate(day), this.getState().get(formatDate(day)) || List<FinanceModel.Spending>());
            }

            weekSpendings.push(daySpending.asImmutable());
        }

        return weekSpendings.asImmutable();
    }

    getSpendingStatisticForCalendar(year: number, month: number): FinanceModel.CalendarMonthlyStatistic {
        let spending = this.getSpendingsPerWeek(year, month);
        let weekSpending = new Array();
        let monthSpending = 0;
        for (let weekData of spending.toArray()) {
            let weekTotal = 0;
            for (let day of weekData.toArray()) {
                let dayTotal = 0;
                day.forEach(x => dayTotal += Number.parseFloat(x.amount.toString())); // in store all stored as a string
                weekTotal += dayTotal;
            }

            weekSpending.push(weekTotal);
            monthSpending += weekTotal;
        }

        return {
            weekSpending: List(weekSpending),
            monthSpending: monthSpending
        };
    }

    reduce(state: FinanceState, action: Action<any>) {
        switch(action.type) {
            case Actions.CommitSpending:
                return commitSpending(state, action.payload as FinanceModel.CommitSpendingCommand);
            case Actions.flushFinanceStore:
                return flushStore(state);
        }
        return state;
        
    }

    registerIpcRenderer() {
    }
}

function commitSpending(state: FinanceState, command: FinanceModel.CommitSpendingCommand) {
    let spendings = state.get(formatDate(command.date)) as List<FinanceModel.Spending> || List<FinanceModel.Spending>()
    
    return state.set(formatDate(command.date), spendings.push(new FinanceModel.Spending(command.category, command.amount)));
}

function flushStore(state: FinanceState) {
    writeFileSync(
        join(homedir(), 'wimm_store.json'),
        JSON.stringify(state.toJS()), 
        {encoding: 'UTF-8'});
    return state;
}

function readStore(): Array<any> {
    let state = null;
    try {
        state = require(join(homedir(), 'wimm_store.json'));
    }
    catch(ex){
    }

    return state;
}

export let financeStore = new FinanceStore(Dispatcher);