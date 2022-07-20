import { env, IProcessInvocationOptions, IProcessResult, registerExecutable, run } from '../deps.ts'

registerExecutable('usql', 'usql');

export function usql(args?: string[], options?: IProcessInvocationOptions): IProcessResult {
    return run('usql', args, options);
}

// deno-lint-ignore no-explicit-any
export function usqlJson(args: string[] = [], options?: IProcessInvocationOptions): any | undefined {
    args.push('--json');

    const result = run('usql', args, options);

    if(options?.capture && result.standardOut && result.standardOut.length > 0) {
        const json = JSON.parse(result.standardOut.join('\n'));
        return json;
    }

    return undefined;
}