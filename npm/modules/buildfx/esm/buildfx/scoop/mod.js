import { exec, execAsync } from "../util/_exec.js";
const exe = 'scoop';
export function scoop() {
    return exec(exe, arguments[0], arguments[1]);
}
export function scoopAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
//# sourceMappingURL=mod.js.map