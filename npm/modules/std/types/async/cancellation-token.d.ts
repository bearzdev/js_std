export declare const none: AbortSignal;
export declare class CancellationTokenSource extends AbortController {
    constructor();
    get signal(): AbortSignal & {
        canBeCancelled: boolean;
        timeout: number | undefined;
    };
    static cancelAfter(ms: number): AbortSignal;
    cancel(reason?: string): void;
    cancelAfter(ms: number): void;
}
export declare const cancelAfter: typeof CancellationTokenSource.cancelAfter;
