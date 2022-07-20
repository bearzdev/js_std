import { IProcessInvocationOptions, IProcessResult, run, runAsync } from "../deps.ts";

export function k3s(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('k3s', args, options);
}

export function k3sAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('k3s', args, options);
}