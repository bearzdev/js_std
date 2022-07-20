import { IProcessInvocationOptions, IProcessResult, run, runAsync } from "../deps.ts";

export function kubectl(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('kubectl', args, options);
}

export function kubectlAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('kubectl', args, options);
}