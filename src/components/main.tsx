import * as React from 'react';

import Calendar from './calendar';
import Ribbon from './ribbon';
import Sidebar from './sidebar';

class MainState {
    showPanel: boolean = false;
}

export class Main extends React.Component<void, MainState> {
    showPanel: boolean = false;

    constructor(props?: void, context?: any) {
        super(props, context);
        this.state = new MainState();
    }

    changeState() {
        this.setState({showPanel: !this.state.showPanel});
    }

    render() {
        return(
            <div onClick={this.changeState.bind(this)}>
                <Ribbon />
                <Calendar/>
                <Sidebar show={this.state.showPanel}>
                    <p>Test</p>
                </Sidebar>
            </div>
        );
    }
}