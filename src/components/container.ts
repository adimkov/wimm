import * as React from 'react'
import { Store } from 'flux/utils'
import * as fbEmitter from 'fbemitter';

export class ContainerState<TState> {
    constructor(readonly value: TState) {
    }
}

export abstract class Container<TState> extends React.Component<void, ContainerState<TState>> {
    constructor(props?: void, context?: any) {
        super(props, context);
        this.state = new ContainerState(this.calculateState());
    }

    subscribers: Array<fbEmitter.EventSubscription>; 

    private _onStoreChanged() {
        this.setState(new ContainerState(this.calculateState()));
    }
    
    abstract calculateState(): TState;

    abstract getStores(): Array<Store<any>>;

    componentWillMount?(): void {
        let stores = this.getStores();
        this.subscribers = stores.map(x => x.addListener(this._onStoreChanged.bind(this)))
    }

    componentWillUnmount?(): void {
        this.subscribers.forEach(x => x.remove());
    }
}