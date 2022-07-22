import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import type { IVersion } from './interfaces.js';
export declare class Version implements IVersion {
    #private;
    constructor(major: number, minor?: number, build?: number, revision?: number);
    static parse(version: string): Version;
    equals(other: string): boolean;
    equals(other: Version): boolean;
    compareTo(other: string): number;
    compareTo(other: Version): number;
    get major(): number;
    get minor(): number;
    get build(): number;
    get revision(): number;
    toString(): string;
}
