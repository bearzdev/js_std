import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from '../deps.ts';

import { exec, execAsync } from "../util/_exec.ts";

const exe = 'choco';

export function choco(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function choco(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function choco(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function choco(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function chocoAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function chocoAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function chocoAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function chocoAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}


export async function* chocoListJsonAsync(): AsyncIterator<{name: string, version: string}> {
    const result = await chocoAsync(['list', '-l', '-r', '-f'], { capture: true });
    const lines = result.standardOut
    for (const line of lines) {
        const [name, version] = line.split('|');
        if (name && version) {
            yield { name, version };
        }
    }
}