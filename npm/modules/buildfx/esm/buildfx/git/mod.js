import { registerExecutable, } from "../deps.js";
import { exec, execAsync } from "../util/_exec.js";
const exe = 'git';
export function git() {
    return exec(exe, arguments[0], arguments[1]);
}
export function gitAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
registerExecutable('git', 'git', {
    windows: [
        "%ProgramFiles%\\Git\\cmd\\git.exe",
        "%ProgramFiles(x86)%\\Git\\cmd\\git.exe",
    ]
});
//# sourceMappingURL=mod.js.map