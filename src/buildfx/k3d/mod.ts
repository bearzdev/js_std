import { IProcessInvocationOptions, IProcessResult, run, runAsync } from "../deps.ts";

export function k3d(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('k3d', args, options);
}

export function k3dAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('k3d', args, options);
}