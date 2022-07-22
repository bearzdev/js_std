import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { NotFoundOnPathError, ProcessError } from './errors.js';
import type { IParameterBuilder, IProcessCapture, IProcessInvocationOptions, IProcessResult, IProcessStartInfo } from './interfaces.js';
import { CommandBuilder, ProcessArgs, ProcessStartInfo } from './start-info.js';
import { findExecutable, findExecutableAsync, findExecutableOrThrow, findExecutableOrThrowAsync, pathFinder, registerExecutable, resolveScript, resolveScriptAsync, which, whichAsync } from './which.js';
export default class Process {
    #private;
    startInfo: IProcessStartInfo;
    constructor(startInfo: ProcessStartInfo);
    constructor(options: Partial<IProcessStartInfo>);
    static capture(fileName: string, args?: string[], options?: IProcessInvocationOptions): IProcessResult;
    static captureAsync(fileName: string, args?: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
    static captureScript(script: string, shell?: string, options?: IProcessInvocationOptions): IProcessResult;
    static captureScriptAsync(script: string, shell?: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
    static run(fileName: string, args?: string[], options?: IProcessInvocationOptions): IProcessResult;
    static runAsync(fileName: string, args?: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
    static runScript(script: string, shell?: string, options?: IProcessInvocationOptions): IProcessResult;
    static runScriptAsync(script: string, shell?: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
    static which: typeof which;
    static whichAsync: typeof whichAsync;
    redirectTo(array: string[]): void;
    redirectTo(capture: IProcessCapture): void;
    redirectErrorTo(array: string[]): void;
    redirectErrorTo(capture: IProcessCapture): void;
    run(signal: AbortSignal): IProcessResult;
    run(timeout: number): IProcessResult;
    run(): IProcessResult;
    runAsync(signal: AbortSignal): Promise<IProcessResult>;
    runAsync(timeout: number): Promise<IProcessResult>;
    runAsync(): Promise<IProcessResult>;
    capture(signal: AbortSignal): IProcessResult;
    capture(timeout: number): IProcessResult;
    capture(): IProcessResult;
    captureAsync(signal: AbortSignal): Promise<IProcessResult>;
    captureAsync(timeout: number): Promise<IProcessResult>;
    captureAsync(): Promise<IProcessResult>;
    tee(signal: AbortSignal): IProcessResult;
    tee(timeout: number): IProcessResult;
    tee(): IProcessResult;
    teeAsync(signal: AbortSignal): Promise<IProcessResult>;
    teeAsync(timeout: number): Promise<IProcessResult>;
    teeAsync(): Promise<IProcessResult>;
}
export declare const run: typeof Process.run, runAsync: typeof Process.runAsync, runScript: typeof Process.runScript, runScriptAsync: typeof Process.runScriptAsync, capture: typeof Process.capture, captureAsync: typeof Process.captureAsync, captureScript: typeof Process.captureScript, captureScriptAsync: typeof Process.captureScriptAsync;
export { CommandBuilder, findExecutable, findExecutableAsync, findExecutableOrThrow, findExecutableOrThrowAsync, IParameterBuilder, IProcessCapture, IProcessInvocationOptions, IProcessResult, IProcessStartInfo, NotFoundOnPathError, pathFinder, ProcessArgs, ProcessError, registerExecutable, resolveScript, resolveScriptAsync, which, whichAsync, };
export declare const fromArgs: typeof ProcessArgs.from;