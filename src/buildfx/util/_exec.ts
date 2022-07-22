import { ArgumentError } from 'https://deno.land/x/js_std@$JS_VERSION/errors/mod.ts';
import {
    CommandBuilder,
    fromArgs,
    IProcessInvocationOptions,
    IProcessResult,
    run,
} from 'https://deno.land/x/js_std@$JS_VERSION/process/mod.ts';

export function exec(
    exe: string,
    args: string | string[] | CommandBuilder,
    options?: IProcessInvocationOptions,
): IProcessResult;
export function exec(): IProcessResult {
    if (arguments.length < 2) {
        throw new ArgumentError('arguments', 'There must be at least two arguments');
    }

    let parameters: string[];
    const exe = arguments[0] as string;
    const args = arguments[1] as string | string[] | CommandBuilder;
    const options = arguments[2] as IProcessInvocationOptions | undefined;

    if (typeof args === 'string') {
        parameters = fromArgs(args);
    } else if (Array.isArray(args)) {
        parameters = args;
    } else if (args instanceof CommandBuilder) {
        parameters = args.build();
    } else {
        throw new ArgumentError('args', 'Parameter args must be a string, string[], or CommandBuilder');
    }

    return run(exe, parameters, options);
}

export async function execAsync(
    exe: string,
    args: string | string[] | CommandBuilder,
    options?: IProcessInvocationOptions,
): Promise<IProcessResult>;
export async function execAsync(): Promise<IProcessResult> {
    if (arguments.length < 2) {
        throw new ArgumentError('arguments', 'There must be at least two arguments');
    }

    let parameters: string[];
    const exe = arguments[0] as string;
    const args = arguments[1] as string | string[] | CommandBuilder;
    const options = arguments[2] as IProcessInvocationOptions | undefined;

    if (typeof args === 'string') {
        parameters = fromArgs(args);
    } else if (Array.isArray(args)) {
        parameters = args;
    } else if (args instanceof CommandBuilder) {
        parameters = args.build();
    } else {
        throw new ArgumentError('args', 'Parameter args must be a string, string[], or CommandBuilder');
    }

    return await run(exe, parameters, options);
}
