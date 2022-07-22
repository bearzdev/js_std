import { exec, execAsync } from "../util/_exec.js";
const exe = 'winget';
export function winget() {
    return exec(exe, arguments[0], arguments[1]);
}
export function wingetAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
//# sourceMappingURL=mod.js.map