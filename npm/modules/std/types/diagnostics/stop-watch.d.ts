export declare class StopWatchSpan {
    #private;
    constructor(spanName: string, startTime: Date, endTime: Date, index: number);
    get startTime(): Date;
    get endTime(): Date;
    get spanName(): string;
    get duration(): number;
    get percentage(): string | undefined;
    calculatePercentage(totalDuration: number): string;
}
export declare function utcNow(): Date;
export declare class StopWatch {
    #private;
    static NoTaskMessage: string;
    constructor(id?: string);
    get id(): string;
    get length(): number;
    get isRunning(): boolean;
    get runningSpanName(): string | null;
    get totalDuration(): number;
    start(spanName?: string): void;
    stop(): void;
    at(index: number): StopWatchSpan | undefined;
    findTask(spanName: string): StopWatchSpan | undefined;
    toString(): string;
}
