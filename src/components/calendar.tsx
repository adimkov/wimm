import * as React from 'react';
import * as c from 'calendar'
import { List, Map, Record } from 'immutable';

import { Container } from './container';
import { Months, SelectedDate } from '../model/calendar'
import { financeStore } from '../store/finance';
import { toolbarStore } from '../store/toolbar';
import { Actions } from '../action/action';
import * as FinanceModel from '../model/finance';
import { formatDate } from '../services/date';
import ReactResizeDetector from 'react-resize-detector';
import { calculateRowHeight, calculateCellContainerHeight } from '../services/calendarcalculator';

interface CalendarProps {
    year: number;
    month: Months;
    weeklySpending: List<Map<string, List<FinanceModel.Spending>>>;
}

interface CalendarState {
    browserHeight: number;
}

class Calendar extends React.Component<CalendarProps, CalendarState> {
    constructor(props?: CalendarProps, context?: any) {
            super(props, context);
            this.state = {browserHeight: document.body.clientHeight};
    }

    onResize(width: number, height: number) {
        this.setState({browserHeight: height});
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
                    rowHeight = {calculateRowHeight(this.state.browserHeight, weekDates.length)}
            />});

        return (
                <div className='calendar'>
                    <ReactResizeDetector handleHeight onResize={ this.onResize.bind(this) } />
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

interface CalendarMonthWeekRowProps{
    week: Array<Date>;
    targetMonth: Months;
    weekSpending: Map<string, List<FinanceModel.Spending>>;
    rowHeight: number;
}

class CalendarMonthWeekRow extends React.Component<CalendarMonthWeekRowProps, void> {
    constructor(props?: CalendarMonthWeekRowProps, context?: any) {
        super(props, context);
    }

     render() {
        const today = new Date();
        const week = this.props.week.map((day, index) =>
            <CalendarMonthCell
                key={index}
                date={day}
                targetMonth={this.props.targetMonth}
                daySpending={this.props.weekSpending.get(formatDate(day))}
                rowHeight={this.props.rowHeight}
                isCurrentDate={day.getFullYear() == today.getFullYear() && day.getMonth() == today.getMonth() && day.getDate() == today.getDate()}
            />)
        return (
            <tr>{ week }</tr>
        )
    }
}

interface CalendarMonthCellProp {
    date: Date;
    targetMonth: Months;
    daySpending: List<FinanceModel.Spending>;
    rowHeight: number;
    isCurrentDate: boolean;
}

class CalendarMonthCell extends React.Component<CalendarMonthCellProp, void> {
    constructor(props?: CalendarMonthCellProp, context?: any) {
        super(props, context);
    }

    addSpending(e: React.SyntheticEvent<Element>) {
        e.stopPropagation();
        Actions.showEditSpendingDialog(this.props.date);
    }

    removeSpending(spending: FinanceModel.Spending) {
        Actions.showDeleteSpending(this.props.date, spending.category.code, Number.parseFloat(spending.amount.toString()));
    }

    render() {
        const cellContainerStyle = {
            height: calculateCellContainerHeight(this.props.rowHeight)
        }

        const cellStyle = {
            height: this.props.rowHeight
        }

        let cellClass = '';
        let isNotCurrentMonth = this.props.date.getMonth() !== this.props.targetMonth;
        let addButton = (
            <button type='button' className='btn btn-outline-primary btn-xs pull-right' onClick={this.addSpending.bind(this)}>
                <i className='fa fa-plus' aria-hidden="true"></i>
            </button>);

        if (isNotCurrentMonth) {
            cellClass += 'mute';
            addButton = null;
        }

        if (this.props.isCurrentDate) {
            cellClass += 'today';
        }

        let sum = this.props.daySpending.reduce((x1, x2) => x1 + Number.parseFloat(x2.amount.toString()), 0);

        let sumElt = null;

        if (sum > 0) {
             sumElt = <CalendarMonthCellTotal sum={sum}/>
        }

        let spendings = this.props.daySpending.map((x, i) =>
            <CalendarMonthCellSpendingRow
                key={`${this.props.date.getDate()}_${i}`}
                category={x.category.name}
                color={x.category.color}
                icon={x.category.icon}
                amount={x.amount}
                isAllowInteraction={!isNotCurrentMonth}
                removeCommand={
                    (() => this.removeSpending(x)).bind(this)
                    }/>
                )

        return (
            <td className={cellClass} style={cellStyle}>
                <div className='cell-top'><p>{this.props.date.getDate()}</p></div>
                <div id='container' className='cell-container' style={cellContainerStyle}>
                    {spendings}
                </div>
                <div className='cell-bottom'>
                    {sumElt}
                    {addButton}
                </div>
            </td>
        )
    }
}

class CalendarMonthCellSpendingRowProp {
    category: string;
    color: string;
    icon: string;
    amount: number | string;
    removeCommand?: (category: string, amount: number | string) => void;
    isAllowInteraction?: Boolean;
}

export class CalendarMonthCellSpendingRow extends React.Component<CalendarMonthCellSpendingRowProp, void> {
    constructor(props?: CalendarMonthCellSpendingRowProp, context?: any) {
        super(props, context);
    }

    removeCommand(e: React.SyntheticEvent<Element>) {
        e.stopPropagation();
        if (this.props.isAllowInteraction && this.props.removeCommand != undefined) {
            this.props.removeCommand(this.props.category, this.props.amount);
        }
    }

    render() {
        const spendingStyle = {
            borderColor: this.props.color,
        }

        const spendingCategoryStyle = {
            color: this.props.color
        }

        return (
        <div className='spending-row' style={spendingStyle} >
            <span className='spending-header' style={spendingCategoryStyle}>{this.props.category}</span>{Number.parseFloat(this.props.amount.toString()).toFixed(2)}
            <div className='spending-row-buttons pull-right' onClick={this.removeCommand.bind(this)}>
                <i className='fa fa-times'></i>
            </div>
        </div>);
    }
}

interface CalendarContainerState {
    ribbonCalendarState: SelectedDate;
    weeklySpending: List<Map<string, List<FinanceModel.Spending>>>;
}

interface CalendarMonthCellTotalProp {
    sum: number;
}

export class CalendarMonthCellTotal extends React.Component<CalendarMonthCellTotalProp, void> {
    constructor(props?: CalendarMonthCellTotalProp, context?: any) {
        super(props, context);
    }

    render() {
       return (
            <div className='row-total'>
                <p>Σ {this.props.sum.toFixed(2)}</p>
            </div>
       )
    }
}

export class CalendarContainer extends Container<void, CalendarContainerState> {
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
