import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from '../deps.ts';

import { exec, execAsync } from '../util/_exec.ts';

const exe = 'k3d';

export function k3d(args: string, options?: IProcessInvocationOptions): IProcessResult;
export function k3d(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export function k3d(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export function k3d(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function k3dAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function k3dAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function k3dAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function k3dAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}
