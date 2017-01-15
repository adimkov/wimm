import * as React from 'react';

import Calendar from './calendar';
import CalendarInfo from './calendarinfo';
import Ribbon from './ribbon';
import Sidebar from './sidebar';
import { Container } from './container';
import { Actions } from '../action/action';


export class Main extends React.Component<void, void> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }
    
    render() {
        return(
            <div>
                <Ribbon />
                <div className='calendar-container'>
                    <Calendar />
                    <CalendarInfo /> 
                </div>
                <Sidebar />
            </div>
        );
    }
}
