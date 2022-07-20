import { 
    run, 
    runAsync, 
    tmpDir, 
    randomFileName, 
    removeFileAsync, 
    IProcessInvocationOptions, 
    IProcessResult, 
    join, 
    writeFile, 
    removeFile, 
    writeFileAsync, 
    registerExecutable 
} from '../deps.ts';

// C:\Program Files\Git\cmd\git.exe
// C:\Program Files\Git\usr\bin
registerExecutable('sh', 'sh', {
    windows: [
        "%ProgramFiles%\\Git\\user\\bin\\sh.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\sh.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\sh.exe",
        "%SystemDrive%\\msys\\usr\\bin\\sh.exe",
    ]
});

export function sh(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('sh', args, options);
}

export function shAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('sh', args, options);
}

export function shScript(script: string, options?: IProcessInvocationOptions): IProcessResult {
    let fileName  = '';
    try {
        const encoder = new TextEncoder();
        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.sh';
        const args = [];
        args.push('-e', `'${fileName}'`);
        writeFile(fileName, encoder.encode(script));
      
        return sh(args, options);
    } finally {
        if (fileName.length > 0)
            removeFile(fileName);
    }
}

export async function shScriptASync(script: string, options?: IProcessInvocationOptions) : Promise<IProcessResult> {
    let fileName  = '';
    try {
        const encoder = new TextEncoder();
        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.sh';
        const args = [];
        args.push('-e', `'${fileName}'`);
        await writeFileAsync(fileName, encoder.encode(script));
        return await shAsync(args, options);
    } finally {
        if (fileName.length > 0)
            await removeFileAsync(fileName);
    }
}