// deno-lint-ignore no-explicit-any
let g: any;

if (typeof globalThis !== 'undefined') {
    g = globalThis;

    // @ts-ignore - global may exist and typeof won't throw if undefined
} else if (typeof global !== 'undefined') {
    // @ts-ignore - global may exist and typeof won't throw if undefined
    g = global;
} else if (typeof self !== 'undefined') {
    // @ts-ignore - self may exist and typeof won't throw if undefined
    g = self;
} else {
    g = new Function('return this')();
}

export const globalScope = g;

export function isDefined(...args: string[]) {
    const target = getGlobal(...args);
    return target !== undefined;
}

// deno-lint-ignore no-explicit-any
export function getGlobal(...args: string[]): any {
    let target = g;
    for (const arg of args) {
        if (typeof target[arg] === 'undefined' || target[arg] === 'null') {
            return undefined;
        }

        target = target[arg];
    }

    return target;
}
