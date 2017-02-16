import * as React from 'react';

import { MainViewContainer } from './main-view-container'
import Toolbar from './toolbar';
import Sidebar from './sidebar';

export class Main extends React.Component<void, void> {
    constructor(props?: void, context?: any) {
        super(props, context);
    }
    
    render() {
        return(
            <div>
                <Toolbar />
                <MainViewContainer />
                <Sidebar />
            </div>
        );
    }
}
