import * as React from 'react';

import { Container } from './container';
import { sidebarStore } from '../store/sidebar';
import { SidebarCommand } from '../model/sidebar';
import AddSpending from './add-spending';
import DeleteSpending from './delete-spending';

import { Actions } from '../action/action';

class SidebarProp {
    show: boolean;
    header: string;
}

class Sidebar extends React.Component<SidebarProp, {}> {
    constructor(props?: SidebarProp, context?: any) {
            super(props, context);
    }

    closeSidebar(e: any) {
        let target = e.target;
        if (target.className.includes('sidebar') || target.className.includes('overlay')) {
            Actions.closeSidebar();
        }
    }

    render() {
        let visibilityClass = this.props.show ? 'sidebar-open' : 'sidebar-close';
        return (
            <div className='sidebar-outer' onClick={this.closeSidebar}>
                <div className={'overlay ' + visibilityClass} ></div>
                <div className={'sidebar ' + visibilityClass} >
                    <div className={'window'}>
                        <div className='header'>{this.props.header}</div>
                        <div className='content'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class SidebarContainerState {
    sidebarContent: SidebarCommand<any>
}

export default class SidebarContainer extends Container<{}, SidebarContainerState> {
    constructor(props?: {}, context?: any) {
        super(props, context);
    }

    getStores() {
        return [sidebarStore];
    }

    calculateState() {
        return {
            sidebarContent: sidebarStore.getSidebarContent()
        }
    }

    getSidebarContent(command: SidebarCommand<any>) {
        if (command === null || command === undefined) {
            return null;
        }

        switch(command.type) {
            case 'addSpending':
                return <AddSpending date={command.payload}/>;
            case 'deleteSpending':
                return <DeleteSpending date={command.payload.date} category={command.payload.category} amount={command.payload.amount}/>;
            default:
                return null;
        }
    }

    getHeader(command: SidebarCommand<any>) {
        let headers = {
            addSpending: 'Add spending',
            deleteSpending: 'Delete spending'
        }

        if (command === null || command === undefined) {
            return null;
        }

        return headers[command.type];
    }

    render() {
        return (
                <Sidebar show={this.state.value.sidebarContent !== undefined} header={this.getHeader(this.state.value.sidebarContent)}>
                    {this.getSidebarContent(this.state.value.sidebarContent)}
                </Sidebar>
            );
    }
}

