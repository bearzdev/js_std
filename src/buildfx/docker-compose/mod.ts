import { IProcessInvocationOptions, IProcessResult, registerExecutable, run, runAsync } from "../deps.ts";

registerExecutable('docker-compose', 'docker-compose', {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker-compose.exe",
    ]
});

export function dockerCompose(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('docker-compose', args, options);
}

export function dockerComposeAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('docker-compose', args, options);
}