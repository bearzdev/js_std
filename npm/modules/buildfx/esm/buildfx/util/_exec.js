import { ArgumentError } from "@bearz/std/errors/mod.js";
import { CommandBuilder, fromArgs, run } from "@bearz/std/process/mod.js";
export function exec() {
    if (arguments.length < 2)
        throw new ArgumentError('arguments', 'There must be at least two arguments');
    let parameters;
    const exe = arguments[0];
    const args = arguments[1];
    const options = arguments[2];
    if (typeof args === 'string') {
        parameters = fromArgs(args);
    }
    else if (Array.isArray(args)) {
        parameters = args;
    }
    else if (args instanceof CommandBuilder) {
        parameters = args.build();
    }
    else {
        throw new ArgumentError('args', 'Parameter args must be a string, string[], or CommandBuilder');
    }
    return run(exe, parameters, options);
}
export async function execAsync() {
    if (arguments.length < 2)
        throw new ArgumentError('arguments', 'There must be at least two arguments');
    let parameters;
    const exe = arguments[0];
    const args = arguments[1];
    const options = arguments[2];
    if (typeof args === 'string') {
        parameters = fromArgs(args);
    }
    else if (Array.isArray(args)) {
        parameters = args;
    }
    else if (args instanceof CommandBuilder) {
        parameters = args.build();
    }
    else {
        throw new ArgumentError('args', 'Parameter args must be a string, string[], or CommandBuilder');
    }
    return await run(exe, parameters, options);
}
//# sourceMappingURL=_exec.js.map