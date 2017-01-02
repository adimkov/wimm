import { List, Map, Record } from 'immutable';

export class Spending extends Record({category: '', amount: 0}) {
    category: string;
    amount: number;
}

export class Category extends Record({code:'', name: '', color:'', icon:''}) {
    code: string;
    name: string;
    color: string;
    icon: string;
}