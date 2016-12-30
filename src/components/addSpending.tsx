import * as React from 'react';

import { Container } from './container';
import { financeStore } from '../store/finance';

class AddSpendingProp {
    date: Date;
}

export class AddSpending extends React.Component<AddSpendingProp, void> {
    constructor(props?: AddSpendingProp, context?: any) {
            super(props, context);
    }

    render() {
        return (
            <div>
                Add new spending for date: {this.props.date.toLocaleDateString()}
                <form>
                    <div className='form-group row'>
                        <label htmlFor="year" className="col-sm-2 col-form-label">Year</label>
                        <div className="col-sm-10">
                           <input type='test' className='form-control'/>
                        </div>
                    </div>
                </form>
            </div>)
    }
}
