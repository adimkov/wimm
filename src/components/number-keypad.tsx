import * as React from 'react';

import { Container } from './container';
import { Actions } from '../action/action';
import { spendingStore } from '../store/spending';

interface NumberKeypadProp {
    pressedKey: string;
}

class NumberKeypad extends React.Component<NumberKeypadProp, {}> {
    constructor(props?: NumberKeypadProp, context?: any) {
            super(props, context);
    }

    click(symbol: string) {
        Actions.spendingKeypadClick(symbol);
    }

    release() {
        Actions.spendingKeypadRelease();
    }

    render() {
        let classes = new Array<string>();
        classes['.'] = '';
        classes['0'] = '';
        classes['00'] = '';
        classes['1'] = '';
        classes['2'] = '';
        classes['3'] = '';
        classes['4'] = '';
        classes['5'] = '';
        classes['6'] = '';
        classes['7'] = '';
        classes['8'] = '';
        classes['9'] = '';
        
        classes[this.props.pressedKey] = 'active'
        return (
            <table className='numberKeypad'>
                <tbody>
                    <tr>
                        <td className={classes['7']} onMouseDown={e => this.click('7')} onMouseUp={this.release}>7</td>
                        <td className={classes['8']} onMouseDown={e => this.click('8')} onMouseUp={this.release}>8</td>
                        <td className={classes['9']} onMouseDown={e => this.click('9')} onMouseUp={this.release}>9</td>
                    </tr>
                    <tr>
                        <td className={classes['4']} onMouseDown={e => this.click('4')} onMouseUp={this.release}>4</td>
                        <td className={classes['5']} onMouseDown={e => this.click('5')} onMouseUp={this.release}>5</td>
                        <td className={classes['6']} onMouseDown={e => this.click('6')} onMouseUp={this.release}>6</td>
                    </tr>
                    <tr>
                        <td className={classes['1']} onMouseDown={e => this.click('1')} onMouseUp={this.release}>1</td>
                        <td className={classes['2']} onMouseDown={e => this.click('2')} onMouseUp={this.release}>2</td>
                        <td className={classes['3']} onMouseDown={e => this.click('3')} onMouseUp={this.release}>3</td>
                    </tr>
                    <tr>
                        <td className={classes['.']} onMouseDown={e => this.click('.')} onMouseUp={this.release}>.</td>
                        <td className={classes['0']} onMouseDown={e => this.click('0')} onMouseUp={this.release}>0</td>
                        <td className={classes['00']} onMouseDown={e => this.click('00')} onMouseUp={this.release}>00</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

interface NumberKeypadContainerState {
    pressedKey: string;
}

export default class NumberKeypadContainer extends Container<{}, NumberKeypadContainerState> {
    constructor(props?: {}, context?: any) {
        super(props, context);
    }

    getStores() {
        return [spendingStore];
    }

    calculateState() {
        return {
            pressedKey: spendingStore.getPressedNumberOnKeypad()
        };
    }

    render() {
        return (
                <NumberKeypad pressedKey={this.state.value.pressedKey}/>
            );
    }
}

