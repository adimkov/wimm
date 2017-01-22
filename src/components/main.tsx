import * as React from 'react';

import Calendar from './calendar';
import CalendarInfo from './calendarinfo';
import Toolbar from './toolbar';
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
                <Toolbar />
                <div className='calendar-container'>
                    <Calendar />
                    <CalendarInfo /> 
                </div>
                <Sidebar />
            </div>
        );
    }
}
