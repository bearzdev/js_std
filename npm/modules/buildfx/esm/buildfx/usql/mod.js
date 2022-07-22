import { run } from '../deps.js';
import { exec, execAsync } from "../util/_exec.js";
const exe = 'usql';
export function usql() {
    return exec(exe, arguments[0], arguments[1]);
}
export function usqlAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
// deno-lint-ignore no-explicit-any
export function usqlJson(args = [], options) {
    args.push('--json');
    const result = run('usql', args, options);
    if (options?.capture && result.standardOut && result.standardOut.length > 0) {
        const json = JSON.parse(result.standardOut.join('\n'));
        return json;
    }
    return undefined;
}
//# sourceMappingURL=mod.js.map