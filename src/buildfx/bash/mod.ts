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
registerExecutable('bash', 'bash', {
    windows: [
        "%SystemRoot%\\System32\\bash.exe",
        "%ProgramFiles%\\Git\\user\\bin\\bash.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\bash.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\bash.exe",
        "%SystemDrive%\\msys\\usr\\bin\\bash.exe",
    ]
});

export function bash(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    return run('bash', args, options);
}

export function bashAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('bash', args, options);
}

export function bashScript(script: string, options?: IProcessInvocationOptions): IProcessResult {
    let fileName  = '';
    try {
        const encoder = new TextEncoder();
        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
        fileName += '.sh';
        const args = [];
        args.push('-noprofile', '--norc', '-e', '-o', 'pipefail',  `'${fileName}'`);

        writeFile(fileName, encoder.encode(script));
       
        return bash(args, options);
    } finally {
        if (fileName.length > 0)
            removeFile(fileName);
    }
}

export async function bashScriptASync(script: string, options?: IProcessInvocationOptions) : Promise<IProcessResult> {
    let fileName  = '';
    try {
        const encoder = new TextEncoder();
        const tmp = tmpDir();
        fileName = join(tmp, randomFileName());
         fileName += '.sh';
        const args = [];
        args.push('-noprofile', '--norc', '-e', '-o', 'pipefail',  `'${fileName}'`);
        await writeFileAsync(fileName, encoder.encode(script));
        return await bashAsync(args, options);
    } finally {
        if (fileName.length > 0)
            await removeFileAsync(fileName);
    }
}