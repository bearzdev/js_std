export const none = new AbortController().signal;
none.throwIfAborted = () => {};
Reflect.defineProperty(none, 'canBeCancelled', {
    value: false,
    writable: false,
});

export class CancellationTokenSource extends AbortController {
    constructor() {
        super();
        Reflect.defineProperty(this.signal, 'canBeCancelled', {
            value: true,
            writable: true,
        });
        Reflect.defineProperty(this.signal, 'timeout', {
            value: undefined,
            writable: true,
        });
        const func = this.signal.throwIfAborted;
        this.signal.throwIfAborted = function () {
            // @ts-ignore using this is ok
            if (this.canBeCancelled) {
                // @ts-ignore using this is ok
                func.apply(this, arguments);
            }
        }.bind(this.signal);
    }

    override get signal() : AbortSignal & { canBeCancelled: boolean, timeout: number | undefined } {
        return super.signal as AbortSignal & { canBeCancelled: boolean, timeout: number | undefined };
    }

    static cancelAfter(ms: number): AbortSignal {
        const source = new CancellationTokenSource();
        source.cancelAfter(ms);

        return source.signal;
    }

    cancel(reason?: string): void {
        this.abort(reason);
    }

    cancelAfter(ms: number): void {
        this.signal.timeout = ms;
        setTimeout(() => {
            this.abort(`Cancelled due to timeout: ${ms} milliseconds.`);
        }, ms);
    }
}

export const { cancelAfter } = CancellationTokenSource;
