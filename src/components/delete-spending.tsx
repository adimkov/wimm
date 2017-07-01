import * as React from 'react';

import { Container } from './container';
import { spendingStore } from '../store/spending';
import { Category } from '../model/finance';
import { Actions } from '../action/action';

interface DeleteSpendingProp {
    date: Date,
    category: Category,
    amount: number
}

class DeleteSpending extends React.Component<DeleteSpendingProp, {}> {
    constructor(props?: DeleteSpendingProp, context?: any) {
            super(props, context);
   }

    closeSpending(e: React.SyntheticEvent<any>) {
        Actions.closeSidebar();
        e.preventDefault();
    }

    deleteSpending(e: React.SyntheticEvent<any>) {
        Actions.deleteSpending(this.props.date, this.props.category.code, this.props.amount);
        Actions.closeSidebar();
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <p>Are you sure you want to delete spending for date: {this.props.date.toLocaleDateString()}</p>
                <form>
                    <div className='form-group'>
                        <label>Category</label>
                        <div className='form-control'>
                            <div className='categoryOption'>
                                <div className='color' style={{backgroundColor: this.props.category.color}}></div>
                                <div className='text'>
                                    {this.props.category.name}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label>Spending</label>
                        <div className='form-control'>{this.props.amount.toFixed(2)}</div>
                    </div>
                    <div className='btn-group btn-group-justified'>
                         <div className='btn-group'>
                            <button className='btn btn-default' onClick={this.closeSpending.bind(this)}>Cancel</button>
                         </div>
                         <div className='btn-group'>
                            <button className='btn btn-danger' onClick={this.deleteSpending.bind(this)}>Delete</button>
                        </div>
                    </div>
                </form>
            </div>)
    }
}

interface DeleteSpendingContainerState {
    date: Date,
    category: Category,
    amount: number
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
            date: this.props.date,
            category: spendingStore.getCategory(this.props.category),
            amount: this.props.amount
        }
    }

    render() {
        return <DeleteSpending date={this.state.value.date} category={this.state.value.category} amount={this.state.value.amount}/>;
    }
}

