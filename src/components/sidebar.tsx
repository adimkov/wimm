import * as React from 'react';

import { Container } from './container';
import { financeStore } from '../store/finance';

class SidebarProp {
    show: boolean;
}

export default class Sidebar extends React.Component<SidebarProp, void> {
    constructor(props?: SidebarProp, context?: any) {
            super(props, context);
    }

    render() {
        let visibilityClass = this.props.show ? 'sidebar-open' : 'sidebar-close';

        return (
            <div className={'sidebar ' + visibilityClass} >
                <div className='window'>
                    <div className='header'>Header</div>
                    <div className='content'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}
