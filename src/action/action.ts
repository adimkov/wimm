import dispatcher from '../dispatcher';
import * as CalendarModel from '../model/calendar';
import * as Finance from '../model/finance';

export class Action<TPayload> {
    constructor(type: any, payload: TPayload) {
        this.type = type;
        this.payload = payload;
    }

    payload: TPayload;
    type: any;
}

export class Actions {
    static activateRibbonTab(name: string) {
        dispatcher.dispatch(new Action(Actions.activateRibbonTab, name));
    }

    static setCalendarYear(year: number) {
        dispatcher.dispatch(new Action(Actions.setCalendarYear, year));
    }

    static setCalendarMonth(month: CalendarModel.Months) {
        dispatcher.dispatch(new Action(Actions.setCalendarMonth, month));
    }

    static setPrevMonth() {
        dispatcher.dispatch(new Action(Actions.setPrevMonth, null));
    }

    static setNextMonth() {
        dispatcher.dispatch(new Action(Actions.setNextMonth, null));
    }

    static showEditSpendingDialog(date: Date) {
        dispatcher.dispatch(new Action(Actions.showEditSpendingDialog, date));
    }

    static closeSidebar() {
        dispatcher.dispatch(new Action(Actions.closeSidebar, null));
    }

    static setEditSpending(categoryCode: string, amount: number | string, date: Date) {
        dispatcher.dispatch(new Action<Finance.EditSpendingCommand>(Actions.setEditSpending, {category: categoryCode, amount: amount, date: date}));
    }

    static cleanEditSpending() {
        dispatcher.dispatch(new Action(Actions.cleanEditSpending, null));
    }

    static spendingKeypadClick(symbol: string) {
        dispatcher.dispatch(new Action(Actions.spendingKeypadClick, symbol));
    }
    
    static spendingKeypadRelease() {
        dispatcher.dispatch(new Action(Actions.spendingKeypadRelease, null));
    }

    static CommitSpending(category: Finance.Category, amount: number, date: Date) {
        dispatcher.dispatch(new Action<Finance.CommitSpendingCommand>(Actions.CommitSpending, {category: category, amount: amount, date: date}));
    }
    
    static flushFinanceStore(){
        dispatcher.dispatch(new Action(Actions.flushFinanceStore, null));
    }
}