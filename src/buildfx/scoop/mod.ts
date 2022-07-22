import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from '../deps.ts';

import { exec, execAsync } from '../util/_exec.ts';

const exe = 'scoop';

export function scoop(args: string, options?: IProcessInvocationOptions): IProcessResult;
export function scoop(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export function scoop(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export function scoop(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function scoopAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function scoopAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function scoopAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function scoopAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}
