import { registerExecutable } from "../deps.js";
import { exec, execAsync } from "../util/_exec.js";
const exe = 'docker';
export function docker() {
    return exec(exe, arguments[0], arguments[1]);
}
export function dockerAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
registerExecutable('docker', 'docker', {
    windows: [
        "%ProgramFiles%\\Docker\\Docker\\resources\\bin\\docker.exe",
    ]
});
//# sourceMappingURL=mod.js.map