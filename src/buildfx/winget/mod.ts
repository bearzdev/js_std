import { CommandBuilder, IProcessInvocationOptions, IProcessResult, } from "../deps.ts";
import { exec, execAsync } from "../util/_exec.ts";

const exe = 'winget';

export function winget(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function winget(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function winget(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function winget(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function wingetAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function wingetAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function wingetAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function wingetAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}