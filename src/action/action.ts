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

    static ribbonCalendarSetYear(year: number) {
        dispatcher.dispatch(new Action(Actions.ribbonCalendarSetYear, year));
    }

    static ribbonCalendarSetMonth(month: CalendarModel.Months) {
        dispatcher.dispatch(new Action(Actions.ribbonCalendarSetMonth, month));
    }

    static showNewSpendingDialog(date: Date) {
        dispatcher.dispatch(new Action(Actions.showNewSpendingDialog, date));
    }

    static closeSidebar() {
        dispatcher.dispatch(new Action(Actions.closeSidebar, null));
    }

    static setNewSpending(categoryCode: string, amount: number, date: Date) {
        dispatcher.dispatch(new Action(Actions.setNewSpending, new Finance.NewSpending(categoryCode, amount, date)));
    }
}