import { 
    run, 
    runAsync, 
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
    registerExecutable 
} from '../deps.ts';


registerExecutable('pwsh', 'pwsh', {
    windows: [
        "%ProgramFiles%/PowerShell/7/pwsh.exe",
        "%ProgramFiles(x86)%/PowerShell/7/pwsh.exe",
        "%ProgramFiles%/PowerShell/6/pwsh.exe",
        "%ProgramFiles(x86)%/PowerShell/6/pwsh.exe",
    ]
});

export function pwsh(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('pwsh', args, options);
}

export function pwshAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('pwsh', args, options);
}

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