import { ipcRenderer } from 'electron';
import { List, Map, Record } from 'immutable';
import * as c from 'calendar'

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as FinanceModel from '../model/finance';

export type FinanceState = Map<Date, List<FinanceModel.Spending>>;

class FinanceStore extends IpcReduceStore<FinanceState, Action<any>> {
    getInitialState() {
        return Map<Date, List<FinanceModel.Spending>>();
    }
     
    getSpendings(year: number, month: number): Map<Date, List<FinanceModel.Spending>> {
        return this.getState().takeWhile((val, key) => key.getFullYear() === year && key.getMonth() === month).toMap();
    }

    getSpendingsPerWeek(year: number, month: number): List<Map<Date, List<FinanceModel.Spending>>> {
        var calendar = new c.Calendar(1);
        var weeks = calendar.monthDates(year, month);
        let weekSpendings = List<Map<Date, List<FinanceModel.Spending>>>().asMutable();
        
        for(let week of weeks) {
            var daySpending = Map<Date, List<FinanceModel.Spending>>().asMutable();
            for(let day of week) {
                daySpending.set(day, this.getState().get(day) || List<FinanceModel.Spending>());
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
                day.forEach(x => dayTotal += Number.parseInt(x.amount.toString())); // in store all stored as a string
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
        }
        return state;
        
    }

    registerIpcRenderer() {
    }
}

function commitSpending(state: FinanceState, command: FinanceModel.CommitSpendingCommand) {
    command.date.setHours(0, 0, 0, 0);
    let spendings = state.get(command.date) as List<FinanceModel.Spending> || List<FinanceModel.Spending>()
    
    return state.set(command.date, spendings.push(new FinanceModel.Spending(command.category, command.amount)));
}

export let financeStore = new FinanceStore(Dispatcher);