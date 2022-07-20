import { IProcessInvocationOptions, IProcessResult, run, runAsync } from "../deps.ts";


export function scoop(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('scoop', args, options);
}

export function scoopAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('scoop', args, options);
}