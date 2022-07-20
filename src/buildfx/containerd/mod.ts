import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from "../deps.ts";

import { exec, execAsync } from "../util/_exec.ts";

const exe = 'ctr';

export function ctr(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function ctr(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function ctr(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function ctr(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function ctrAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function ctrAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function ctrAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function ctrAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}