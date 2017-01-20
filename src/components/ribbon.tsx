import * as React from 'react';
import { FormGroup, ControlLabel, FormControl, Form, Col } from 'react-bootstrap'

import { Container } from './container';
import { Months, RibbonCalendarState } from '../model/calendar'
import { ribbonStore } from '../store/ribbon';
import { Actions } from '../action/action';

class RibbonProp {
    activeTabName: string;
    calendarProp: RibbonCalendarState;
}

interface IRibbonProp {
    isActive: boolean;
}

class RibbonCalendarTabProp implements IRibbonProp {
    state: RibbonCalendarState;
    isActive: boolean;
}

class RibbonFileTabProp implements IRibbonProp {
    isActive: boolean;
}

class Ribbon extends React.Component<RibbonProp, void> {
    constructor(props?: RibbonProp, context?: any) {
            super(props, context);
    }

    render() {
        let activeTab = [];
        activeTab[this.props.activeTabName] = 'active';
        
        return (
            <div className='ribbon'>
                <div>
                    <ul className='ribbon-header'>
                        <li onClick={e => Actions.activateRibbonTab(RibbonCalendarTab.tabName)} className={activeTab[RibbonCalendarTab.tabName]}>{RibbonCalendarTab.tabName}</li>
                        <li onClick={e => Actions.activateRibbonTab(RibbonFileTab.tabName)} className={activeTab[RibbonFileTab.tabName]}>{RibbonFileTab.tabName}</li>
                    </ul>
                    <div className='ribbon-container'>
                        <RibbonCalendarTab state={this.props.calendarProp} isActive={RibbonCalendarTab.tabName == this.props.activeTabName}/>
                        <RibbonFileTab isActive={RibbonFileTab.tabName == this.props.activeTabName}/>
                    </div>
                </div>
            </div>)
    }
}

class RibbonCalendarTab extends React.Component<RibbonCalendarTabProp, void> {
    constructor(props?: RibbonCalendarTabProp, context?: any) {
            super(props, context);
    }

    yearChanged(e: any) {
        Actions.ribbonCalendarSetYear(e.target.value);
    }

    monthChanged(e: any) {
        Actions.ribbonCalendarSetMonth(e.target.value);
    }

    render() {
        let tabClass = 'calendar';
        if (this.props.isActive){
            tabClass = 'show';
        }
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
            <div className={tabClass}>
                <form>
                    <div className='form-group row'>
                        <label htmlFor="year" className="col-sm-2">Year</label>
                        <div className="col-sm-10">
                            <select id="year" className="form-control form-control-sm" value={this.props.state.year} onChange={this.yearChanged}>
                                {yearOptions}
                            </select>
                        </div>
                    </div>
                                    
                    <div className='form-group row'>
                        <label htmlFor="month" className="col-sm-2">Month</label>
                        <div className="col-sm-10">
                            <select id="month" className="form-control form-control-sm" value={this.props.state.month} onChange={this.monthChanged}>
                                {monthOptions}
                            </select>
                        </div>    
                    </div>
               </form>
            </div>)
    }

    static tabName: string = 'calendar'
}

class RibbonFileTab extends React.Component<RibbonFileTabProp, void> {
    constructor(props?: RibbonFileTabProp, context?: any) {
            super(props, context);
    }

    render() {
        let tabClass = '';
        if (this.props.isActive){
            tabClass = 'show';
        }
        
        return (
            <div className={tabClass}>
                <button className='btn btn-default' onClick={e => Actions.flushFinanceStore()}>Save</button>
            </div>)
    }

    static tabName: string = 'file'
}

interface RibbonContainerState {
    activeTab: string;
    calendarState: RibbonCalendarState;
}

export default class RibbonContainer extends Container<void, RibbonContainerState> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }

    getStores() {
        return [ribbonStore];
    }

    calculateState() {
        return {
            activeTab: ribbonStore.getRibbonActiveTab(),
            calendarState: ribbonStore.getRibbonCalendarOptions()
        }
    }

    render() {
        return <Ribbon activeTabName={this.state.value.activeTab} calendarProp={this.state.value.calendarState}/>;
    }
}
