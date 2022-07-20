import { 
    CommandBuilder, 
    IProcessInvocationOptions, 
    IProcessResult, 
} from "../deps.ts";

import { exec, execAsync } from "../util/_exec.ts";

const exe = 'kubectl';

export function kubectl(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function kubectl(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function kubectl(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function kubectl(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function kubectlAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function kubectlAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function kubectlAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function kubectlAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}