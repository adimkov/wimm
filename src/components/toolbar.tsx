import * as React from 'react';

import { Container } from './container';
import { Actions } from '../action/action';
import { Months, SelectedDate } from '../model/calendar';
import { toolbarStore } from '../store/toolbar';
import { Hash } from '../model/collection';

class ToolbarProp {
    selectedYear: number;
    selectedMonth: Months;
    calendarYears: Array<number>;
    calendarPrevDisabled: boolean;
    calendarNextDisabled: boolean;
    activeViewName: string;
}

class Toolbar extends React.Component<ToolbarProp, {}> {
    constructor(props?: ToolbarProp, context?: any) {
            super(props, context);
    }


    yearChanged(e: any) {
        Actions.setCalendarYear(e.target.value);
    }

    monthChanged(e: any) {
        Actions.setCalendarMonth(e.target.value);
    }

    render() {
        let yearOptions = [];
        let monthOptions = [];
        let activeViewClass = new Hash<string>();
        activeViewClass['calendar-month'] = 'btn-default';
        activeViewClass['calendar-report'] = 'btn-default';
        activeViewClass[this.props.activeViewName] = 'btn-primary';

        var currentYear = new Date().getFullYear();
        for (let i of this.props.calendarYears) {
            yearOptions.push(<option key={i} value={i}>{i}</option>)
        }

        for (let enumMember in Months) {
            var isValueProperty = parseInt(enumMember, 10) >= 0
            if (isValueProperty) {
                monthOptions.push(<option key={enumMember} value={enumMember}>{ Months[enumMember]}</option>)
            }
        }
       
        let calendarPrevMonthClass = this.props.calendarPrevDisabled ? 'disabled':'';
        let calendarNextMonthClass = this.props.calendarNextDisabled ? 'disabled':'';

        return (
            <nav className='toolbar'>
                <ul>
                    <li><a className='btn btn-primary btn-sm' onClick={e => Actions.flushFinanceStore()}>Save</a></li>
                    <li></li>
                    <li>
                        <form className='form-inline'>
                            <div className='form-group'>
                                <a className={'btn btn-default btn-sm' + calendarPrevMonthClass} onClick={e => Actions.setPrevMonth()}><i className="fa fa-arrow-left" aria-hidden="true"></i></a>
                            </div>
                            <div className='form-group form-group-sm'>
                                <select id="year" className="form-control" value={this.props.selectedYear} onChange={this.yearChanged}>
                                    {yearOptions}
                                </select>
                            </div>
                            <div className='form-group form-group-sm'>
                                <select id="month" className="form-control" value={this.props.selectedMonth} onChange={this.monthChanged}>
                                    {monthOptions}
                                </select>
                            </div>
                            <div className='form-group'>
                                <a className={'btn btn-default btn-sm ' + calendarNextMonthClass} onClick={e => Actions.setNextMonth()}><i className="fa fa-arrow-right" aria-hidden="true"></i></a>
                            </div>
                        </form>
                    </li>
                    <li></li>
                    <li><a className={'btn ' + activeViewClass['calendar-month']} onClick={e => Actions.showViewMonthCalendar()}><i className="fa fa-calendar" aria-hidden="true"></i></a></li>
                    <li><a className={'btn ' + activeViewClass['calendar-report']} onClick={e => Actions.showViewReportCalendar()}><i className="fa fa-bar-chart" aria-hidden="true"></i></a></li>
                    <li></li>
                </ul>
            </nav>)
    }
}

class ToolbarContainerState {
    calendarState: SelectedDate;
    calendarYears: Array<number>;
    calendarPrevDisabled: boolean;
    calendarNextDisabled: boolean;
    activeViewName: string;
}

export default class ToolbarContainer extends Container<{}, ToolbarContainerState> {
    constructor(props?: {}, context?: any) {
        super(props, context);
    }

    getStores() {
        return [toolbarStore];
    }

    calculateState() {
        return {
            calendarState: toolbarStore.getCalendarOptions(),
            calendarYears: toolbarStore.getYears(),
            calendarPrevDisabled: toolbarStore.getIsPrevMonthDisabled(),
            calendarNextDisabled: toolbarStore.getIsNextMonthDisabled(),
            activeViewName: toolbarStore.getActiveViewName()
        }
    }

    render() {
        return (
                <Toolbar 
                selectedYear={this.state.value.calendarState.year} 
                selectedMonth={this.state.value.calendarState.month} 
                calendarYears={this.state.value.calendarYears}
                calendarPrevDisabled={this.state.value.calendarPrevDisabled}
                calendarNextDisabled={this.state.value.calendarNextDisabled}
                activeViewName={this.state.value.activeViewName}/>
            );
    }
}

