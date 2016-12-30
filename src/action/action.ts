import dispatcher from '../dispatcher';
import * as CalendarModel from '../model/calendar';

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
}