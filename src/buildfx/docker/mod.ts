import { IProcessInvocationOptions, IProcessResult, registerExecutable, run, runAsync } from "../deps.ts";

registerExecutable('docker', 'docker', {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker.exe",
    ]
});

export function docker(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('docker', args, options);
}

export function dockerAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('docker', args, options);
}