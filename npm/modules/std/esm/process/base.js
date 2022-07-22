import { NotImplementedError } from '../errors/errors.js';
import { resolveScript, resolveScriptAsync } from './which.js';
export const processRunner = {
    // deno-lint-ignore no-unused-vars
    run(context) {
        throw new NotImplementedError();
    },
    // deno-lint-ignore no-unused-vars
    runAsync(context) {
        throw new NotImplementedError();
    },
    resolveShellScript: resolveScript,
    resolveShellScriptAsync: resolveScriptAsync,
};
//# sourceMappingURL=base.js.map