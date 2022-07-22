import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
export declare class StringBuilder {
    #private;
    constructor(capacity: number);
    constructor(value: StringBuilder);
    constructor(value: string);
    constructor();
    get length(): number;
    set length(value: number);
    clear(): void;
    repeat(value: boolean | number | object, count: number): StringBuilder;
    repeat(value: string | Uint8Array | StringBuilder, count: number): StringBuilder;
    append(value: boolean | number | object): StringBuilder;
    append(value: string | Uint8Array | StringBuilder, index?: number, length?: number): StringBuilder;
    appendLine(value: boolean | number | object): StringBuilder;
    appendLine(value: string | Uint8Array | StringBuilder, index?: number, length?: number): StringBuilder;
    at(index: number): number;
    insert(index: number, value: boolean | number | object): StringBuilder;
    insert(index: number, value: string | Uint8Array | StringBuilder, startIndex?: number, length?: number): StringBuilder;
    push(...args: number[]): void;
    valueOf(): string;
    toString(): string;
    private insertAt;
    private grow;
}
