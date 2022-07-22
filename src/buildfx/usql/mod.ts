import { CommandBuilder, IProcessInvocationOptions, IProcessResult, run } from '../deps.ts';

import { exec, execAsync } from '../util/_exec.ts';

const exe = 'usql';

export function usql(args: string, options?: IProcessInvocationOptions): IProcessResult;
export function usql(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export function usql(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export function usql(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function usqlAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function usqlAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function usqlAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function usqlAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}

// deno-lint-ignore no-explicit-any
export function usqlJson(args: string[] = [], options?: IProcessInvocationOptions): any | undefined {
    args.push('--json');

    const result = run('usql', args, options);

    if (options?.capture && result.standardOut && result.standardOut.length > 0) {
        const json = JSON.parse(result.standardOut.join('\n'));
        return json;
    }

    return undefined;
}
