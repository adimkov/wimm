import * as React from 'react';
import { List } from 'immutable';

import { Dropdown, DropdownOption } from './elements/dropdown';
import { Container } from './container';
import { appStore } from '../store/app';
import { Category, NewSpending } from '../model/finance';
import { Actions } from '../action/action';

class AddSpendingProp {
    date: Date;
    categories: List<Category>;
    currentEdit: NewSpending;
}

class AddSpendingContainerState {
    categories: List<Category>;
    currentEdit: NewSpending;
}

class AddSpendingContainerParam {
    date: Date;
}

class AddSpending extends React.Component<AddSpendingProp, void> {
    constructor(props?: AddSpendingProp, context?: any) {
            super(props, context);
    }

    setCategory(category: string) {
        Actions.setNewSpending(category, 0, this.props.date);
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
                        <Dropdown id='category' selectedValue={this.props.currentEdit.category} onSelect={this.setCategory.bind(this)}>
                            {categories}
                        </Dropdown>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="spending">Spending</label>
                        <input id='spending' type='number' className='form-control'/>
                    </div>
                    <div className='btn-group btn-group-justified'>
                         <div className='btn-group'>
                            <button className='btn btn-default'>Cancel</button>
                         </div>
                         <div className='btn-group'>
                            <button className='btn btn-primary'>Save</button>
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
        return [appStore];
    }

    calculateState() {
        return {
            categories: appStore.getCategories(),
            currentEdit: appStore.getCurrentlyEditSpending()
            
        }
    }

    render() {
        return <AddSpending date={this.props.date} categories={this.state.value.categories} currentEdit={this.state.value.currentEdit}/>;
    }
}

