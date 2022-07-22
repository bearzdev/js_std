import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { IEquatableOf } from './interfaces.js';
export declare class Uuid implements IEquatableOf<Uuid> {
    #private;
    constructor(value: string);
    equals(other: string): boolean;
    equals(other: Uuid): boolean;
    equals(other: unknown): boolean;
    static get empty(): Uuid;
    valueOf(): string;
    toString(): string;
}
