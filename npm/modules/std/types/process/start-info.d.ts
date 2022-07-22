import { StringBuilder } from '../text/string-builder.js';
import type { IDisposable } from '../primitives/interfaces.js';
import type { IProcessCapture, IProcessResult, IProcessStartInfo } from './interfaces.js';
export declare function splitArguments(value: string): string[];
export type { IProcessCapture, IProcessResult, IProcessStartInfo, };
export declare abstract class ProcessCapture implements IProcessCapture, IDisposable {
    abstract write(data: Uint8Array | undefined): void;
    abstract writeLine(line: string | undefined): void;
    abstract dispose(): void;
}
export declare class ArrayCapture extends ProcessCapture implements IProcessCapture {
    #private;
    constructor(array: string[]);
    write(data: Uint8Array | undefined): void;
    writeLine(line: string | undefined): void;
    dispose(): void;
}
export declare class WritableStreamCapture extends ProcessCapture implements IProcessCapture {
    #private;
    constructor(stream: WritableStream<Uint8Array>, close?: boolean);
    write(data: Uint8Array | undefined): void;
    writeLine(line: string | undefined): void;
    dispose(): void;
}
export declare class ProcessArgs extends Array<string> {
    constructor(args: string[]);
    constructor(...args: string[]);
    append(value: string): ProcessArgs;
    append(...args: string[]): ProcessArgs;
    append(value: StringBuilder): ProcessArgs;
    append(value: ProcessArgs): ProcessArgs;
    push(...args: string[]): number;
    static from(value: string): ProcessArgs;
    static from(...args: string[]): ProcessArgs;
    static from(value: StringBuilder): ProcessArgs;
    static from(value: ProcessArgs): ProcessArgs;
}
export declare class CommandBuilder {
    #private;
    constructor();
    addArgument(value: number): this;
    addArgument(value: string): this;
    addOption(name: string, value: number): this;
    addOption(name: string, value: boolean): this;
    addOption(name: string, value: string): this;
    build(): string[];
    valueOf(): ProcessArgs;
    toString(): string;
}
export declare class ProcessResult implements IProcessResult {
    exitCode: number;
    standardOut: string[];
    standardError: string[];
    fileName: string;
    args: string[];
    startedAt?: Date;
    stoppedAt?: Date;
    constructor(options?: Partial<IProcessResult>);
    set(options?: Partial<IProcessResult>): this;
}
export declare class ProcessStartInfo implements IProcessStartInfo {
    env?: {
        [key: string]: string;
    };
    args: string[];
    workingDirectory?: string;
    userId?: number;
    groupId?: number;
    fileName: string;
    outCaptures?: IProcessCapture[];
    errorCaptures?: IProcessCapture[];
    timeout?: number;
    signal?: AbortSignal;
    constructor(fileName: string, ...args: string[]);
    constructor(options: Partial<IProcessStartInfo>);
    constructor();
    set(options?: Partial<IProcessStartInfo>): this;
    redirectTo(array: string[]): void;
    redirectTo(capture: IProcessCapture): void;
    redirectErrorTo(array: string[]): void;
    redirectErrorTo(capture: IProcessCapture): void;
    push(...args: string[]): this;
}
