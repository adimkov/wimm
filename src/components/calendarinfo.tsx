import * as React from 'react';
import { List, Map, Record } from 'immutable';

import { Container } from './container';
import { Months, RibbonCalendarState } from '../model/calendar'
import { financeStore } from '../store/finance';
import { ribbonStore } from '../store/ribbon';
import { Actions } from '../action/action';
import * as FinanceModel from '../model/finance';

interface CalendarInfoProps {
    year: number;
    month: Months;
    monthlySpendingStatistic: FinanceModel.CalendarMonthlyStatistic;
}

class CalendarInfo extends React.Component<CalendarInfoProps, void> {
    constructor(props?: CalendarInfoProps, context?: any) {
            super(props, context);
    }
    
    render() {
        const statisticsRows = this.props.monthlySpendingStatistic.weekSpending.map((x, i) => 
            <CalendarWeekMonthInfo 
                key={i}
                generateMonthCell={i == 0}
                weeksCount={this.props.monthlySpendingStatistic.weekSpending.count()}
                monthTotal={this.props.monthlySpendingStatistic.monthSpending}
                weekTotal={x}/>);

        return (
            <div className='calendar-info'>
                <table>
                    <thead>
                        <tr>
                            <th>Week</th>
                            <th>Month</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statisticsRows}
                    </tbody>
                </table>
            </div>)
    }
}

interface CalendarWeekMonthInfoProps {
    generateMonthCell: boolean;
    weeksCount: number;
    monthTotal: number;
    weekTotal: number;
}

class CalendarWeekMonthInfo extends React.Component<CalendarWeekMonthInfoProps, void> {
    constructor(props?: CalendarWeekMonthInfoProps, context?: any) {
            super(props, context);
    }
    
    render() {
        let monthTotal = null;
        if (this.props.generateMonthCell) {
            monthTotal = <td rowSpan={this.props.weeksCount} className='monthTotal'>{this.props.monthTotal}</td>
        }
        

        return (
            <tr>
                <td className='weekTotal'>{this.props.weekTotal}</td>
                {monthTotal}
            </tr>
            )
    }
}

interface CalendarContainerState {
    ribbonCalendarState: RibbonCalendarState;
    monthlySpendingStatistic: FinanceModel.CalendarMonthlyStatistic;
}

export default class CalendarInfoContainer extends Container<void, CalendarContainerState> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }

    getStores() {
        return [financeStore, ribbonStore];
    }

    calculateState() {
        let ribbonCalendarState = ribbonStore.getRibbonCalendarOptions();
        return {
            ribbonCalendarState: ribbonCalendarState,
            monthlySpendingStatistic: financeStore.getSpendingStatisticForCalendar(ribbonCalendarState.year, ribbonCalendarState.month)
        }
    }

    render() {
        return <CalendarInfo 
            year={this.state.value.ribbonCalendarState.year} 
            month={this.state.value.ribbonCalendarState.month}
            monthlySpendingStatistic={this.state.value.monthlySpendingStatistic}/>;
    }
}