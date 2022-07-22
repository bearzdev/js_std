import { run, runAsync } from "../deps.js";
export function terraform(args = [], options) {
    return run('terraform', args, options);
}
export function terraformAsync(args = [], options) {
    return runAsync('terraform', args, options);
}
//# sourceMappingURL=mod.js.map