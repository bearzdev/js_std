import { 
    CommandBuilder, 
    IProcessInvocationOptions, 
    IProcessResult, 
    registerExecutable, 
} from "../deps.js";

import { exec, execAsync } from "../util/_exec.js";

const exe = 'git';

export function git(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function git(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function git(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function git(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function gitAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function gitAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function gitAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function gitAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}

registerExecutable('git', 'git', {
    windows: [
        "%ProgramFiles%\\Git\\cmd\\git.exe",
        "%ProgramFiles(x86)%\\Git\\cmd\\git.exe",
    ]
});

