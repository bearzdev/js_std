import { IProcessInvocationOptions, IProcessResult, run, runAsync } from "../deps.ts";

export function ctr(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('ctr', args, options);
}

export function ctrAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('ctr', args, options);
}