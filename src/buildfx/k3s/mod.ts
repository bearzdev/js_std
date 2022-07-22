import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from '../deps.ts';

import { exec, execAsync } from '../util/_exec.ts';

const exe = 'k3s';

export function k3s(args: string, options?: IProcessInvocationOptions): IProcessResult;
export function k3s(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export function k3s(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export function k3s(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function k3sAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function k3sAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function k3sAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function k3sAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}
