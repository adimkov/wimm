import * as React from 'react';

import { MainViewContainer } from './main-view-container'
import Toolbar from './toolbar';
import Sidebar from './sidebar';

export class Main extends React.Component {
    constructor(props?: {}, context?: any) {
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
