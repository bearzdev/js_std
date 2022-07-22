import { exec, execAsync } from "../util/_exec.js";
const exe = 'choco';
export function choco() {
    return exec(exe, arguments[0], arguments[1]);
}
export function chocoAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
export async function* chocoListJsonAsync() {
    const result = await chocoAsync(['list', '-l', '-r', '-f'], { capture: true });
    const lines = result.standardOut;
    for (const line of lines) {
        const [name, version] = line.split('|');
        if (name && version) {
            yield { name, version };
        }
    }
}
//# sourceMappingURL=mod.js.map