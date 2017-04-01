import { ipcRenderer } from 'electron';
import { List, Map, Record, Iterable, fromJS } from 'immutable';
import * as c from 'calendar';
import { homedir } from 'os'
import { writeFileSync, readFileSync, createWriteStream, createReadStream } from 'fs';
import { join } from 'path';
import * as zlip from 'zlib';

import { IpcReduceStore } from './ipcReduceStore';
import Dispatcher from '../dispatcher';
import {Action, Actions} from '../action/action';
import * as FinanceModel from '../model/finance';
import { formatDate, parseDateParts } from '../services/date';
import { Hash } from '../model/collection';

export type FinanceState = Map<string, List<FinanceModel.Spending>>;

const dbFileName = 'wimm_store.json';

class FinanceStore extends IpcReduceStore<FinanceState, Action<any>> {
    getInitialState() {
        let stateJson = readStore();
        return prepareState(stateJson);
    }
     
    getSpendings(year: number, month: number): Map<string, List<FinanceModel.Spending>> {
        return this.getState().filter((val, key) => {
            let date = parseDateParts(key);
            return date.getFullYear() === year && date.getMonth() === month;
        }).toMap();
    }

    getSpendingsPerWeek(year: number, month: number): List<Map<string, List<FinanceModel.Spending>>> {
        let calendar = new c.Calendar(1);
        let weeks = calendar.monthDates(year, month);
        let weekSpendings = List<Map<string, List<FinanceModel.Spending>>>().asMutable();
        
        for(let week of weeks) {
            let daySpending = Map<string, List<FinanceModel.Spending>>().asMutable();
            for(let day of week) {
                daySpending.set(formatDate(day), this.getState().get(formatDate(day), List<FinanceModel.Spending>()));
            }

            weekSpendings.push(daySpending.asImmutable());
        }

        return weekSpendings.asImmutable();
    }

    getSpendingStatisticForCalendar(year: number, month: number): FinanceModel.CalendarMonthlyStatistic {
        let spending = this.getSpendingsPerWeek(year, month);
        let weeksSpending = new Array<List<FinanceModel.Spending>>();
        let monthSpending = new Array<FinanceModel.Spending>();
        let monthCategoriesMap: {[code: string]: FinanceModel.Spending} = {};

        for (let weekData of spending.toArray()) {
            let weekSpending = List<FinanceModel.Spending>().asMutable();
            let categoriesMap = new Hash<FinanceModel.Spending>();
          
            for(let daySpendings of weekData.entrySeq().toArray()) {
                
                for (let spending of daySpendings[1] as Array<FinanceModel.Spending>) {
                    if (categoriesMap[spending.category.code] === undefined) {
                        categoriesMap[spending.category.code] = spending;
                    } 
                    else {
                        categoriesMap[spending.category.code] = categoriesMap[spending.category.code].addSpending(spending.amount);
                    }

                    if (parseDateParts(daySpendings[0]).getMonth() === month) {
                        if (monthCategoriesMap[spending.category.code] === undefined) {
                            monthCategoriesMap[spending.category.code] = spending;
                        } 
                        else {
                            monthCategoriesMap[spending.category.code] = monthCategoriesMap[spending.category.code].addSpending(spending.amount);
                        }
                    }
                }
            }

            for (let spending in categoriesMap) {
                weekSpending.push(categoriesMap[spending]);
            }

            weeksSpending.push(weekSpending);
        }
        
        for (let spending in monthCategoriesMap) {
                monthSpending.push(monthCategoriesMap[spending]);
        }

        return {
            weeksSpending: List(weeksSpending),
            monthSpending: List(monthSpending)
        };
    }

    getMonthChartData(year: number, month: number): Map<number, List<FinanceModel.Spending>> {
        let data = Map<number, List<FinanceModel.Spending>>().asMutable();
        let calendar = new c.Calendar(1);
        let dates = calendar.monthDates(year, month)
            .reduce((previous, current) => previous.concat(current))
            .filter(x => x.getMonth() === month);
        
        for (let day of dates) {
            let daySpendings = this.getState().get(formatDate(day), List<FinanceModel.Spending>());
            let aggregatedSpendings = new Hash<FinanceModel.Spending>();
            let spendings = List<FinanceModel.Spending>().asMutable();

            for (let spending of daySpendings.toArray()) {
                 if (aggregatedSpendings[spending.category.code] === undefined) {
                     aggregatedSpendings[spending.category.code] = spending;
                 }
                 else {
                     aggregatedSpendings[spending.category.code] = aggregatedSpendings[spending.category.code].addSpending(spending.amount);
                 }
            }

            for (let spending in aggregatedSpendings) {
                spendings.push(aggregatedSpendings[spending]);
            }

            data.set(day.getDate(), spendings.asImmutable());
        }        

        return data.asImmutable();
    }

    reduce(state: FinanceState, action: Action<any>) {
        switch(action.type) {
            case Actions.commitSpending:
                return commitSpending(state, action.payload as FinanceModel.CommitSpendingCommand);
            case Actions.deleteSpending:
                let command = action.payload as FinanceModel.DeleteSpendingCommand;
                return deleteSpending(state, command.date, command.category, command.amount);
            case Actions.flushFinanceStore:
                return flushStore(state);
            case "importState":
                return flushStore(action.payload as FinanceState);
        }

        return state;
    }

    registerIpcRenderer() {
        ipcRenderer.on('db-export', (event, fileName) => {
            exportDatabase(fileName);
        });

        ipcRenderer.on('db-import', (event, fineName) => {
            this.getDispatcher().dispatch(new Action("importState", importDatabase(fineName)));
        });
    }
}

function commitSpending(state: FinanceState, command: FinanceModel.CommitSpendingCommand) {
    let spendings = state.get(formatDate(command.date)) as List<FinanceModel.Spending> || List<FinanceModel.Spending>()
    
    return state.set(formatDate(command.date), spendings.push(new FinanceModel.Spending(command.category, command.amount)));
}

function flushStore(state: FinanceState) {
    writeFileSync(
        join(homedir(), dbFileName),
        JSON.stringify(state.toJS()), 
        {encoding: 'UTF-8'});
    return state;
}

function readStore(): Array<any> {
    let state = null;
    try {
        state = require(join(homedir(), dbFileName));
    }
    catch(ex){
    }

    return state;
}

function prepareState(stateJson):FinanceState {
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

function exportDatabase(path: string) {
    let zip = zlip.createGzip();
    var zipStream = createWriteStream(path);
    createReadStream(join(homedir(), dbFileName)).pipe(zip).pipe(createWriteStream(path));
}

function importDatabase(path: string) {
    let file = zlip.unzipSync(readFileSync(path)).toString('utf-8');
    return prepareState(JSON.parse(file));
}

function deleteSpending(state: FinanceState, date: Date, category: string, amount: number) {
    let daySpendings = state.get(formatDate(date), List<FinanceModel.Spending>());
    let spendingIndex = daySpendings.findIndex(x => x.category.code == category && x.amount == amount);

    if (spendingIndex > 0) {
        daySpendings = daySpendings.remove(spendingIndex);
        return state.set(formatDate(date), daySpendings);
    }
    else {
        return state;
    }
}

export let financeStore = new FinanceStore(Dispatcher);