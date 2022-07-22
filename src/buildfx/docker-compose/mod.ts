import { CommandBuilder, IProcessInvocationOptions, IProcessResult, registerExecutable } from '../deps.ts';

import { exec, execAsync } from '../util/_exec.ts';

const exe = 'dockerCompose';

export function dockerCompose(args: string, options?: IProcessInvocationOptions): IProcessResult;
export function dockerCompose(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export function dockerCompose(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export function dockerCompose(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function dockerComposeAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function dockerComposeAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function dockerComposeAsync(
    command: CommandBuilder,
    options?: IProcessInvocationOptions,
): Promise<IProcessResult>;
export function dockerComposeAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}

registerExecutable('docker-compose', 'docker-compose', {
    windows: [
        '%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker-compose.exe',
    ],
});
