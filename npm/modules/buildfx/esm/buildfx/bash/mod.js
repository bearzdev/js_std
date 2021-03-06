import { tmpDir, randomFileName, removeFileAsync, join, writeFile, removeFile, writeFileAsync, registerExecutable, isWindows, which, } from '../deps.js';
import { exec, execAsync } from "../util/_exec.js";
const exe = 'bash';
export function bash() {
    return exec(exe, arguments[0], arguments[1]);
}
export function bashAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
// C:\Program Files\bash\cmd\bash.exe
// C:\Program Files\bash\usr\bin
registerExecutable('bash', 'bash', {
    windows: [
        "%SystemRoot%\\System32\\bash.exe",
        "%ProgramFiles%\\bash\\user\\bin\\bash.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\bash.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\bash.exe",
        "%SystemDrive%\\msys\\usr\\bin\\bash.exe",
    ]
});
export function bashScript(script, options) {
    let fileName = '';
    try {
        const encoder = new TextEncoder();
        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.sh';
        const args = [];
        let bashFile = fileName;
        // wsl bash doesn't handle windows style paths, it uses a mount.
        // git bash does handle windows style paths.
        if (isWindows && which('bash')?.toLowerCase() === 'c:\\windows\\system32\\bash.exe') {
            bashFile = '/mnt/' + 'c' + bashFile.substring(1).replaceAll('\\', '/').replace(':', '');
        }
        args.push('-noprofile', '--norc', '-e', '-o', 'pipefail', `'${bashFile}'`);
        writeFile(fileName, encoder.encode(script));
        return bash(args, options);
    }
    finally {
        if (fileName.length > 0)
            removeFile(fileName);
    }
}
export async function bashScriptASync(script, options) {
    let fileName = '';
    try {
        const encoder = new TextEncoder();
        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.sh';
        const args = [];
        let bashFile = fileName;
        // wsl bash doesn't handle windows style paths, it uses a mount.
        // git bash does handle windows style paths.
        if (isWindows && which('bash')?.toLowerCase() === 'c:\\windows\\system32\\bash.exe') {
            bashFile = '/mnt/' + 'c' + bashFile.substring(1).replaceAll('\\', '/').replace(':', '');
        }
        args.push('-noprofile', '--norc', '-e', '-o', 'pipefail', `'${bashFile}'`);
        await writeFileAsync(fileName, encoder.encode(script));
        return await bashAsync(args, options);
    }
    finally {
        if (fileName.length > 0)
            await removeFileAsync(fileName);
    }
}
//# sourceMappingURL=mod.js.map