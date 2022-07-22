import { CommandBuilder, IProcessInvocationOptions, IProcessResult, registerExecutable } from "../deps.js";

import { exec, execAsync } from "../util/_exec.js";

const exe = 'docker';

export function docker(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function docker(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function docker(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function docker(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function dockerAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function dockerAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function dockerAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function dockerAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}

registerExecutable('docker', 'docker', {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker.exe",
    ]
});