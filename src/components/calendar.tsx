import * as React from 'react';
import * as c from 'calendar'
import { List, Map, Record } from 'immutable';

import { Container } from './container';
import { Months, RibbonCalendarState } from '../model/calendar'
import { financeStore } from '../store/finance';
import { ribbonStore } from '../store/ribbon';
import { Actions } from '../action/action';
import * as FinanceModel from '../model/finance';

class CalendarProps {
    year: number;
    month: Months;
    weeklySpending: List<Map<Date, List<FinanceModel.Spending>>>;
}

class Calendar extends React.Component<CalendarProps, void> {
    constructor(props?: CalendarProps, context?: any) {
            super(props, context);
    }

    render() {
        let calendar = new c.Calendar(1);
        let weekDates = calendar.monthDates(this.props.year, this.props.month);
        
        let calendarTable = weekDates.map((dates, index) => {
            return <CalendarMonthWeekRow 
                    key={index} 
                    week={dates} 
                    targetMonth={this.props.month}
                    weekSpending={this.props.weeklySpending.get(index)}
            />});
        
        return (
        <div className='calendar'>
            <table>
                <thead>
                    <tr>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                    </tr>
                </thead>
                <tbody>
                    { calendarTable }
                </tbody>
            </table>
        </div>)
    }
}

class CalendarMonthWeekRowProps{
    week: Array<Date>;
    targetMonth: Months;
    weekSpending: Map<Date, List<FinanceModel.Spending>>;

}

class CalendarMonthWeekRow extends React.Component<CalendarMonthWeekRowProps, void> {
    constructor(props?: CalendarMonthWeekRowProps, context?: any) {
        super(props, context);
    }

     render() {
        var week = this.props.week.map((day, index) => 
            <CalendarMonthCell 
                key={index} 
                date={day} 
                targetMonth={this.props.targetMonth}
                daySpending={this.props.weekSpending.get(day)} 
            />)
        return (
            <tr>{ week }</tr>
        )
    }
}

class CalendarMonthCellProp {
    date: Date;
    targetMonth: Months;
    daySpending: List<FinanceModel.Spending>;
}

class CalendarMonthCell extends React.Component<CalendarMonthCellProp, void> {
    constructor(props?: CalendarMonthCellProp, context?: any) {
        super(props, context);
    }

    addSpending(e: React.SyntheticEvent<Element>) {
        e.stopPropagation();
        Actions.showEditSpendingDialog(this.props.date);
    }

    render() {
        let cellClass = '';
        let isCurrentMonth = this.props.date.getMonth() !== this.props.targetMonth; 
        let addButton = (
            <button type='button' className='btn btn-outline-primary btn-sm pull-right' onClick={this.addSpending.bind(this)}>
                <i className='fa fa-plus' aria-hidden="true"></i>
            </button>);

        if (isCurrentMonth) {
            cellClass += 'mute';
            addButton = '';
        }

        let spendings = this.props.daySpending.map((x, i) => 
            <CalendarMonthCellSpendingRow 
                key={`${this.props.date.getDate()}_${i}`}
                category={x.category.name} 
                color={x.category.color} 
                icon={x.category.icon} 
                amount={x.amount}/>)

        return (
            <td className={cellClass}>
                <div className='cell-outer'>
                    <div className='cell-top'><p>{this.props.date.getDate()}</p></div>
                    <div className='cell-container'>
                        {spendings}
                    </div>
                    <div className='cell-bottom'>
                        {addButton}
                    </div>
                </div>
            </td>
        )
    }
}

class CalendarMonthCellSpendingRowProp {
    category: string;
    color: string;
    icon: string;
    amount: number;
} 

class CalendarMonthCellSpendingRow extends React.Component<CalendarMonthCellSpendingRowProp, void> {
    constructor(props?: CalendarMonthCellSpendingRowProp, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <div>
                {this.props.category}:{this.props.amount}
        </div>);
    }
}

interface CalendarContainerState {
    ribbonCalendarState: RibbonCalendarState;
    weeklySpending: List<Map<Date, List<FinanceModel.Spending>>>;
} 

export default class CalendarContainer extends Container<void, CalendarContainerState> {
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
            weeklySpending: financeStore.getSpendingsPerWeek(ribbonCalendarState.year, ribbonCalendarState.month)
        }
    }

    render() {
        return <Calendar 
            year={this.state.value.ribbonCalendarState.year} 
            month={this.state.value.ribbonCalendarState.month}
            weeklySpending={this.state.value.weeklySpending}/>;
    }
}
