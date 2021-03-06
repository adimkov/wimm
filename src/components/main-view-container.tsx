import * as React from 'react';

import { Container } from './container';
import { CalendarContainer } from './calendar';
import MonthChart from './month-chart';
import CalendarInfo from './calendar-info';
import { toolbarStore } from '../store/toolbar';
import { Hash } from '../model/collection';


interface MainViewProps {
    activeViewName: string;
} 

class MainView extends React.Component<MainViewProps, {}> {
    constructor(props?: MainViewProps, context?: any) {
            super(props, context);
    }

    onResize(width: number, height: number) {
        this.setState({browserHeight: height});
    }
    
    render() {
        let viewMap = new Hash<React.ReactElement<any>>();
        viewMap['calendar-month'] = (<div>
                <CalendarContainer />
                <CalendarInfo /> 
            </div>);

        viewMap['calendar-report'] = (
            <div>
                <MonthChart/>
            </div>
        )

        return <div>{viewMap[this.props.activeViewName]}</div>;
    }
}

interface MainViewContainerState {
    activeViewName: string;
} 

export class MainViewContainer extends Container<{}, MainViewContainerState> {
    constructor(props?: {}, context?: any) {
        super(props, context);
    }
    
    getStores() {
        return [toolbarStore];
    }

    calculateState() {
        return {
            activeViewName: toolbarStore.getActiveViewName(),
        }
    }

    render() {
        return(
            <div className='calendar-container'>
                <MainView activeViewName={this.state.value.activeViewName}/>
            </div>
        );
    }
}