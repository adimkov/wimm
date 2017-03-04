import * as React from 'react';
import { Container } from './container';
import { Actions } from '../action/action';

class MonthChartProp {
}

class MonthChart extends React.Component<MonthChartProp, void> {
    constructor(props?: MonthChartProp, context?: any) {
            super(props, context);
    }


    render() {
        return (
            <div>
            </div>
        )
    }
}

class MonthChartContainerState {
}

export default class MonthChartContainer extends Container<void, MonthChartContainerState> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }

    getStores() {
        return [];
    }

    calculateState() {
        return {
        }
    }

    render() {
        return (
                <MonthChart/>
            );
    }
}

