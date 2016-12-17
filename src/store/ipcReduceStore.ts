import { ReduceStore } from 'flux/utils'
import { Dispatcher } from 'flux';


export abstract class IpcReduceStore<T, TPayload> extends ReduceStore<T, TPayload> {
    constructor(dispatcher: Dispatcher<TPayload>) {
        super(dispatcher);
        this.registerIpcRenderer();
    }

    abstract registerIpcRenderer(): void;
} 