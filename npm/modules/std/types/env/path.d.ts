import type { IEnvironmentPath, IEnvironmentVariables } from './interfaces.js';
export declare class EnvironmentPath implements IEnvironmentPath {
    #private;
    constructor(env: IEnvironmentVariables);
    get value(): string;
    get win(): string;
    get winSystemDrive(): string;
    get winProgramFiles(): string;
    get winProgramFilesX86(): string;
    get winProgramData(): string;
    get opt(): string;
    get tmp(): string;
    get desktop(): string;
    get downloads(): string;
    get home(): string;
    get homeConfig(): string;
    get homeData(): string;
    [Symbol.iterator](): Generator<string, void, unknown>;
    has(path: string): boolean;
    remove(path: string): void;
    append(path: string): void;
    prepend(path: string): void;
    valueOf(): string;
    toString(): string;
}
export declare const envPath: EnvironmentPath;
