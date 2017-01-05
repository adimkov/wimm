import { List, Map, Record } from 'immutable';

export class Spending extends Record({category: null, amount: 0}) {
    category: Category;
    amount: number;

    constructor(category: Category, amount: number) {
        super({category: category, amount: amount});
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
}

export interface CommitSpendingCommand {
    category: Category;
    amount: number;
    date: Date;
}

export interface EditSpendingCommand {
    category: string;
    amount: number;
    date: Date;
}