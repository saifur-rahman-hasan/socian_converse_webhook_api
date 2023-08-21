export interface TaskFilterDataInterface {
    channels?: number[];
    dateRange?: {
        from:string,
        to:string
    };
    threadId?: number[];
    iceFeedback?: ('Y' | 'N' | 'Other' | 'ALL')[];
    agents?: number[];
    taskStatus?: ('new' | 'assigned' | 'closed' | 'other')[];
    tags?: number[];
    from?:number | 0,
    size?: number | 10;
    total?: number | 0;
}
