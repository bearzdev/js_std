import type { IDisposable } from '../primitives/interfaces.js';
export interface IProcessCapture extends IDisposable {
    write(data: Uint8Array): void;
    writeLine(line: string): void;
}
export interface IProcessResult {
    exitCode: number;
    standardOut: string[];
    standardError: string[];
    fileName: string;
    args: string[];
    startedAt?: Date;
    stoppedAt?: Date;
}
export interface IProcessStartInfo {
    env?: {
        [key: string]: string;
    };
    args?: string[];
    workingDirectory?: string;
    userId?: number;
    groupId?: number;
    fileName?: string;
    outCaptures?: IProcessCapture[];
    errorCaptures?: IProcessCapture[];
    timeout?: number;
    signal?: AbortSignal;
}
export interface IPathFinderOptions {
    envVariable?: string;
    paths?: string[];
    windows?: string[];
    linux?: string[];
    darwin?: string[];
}
export interface IPathFinderEntry {
    name: string;
    executableName: string;
    executablePath?: string;
    options?: IPathFinderOptions;
}
export interface IPathFinder {
    register(name: string, executableName: string, options?: IPathFinderOptions): IPathFinder;
    find(name: string): string | undefined;
    findOrThrow(name: string): string;
}
export interface IShellScriptResolver {
    (script: string, shell: string | undefined, startInfo: IProcessStartInfo): string;
}
export interface IAsyncShellScriptResolver {
    (script: string, shell: string | undefined, startInfo: IProcessStartInfo): Promise<string>;
}
export interface IProcessInvocationOptions extends IProcessStartInfo {
    capture?: boolean;
    tee?: boolean;
    exitCodeValidator?: (exitCode: number) => boolean;
}
export interface IParameterBuilder {
    build(): string[];
}
export interface IProcessRunner {
    run(context: IProcessInvocationContext): IProcessResult;
    runAsync(context: IProcessInvocationContext): Promise<IProcessResult>;
    resolveShellScript: IShellScriptResolver;
    resolveShellScriptAsync: IAsyncShellScriptResolver;
}
export interface IProcessInvocationContext {
    startInfo: IProcessStartInfo;
    outCaptures: IProcessCapture[];
    errorCaptures: IProcessCapture[];
    signal?: AbortSignal;
    timeout?: number;
}
