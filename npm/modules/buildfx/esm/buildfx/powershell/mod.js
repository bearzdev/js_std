import { tmpDir, randomFileName, removeFileAsync, join, isWindows, writeFile, removeFile, writeFileAsync, } from '../deps.js';
import { exec, execAsync } from "../util/_exec.js";
const exe = isWindows ? 'powershell' : 'pwsh';
export function powershell() {
    return exec(exe, arguments[0], arguments[1]);
}
export function powershellAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
export function powershellScript(script, options) {
    let fileName = '';
    try {
        const encoder = new TextEncoder();
        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.ps1';
        const nl = isWindows ? "\r\n" : "\n";
        const prepend = "$ErrorActionPreference = 'Stop'";
        const append = `if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }`;
        const scriptContent = prepend + nl + script + nl + append;
        writeFile(fileName, encoder.encode(scriptContent));
        const args = [];
        args.push('-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command');
        args.push(`. '${fileName}'`);
        return powershell(args, options);
    }
    finally {
        if (fileName.length > 0)
            removeFile(fileName);
    }
}
export async function powershellScriptASync(script, options) {
    let fileName = '';
    try {
        const encoder = new TextEncoder();
        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.ps1';
        const nl = isWindows ? "\r\n" : "\n";
        const prepend = "$ErrorActionPreference = 'Stop'";
        const append = `if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }`;
        const scriptContent = prepend + nl + script + nl + append;
        await writeFileAsync(fileName, encoder.encode(scriptContent));
        const args = [];
        args.push('-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command');
        args.push(`. '${fileName}'`);
        return powershellAsync(args, options);
    }
    finally {
        if (fileName.length > 0)
            await removeFileAsync(fileName);
    }
}
//# sourceMappingURL=mod.js.map