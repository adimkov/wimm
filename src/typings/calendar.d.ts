declare module 'calendar' {
    export class Calendar {
        constructor(firstWeekDay: number);
        monthDates(year: number, month: number): Array<Array<Date>>;
    }
}