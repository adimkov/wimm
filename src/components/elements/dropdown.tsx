import * as React from 'react';
import { List } from 'immutable';

class DropdownProp {
    selectedValue: string;
    className: string;
    onSelect: (value: string) => void
}


class DropdownState {
    constructor(public isOpen: boolean) {
    }
}

class DropdownOptionProp {
    value: string;
}

interface INode {
    parentElement: INode;
    dataset: any;
}

export class Dropdown extends React.Component<DropdownProp, DropdownState> {
    constructor(props?: DropdownProp, context?: any) {
        super(props, context);
        this.state = new DropdownState(false);
    }

    openCloseDropdown() {
        var isOpen = !this.state.isOpen; 
        this.setState(new DropdownState(isOpen));
    }

    selectOption(e: any) {
        let target = e.target;
        if (target !== undefined && target !== null) {
            let node = getPayloadedElement(target, 10);
            if (node !== undefined && node !== null) {
                if (this.props.onSelect !== undefined && this.props.onSelect !== null) {
                    this.props.onSelect(node.dataset.value);
                }

                this.openCloseDropdown();
            }
        }
    }

    render() {
        let options = this.props.children as List<React.ReactHTMLElement<HTMLElement>>;
        let selectedOption = options.find(x => x.props.value == this.props.selectedValue);
        
        let dropdownContainerClasses = [];
        if (this.state.isOpen) {
            dropdownContainerClasses.push('open');
        }

        return (
            <div className='dropdown'>
                <div className={'selectedContainer form-control ' + this.props.className} onClick={this.openCloseDropdown.bind(this)}>
                    <div>
                        {selectedOption}
                    </div>
                    <span className='caret pull-right'></span>
                </div>
                <div className={'dropdownContainer ' + dropdownContainerClasses.join()} onClick={this.selectOption.bind(this)}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export class DropdownOption extends React.Component<DropdownOptionProp, {}> {
    constructor(props?: DropdownOptionProp, context?: any) {
            super(props, context);
    }

    render() {
        return (<div data-value={this.props.value}>
                    <div className='option' >{this.props.children}</div>
                </div>
            );
    }
}



function getPayloadedElement(node: INode, level: number): INode {
    if (node != undefined && node != null && level > 0) {
        if (node.dataset != undefined && node.dataset.value != undefined) {
            return node;
        } 
        else {
            return getPayloadedElement(node.parentElement, level - 1);
        }
    }
}