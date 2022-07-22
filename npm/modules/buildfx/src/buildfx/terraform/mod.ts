import { IProcessInvocationOptions, IProcessResult, run, runAsync } from "../deps.js";


export function terraform(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('terraform', args, options);
}

export function terraformAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('terraform', args, options);
}