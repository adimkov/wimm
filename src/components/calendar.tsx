import * as React from 'react';
import * as c from 'calendar'

import { Container } from './container';
import { Months, RibbonCalendarState } from '../model/calendar'
import { financeStore } from '../store/finance';
import { appStore } from '../store/appState';


class CalendarProps {
    year: number;
    month: Months;
}

class CalendarMonthCellProp {
    date: Date;
    targetMonth: Months;
}

class CalendarMonthWeekRowProps{
    week: Array<Date>;
    targetMonth: Months;
}

class Calendar extends React.Component<CalendarProps, void> {
    constructor(props?: CalendarProps, context?: any) {
            super(props, context);
    }

    render() {
        let calendar = new c.Calendar(1);
        let weekDates = calendar.monthDates(this.props.year, this.props.month);
        
        let calendarTable = weekDates.map((dates, index) => <CalendarMonthWeekRow key={index} week={dates} targetMonth={this.props.month}/>);
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

class CalendarMonthWeekRow extends React.Component<CalendarMonthWeekRowProps, void> {
    constructor(props?: CalendarMonthWeekRowProps, context?: any) {
        super(props, context);
    }

     render() {
        var week = this.props.week.map((day, index) => <CalendarMonthCell key={index} date={day} targetMonth={this.props.targetMonth}/>)
        return (
            <tr>{ week }</tr>
        )
    }
}

class CalendarMonthCell extends React.Component<CalendarMonthCellProp, void> {
    constructor(props?: CalendarMonthCellProp, context?: any) {
        super(props, context);
    }

    render() {
        let cellClass = '';
        let isCurrentMonth = this.props.date.getMonth() !== this.props.targetMonth; 
        let addButton = (
            <button type='button' className='btn btn-outline-primary btn-sm pull-right'>
                <i className='fa fa-plus' aria-hidden="true"></i>
            </button>);

        if (isCurrentMonth) {
            cellClass += 'mute';
            addButton = '';
        }

        return (
            <td className={cellClass}>
                <div className='cell-outer'>
                    <div className='cell-top'><p>{this.props.date.getDate()}</p></div>
                    <div className='cell-container'></div>
                    <div className='cell-bottom'>
                        {addButton}
                    </div>
                </div>
            </td>
        )
    }
}

interface CalendarContainerState {
    ribbonCalendarState: RibbonCalendarState;
} 

export default class CalendarContainer extends Container<void, CalendarContainerState> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }

    getStores() {
        return [financeStore, appStore];
    }

    calculateState() {
        return {
            ribbonCalendarState: appStore.getRibbonCalendarOptions()
        }
    }

    render() {
        return <Calendar year={this.state.value.ribbonCalendarState.year} month={this.state.value.ribbonCalendarState.month}/>;
    }
}
