import { IProcessInvocationOptions, IProcessResult, run, runAsync } from "../deps.ts";


export function winget(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('winget', args, options);
}

export function wingetAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('winget', args, options);
}