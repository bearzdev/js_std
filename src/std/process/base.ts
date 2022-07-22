import { NotImplementedError } from '../errors/errors.ts';
import { IProcessInvocationContext, IProcessResult, IProcessRunner } from './interfaces.ts';
import { resolveScript, resolveScriptAsync } from './which.ts';

export const processRunner: IProcessRunner = {
    // deno-lint-ignore no-unused-vars
    run(context: IProcessInvocationContext): IProcessResult {
        throw new NotImplementedError();
    },

    // deno-lint-ignore no-unused-vars
    runAsync(context: IProcessInvocationContext): Promise<IProcessResult> {
        throw new NotImplementedError();
    },

    resolveShellScript: resolveScript,

    resolveShellScriptAsync: resolveScriptAsync,
};
