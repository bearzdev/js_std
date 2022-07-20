import { 
    tmpDir, 
    randomFileName, 
    removeFileAsync, 
    IProcessInvocationOptions, 
    IProcessResult, 
    join, 
    isWindows, 
    writeFile, 
    removeFile, 
    writeFileAsync, 
    registerExecutable, 
    CommandBuilder,
} from '../deps.ts';

import { exec, execAsync } from "../util/_exec.ts";

const exe = 'pwsh';

export function pwsh(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function pwsh(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function pwsh(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function pwsh(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function pwshAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function pwshAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function pwshAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function pwshAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}

registerExecutable('pwsh', 'pwsh', {
    windows: [
        "%ProgramFiles%/PowerShell/7/pwsh.exe",
        "%ProgramFiles(x86)%/PowerShell/7/pwsh.exe",
        "%ProgramFiles%/PowerShell/6/pwsh.exe",
        "%ProgramFiles(x86)%/PowerShell/6/pwsh.exe",
    ]
});

export function pwshScript(script: string, options?: IProcessInvocationOptions): IProcessResult {
    let fileName  = '';
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
        return pwsh(args, options);
    } finally {
        if (fileName.length > 0)
            removeFile(fileName);
    }
}

export async function pwshScriptAsync(script: string, options?: IProcessInvocationOptions) : Promise<IProcessResult> {
    let fileName  = '';
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
        return pwshAsync(args, options);
    } finally {
        if (fileName.length > 0)
            await removeFileAsync(fileName);
    }
}