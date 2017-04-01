import * as React from 'react';

import { Container } from './container';
import { spendingStore } from '../store/spending';
import { Category, Spending } from '../model/finance';
import { Actions } from '../action/action';

interface DeleteSpendingProp {
    date: Date;
    category: string;
    amount: number;
}

class DeleteSpending extends React.Component<DeleteSpendingProp, void> {
    constructor(props?: DeleteSpendingProp, context?: any) {
            super(props, context);
   }

    closeSpending(e: React.SyntheticEvent<any>) {
        Actions.cleanEditSpending();
        Actions.closeSidebar();
        e.preventDefault();
    }


    render() {
        return (
            <div>
                <p>Are you sure you want to delete spending for date: {this.props.date.toLocaleDateString()}</p>
                <p>{this.props.category}: {this.props.amount}</p>
            </div>)
    }
}

interface DeleteSpendingContainerState {
}

interface DeleteSpendingContainerParam {
    date: Date;
    category: string;
    amount: number;
}

export default class DeleteSpendingContainer extends Container<DeleteSpendingContainerParam, DeleteSpendingContainerState> {
    constructor(props?: DeleteSpendingContainerParam, context?: any) {
        super(props, context);
    }

    getStores() {
        return [spendingStore];
    }

    calculateState() {
        return {
        }
    }

    render() {
        return <DeleteSpending date={this.props.date} category={this.props.category} amount={this.props.amount}/>;
    }
}

