import * as React from 'react';
import { List } from 'immutable';

import { Dropdown, DropdownOption } from './elements/dropdown';
import { Container } from './container';
import { financeStore } from '../store/finance';
import { Category } from '../model/finance';


class AddSpendingProp {
    date: Date;
    categories: List<Category>;
}

class AddSpendingContainerState {
    categories: List<Category>;
}

class AddSpendingContainerParam {
    date: Date;
}

class AddSpending extends React.Component<AddSpendingProp, void> {
    constructor(props?: AddSpendingProp, context?: any) {
            super(props, context);
    }

    render() {
        let categories = this.props.categories.map(x => 
            <DropdownOption key={x.code}>
                <CategoryOption name={x.name} color={x.color}/>
            </DropdownOption>
        );

        return (
            <div>
                Add new spending for date: {this.props.date.toLocaleDateString()}
                <form>
                    <div className='form-group'>
                        <label htmlFor="year">Category</label>
                        <Dropdown id='category' selectedKey='food'>
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
        return [financeStore];
    }

    calculateState() {
        return {
            categories: financeStore.getCategories()
        }
    }

    render() {
        return <AddSpending date={this.props.date} categories={this.state.value.categories}/>;
    }
}

