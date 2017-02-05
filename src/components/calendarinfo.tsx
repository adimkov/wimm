import * as React from 'react';
import { List, Map, Record } from 'immutable';

import ReactResizeDetector from 'react-resize-detector';
import { Container } from './container';
import { Months, SelectedDate } from '../model/calendar'
import { financeStore } from '../store/finance';
import { toolbarStore } from '../store/toolbar';
import { Actions } from '../action/action';
import { CalendarMonthCellSpendingRow, CalendarMonthCellTotal } from './calendar';
import * as FinanceModel from '../model/finance';
import { calculateRowHeight } from '../services/calendarcalculator';

interface CalendarInfoProps {
    year: number;
    month: Months;
    monthlySpendingStatistic: FinanceModel.CalendarMonthlyStatistic;
}

interface CalendarState {
    browserHeight: number;
}

class CalendarInfo extends React.Component<CalendarInfoProps, CalendarState> {
    constructor(props?: CalendarInfoProps, context?: any) {
        super(props, context);
        this.state = {browserHeight: document.body.clientHeight};
    }
    
    onResize(width: number, height: number) {
        this.setState({browserHeight: height});
    }

    render() {
        const statisticsRows = this.props.monthlySpendingStatistic.weeksSpending.map((x, i) => 
            <CalendarWeekMonthInfo 
                key={i}
                generateMonthCell={i == 0}
                weeksCount={this.props.monthlySpendingStatistic.weeksSpending.count()}
                monthTotal={this.props.monthlySpendingStatistic.monthSpending}
                weekTotal={x}
                rowHeight={calculateRowHeight(this.state.browserHeight, this.props.monthlySpendingStatistic.weeksSpending.count())}/>);

        return (
            <div className='calendar-info'>
                <ReactResizeDetector handleHeight onResize={ this.onResize.bind(this) } />
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
    monthTotal: List<FinanceModel.Spending>;
    weekTotal: List<FinanceModel.Spending>;
    rowHeight: number;
}

class CalendarWeekMonthInfo extends React.Component<CalendarWeekMonthInfoProps, void> {
    constructor(props?: CalendarWeekMonthInfoProps, context?: any) {
            super(props, context);
    }
    
    render() {
        let monthTotal = null;
        if (this.props.generateMonthCell) {
            let weekSpendingRows = this.props.monthTotal.map((x, i) => 
                <CalendarMonthCellSpendingRow key={i} amount={x.amount} category={x.category.name} color={x.category.color} icon={x.category.icon} />
            );

            monthTotal = (
                <td rowSpan={this.props.weeksCount} className='monthTotal'>
                    {weekSpendingRows}
                    <CalendarMonthCellTotal sum={this.props.monthTotal.reduce((p, n) => p + Number.parseFloat(n.amount.toString()), 0)}/>
                </td>
            )
        }
        
        let weekSpendingRows = this.props.weekTotal.map((x, i) => 
            <CalendarMonthCellSpendingRow key={i} amount={x.amount} category={x.category.name} color={x.category.color} icon={x.category.icon} />
        );
        
        
        let weekSpendingTotalElement = null;
        if (this.props.weekTotal.count() > 0)
        {
            weekSpendingTotalElement = <CalendarMonthCellTotal sum={this.props.weekTotal.reduce((p, n) => p + Number.parseFloat(n.amount.toString()), 0)}/>
        }
        

        const rowStyle = {
            height: this.props.rowHeight
        }

        return (
            <tr style={rowStyle}>
                <td className='weekTotal'>
                    {weekSpendingRows}
                    {weekSpendingTotalElement}
                </td>
                {monthTotal}
            </tr>
            )
    }
}

interface CalendarContainerState {
    ribbonCalendarState: SelectedDate;
    monthlySpendingStatistic: FinanceModel.CalendarMonthlyStatistic;
}

export default class CalendarInfoContainer extends Container<void, CalendarContainerState> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }

    getStores() {
        return [financeStore, toolbarStore];
    }

    calculateState() {
        let ribbonCalendarState = toolbarStore.getCalendarOptions();
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