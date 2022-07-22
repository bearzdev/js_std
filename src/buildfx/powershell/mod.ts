import {
    CommandBuilder,
    IProcessInvocationOptions,
    IProcessResult,
    isWindows,
    join,
    randomFileName,
    removeFile,
    removeFileAsync,
    tmpDir,
    writeFile,
    writeFileAsync,
} from '../deps.ts';

import { exec, execAsync } from '../util/_exec.ts';

const exe = isWindows ? 'powershell' : 'pwsh';

export function powershell(args: string, options?: IProcessInvocationOptions): IProcessResult;
export function powershell(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export function powershell(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export function powershell(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function powershellAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function powershellAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function powershellAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export function powershellAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}

export function powershellScript(script: string, options?: IProcessInvocationOptions): IProcessResult {
    let fileName = '';
    try {
        const encoder = new TextEncoder();

        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.ps1';
        const nl = isWindows ? '\r\n' : '\n';

        const prepend = '$ErrorActionPreference = \'Stop\'';
        const append = `if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }`;
        const scriptContent = prepend + nl + script + nl + append;
        writeFile(fileName, encoder.encode(scriptContent));
        const args = [];
        args.push('-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command');
        args.push(`. '${fileName}'`);
        return powershell(args, options);
    } finally {
        if (fileName.length > 0) {
            removeFile(fileName);
        }
    }
}

export async function powershellScriptASync(
    script: string,
    options?: IProcessInvocationOptions,
): Promise<IProcessResult> {
    let fileName = '';
    try {
        const encoder = new TextEncoder();

        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.ps1';
        const nl = isWindows ? '\r\n' : '\n';

        const prepend = '$ErrorActionPreference = \'Stop\'';
        const append = `if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }`;
        const scriptContent = prepend + nl + script + nl + append;
        await writeFileAsync(fileName, encoder.encode(scriptContent));
        const args = [];
        args.push('-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command');
        args.push(`. '${fileName}'`);
        return powershellAsync(args, options);
    } finally {
        if (fileName.length > 0) {
            await removeFileAsync(fileName);
        }
    }
}
