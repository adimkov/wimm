export class SidebarCommand<TPayload> {
    constructor(
        public type: string, 
        public payload: TPayload) {
    }
}