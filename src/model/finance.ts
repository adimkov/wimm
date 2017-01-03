import { List, Map, Record } from 'immutable';

export class Spending extends Record({category: null, amount: 0}) {
    category: Category;
    amount: number;
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

export class NewSpending extends Record({category: '', amount: 0, date: Date}) {
    public category: string;
    public amount: number;
    public date: Date;

    constructor(category: string, amount: number, date: Date) {
        super({'category': category, 'amount': amount, 'date': date});
    }
}