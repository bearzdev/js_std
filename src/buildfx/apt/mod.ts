import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from '../deps.ts';
import { exec, execAsync } from '../util/_exec.ts';

const exe = 'apt';

export function apt(args: string, options?: IProcessInvocationOptions): IProcessResult;
export function apt(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export function apt(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export function apt(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function aptAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function aptAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function aptAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function aptAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}
