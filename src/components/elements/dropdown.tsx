import * as React from 'react';
import { List } from 'immutable';

class DropdownProp {
    selectedKey: string;
    elementSelected: (key) => void
}


class DropdownState {
    constructor(public isOpen: boolean) {
    }
}

class DropdownOptionProp {
    key: string;
}

export class Dropdown extends React.Component<DropdownProp, DropdownState> {
    constructor(props?: DropdownProp, context?: any) {
        super(props, context);
        this.state = new DropdownState(false);
    }

    openCloseDropdown() {
        this.state.isOpen = !this.state.isOpen; 
        this.setState(this.state);
    }

    render() {
        let selectedOption = (this.props.children as List<React.ReactElement<DropdownOptionProp>>).find(x => x.key === this.props.selectedKey);
        let dropdownContainerClasses = [];
        if (this.state.isOpen) {
            dropdownContainerClasses.push('open');
        }

        return (
            <div className='dropdown'>
                <div className='selectedContainer form-control' onClick={this.openCloseDropdown.bind(this)}>
                    <div>
                        {selectedOption}
                    </div>
                    <span className='caret pull-right'></span>
                </div>
                <div className={'dropdownContainer ' + dropdownContainerClasses.join()}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export class DropdownOption extends React.Component<DropdownOptionProp, void> {
    constructor(props?: DropdownOptionProp, context?: any) {
            super(props, context);
    }

    render() {
        return (<div>
                    <div className='option'>{this.props.children}</div>
                </div>
            );
    }
}