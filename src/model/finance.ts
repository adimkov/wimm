import { List, Map, Record } from 'immutable';

export class Spending extends Record({category: null, amount: 0}) {
    category: Category;
    amount: number | string;

    constructor(category: Category, amount: number | string) {
        super({category: category, amount: amount});
    }

    setAmount(amount: number | string) {
        return new Spending(this.category, amount);
    }
}

export class Category extends Record({code:'', name: '', color:'', icon:''}) {
    public code: string;
    public name: string;
    public color: string;
    public icon: string;

    constructor(code: string, name: string, color: string, icon: string) {
        super({'code': code, 'name': name, 'color': color, 'icon': icon});
    }
    
    static fromMap(data: Map<string, string>): Category {
        return new Category(data.get('code'), data.get('name'), data.get('color'), data.get('icon'))
    }
}

export interface CalendarMonthlyStatistic {
    weekSpending: List<number>;
    monthSpending: number;
}

export interface CommitSpendingCommand {
    category: Category;
    amount: number;
    date: Date;
}

export interface EditSpendingCommand {
    category: string;
    amount: number | string;
    date: Date;
}