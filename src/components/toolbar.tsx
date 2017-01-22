import * as React from 'react';

import { Container } from './container';
import { Actions } from '../action/action';
import { Months, SelectedDate } from '../model/calendar';
import { toolbarStore } from '../store/toolbar';

class ToolbarProp {
    selectedYear: number;
    selectedMonth: Months;
}

class Toolbar extends React.Component<ToolbarProp, void> {
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

        var currentYear = new Date().getFullYear();
        for (let i = 2016; i <= currentYear; i ++) {
            yearOptions.push(<option key={i} value={i}>{i}</option>)
        }

        for (let enumMember in Months) {
            var isValueProperty = parseInt(enumMember, 10) >= 0
            if (isValueProperty) {
                monthOptions.push(<option key={enumMember} value={enumMember}>{ Months[enumMember]}</option>)
            }
        }
       
        return (
            <nav className='toolbar'>
                <ul>
                    <li><a className='btn btn-default' onClick={e => Actions.flushFinanceStore()}>Save</a></li>
                    <li className='separator'></li>
                    <li>
                        <form className='form-inline'>
                            <div className='form-group'>
                                <select id="year" className="form-control form-control-sm" value={this.props.selectedYear} onChange={this.yearChanged}>
                                    {yearOptions}
                                </select>
                            </div>
                                        
                            <div className='form-group'>
                                <select id="month" className="form-control form-control-sm" value={this.props.selectedMonth} onChange={this.monthChanged}>
                                    {monthOptions}
                                </select>
                            </div>
                        </form>
                    </li>
                    <li className='separator'></li>
                </ul>
            </nav>)
    }
}

class ToolbarContainerState {
    calendarState: SelectedDate;
}

export default class ToolbarContainer extends Container<void, ToolbarContainerState> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }

    getStores() {
        return [toolbarStore];
    }

    calculateState() {
        return {
            calendarState: toolbarStore.getCalendarOptions()
        }
    }

    render() {
        return (
                <Toolbar selectedYear={this.state.value.calendarState.year} selectedMonth={this.state.value.calendarState.month}/>
            );
    }
}

