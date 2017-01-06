import * as React from 'react';
import { List } from 'immutable';

import { Dropdown, DropdownOption } from './elements/dropdown';
import { Container } from './container';
import { spendingStore } from '../store/spending';
import { Category, Spending } from '../model/finance';
import { Actions } from '../action/action';

class AddSpendingProp {
    date: Date;
    categories: List<Category>;
    currentEdit: Spending;
}

class AddSpendingContainerState {
    categories: List<Category>;
    currentEdit: Spending;
}

class AddSpendingContainerParam {
    date: Date;
}

class AddSpending extends React.Component<AddSpendingProp, void> {
    constructor(props?: AddSpendingProp, context?: any) {
            super(props, context);
    }

    setCategory(category: string) {
        Actions.setEditSpending(category, this.props.currentEdit.amount, this.props.date);
    }

    updateAmount(e: React.SyntheticEvent<any>) {
        Actions.setEditSpending(this.props.currentEdit.category.code, e.currentTarget.value, this.props.date);
    }

    closeSpending(e: React.SyntheticEvent<any>) {
        Actions.cleanEditSpending();
        Actions.closeSidebar();
        e.preventDefault();
    }

    commitSpending(e: React.SyntheticEvent<any>) {
        Actions.CommitSpending(this.props.currentEdit.category, this.props.currentEdit.amount, this.props.date)
        Actions.cleanEditSpending();
        Actions.closeSidebar();
        e.preventDefault();
    }

    render() {
        let categories = this.props.categories.map(x => 
            <DropdownOption key={x.code} value={x.code}>
                <CategoryOption name={x.name} color={x.color}/>
            </DropdownOption>
        );

        return (
            <div>
                Add new spending for date: {this.props.date.toLocaleDateString()}
                <form>
                    <div className='form-group'>
                        <label htmlFor="year">Category</label>
                        <Dropdown id='category' selectedValue={this.props.currentEdit.category.code} onSelect={this.setCategory.bind(this)}>
                            {categories}
                        </Dropdown>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="spending">Spending</label>
                        <input id='spending' type='number' value={this.props.currentEdit.amount} onChange={this.updateAmount.bind(this)} className='form-control'/>
                    </div>
                    <div className='btn-group btn-group-justified'>
                         <div className='btn-group'>
                            <button className='btn btn-default' onClick={this.closeSpending.bind(this)}>Cancel</button>
                         </div>
                         <div className='btn-group'>
                            <button className='btn btn-primary' onClick={this.commitSpending.bind(this)}>Save</button>
                        </div>
                    </div>
                </form>
            </div>)
    }
}

class CategoryOptionProp {
    name: string;
    color: string;
}

class CategoryOption extends React.Component<CategoryOptionProp, void> {
    constructor(props?: CategoryOptionProp, context?: any) {
            super(props, context);
    }

    render() {
        let colorStyle = {backgroundColor: this.props.color}
        return (
            <div className='categoryOption'>
                <div className='color' style={colorStyle}></div>
                <div className='text'> {this.props.name}</div>
            </div>);
    }
}

export default class AddSpendingContainer extends Container<AddSpendingContainerParam, AddSpendingContainerState> {
    constructor(props?: AddSpendingContainerParam, context?: any) {
        super(props, context);
    }

    getStores() {
        return [spendingStore];
    }

    calculateState() {
        return {
            categories: spendingStore.getCategories(),
            currentEdit: spendingStore.getCurrentlyEditSpending()
            
        }
    }

    render() {
        return <AddSpending date={this.props.date} categories={this.state.value.categories} currentEdit={this.state.value.currentEdit}/>;
    }
}

