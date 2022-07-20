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
    PlatformNotSupportedError 
} from '../deps.ts';


export function powershell(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    if(!isWindows) 
        throw new PlatformNotSupportedError('powershell is only supported on windows.');

    return run('powershell', args, options);
}

export function powershellAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    if(!isWindows) 
        throw new PlatformNotSupportedError('powershell is only supported on windows.');

    return runAsync('powershell', args, options);
}

export function powershellScript(script: string, options?: IProcessInvocationOptions): IProcessResult {
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
        return powershell(args, options);
    } finally {
        if (fileName.length > 0)
            removeFile(fileName);
    }
}

export async function powershellScriptASync(script: string, options?: IProcessInvocationOptions) : Promise<IProcessResult> {
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
        return powershellAsync(args, options);
    } finally {
        if (fileName.length > 0)
            await removeFileAsync(fileName);
    }
}