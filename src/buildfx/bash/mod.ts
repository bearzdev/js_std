import { 
    tmpDir, 
    randomFileName, 
    removeFileAsync, 
    IProcessInvocationOptions, 
    IProcessResult, 
    join, 
    writeFile, 
    removeFile, 
    writeFileAsync, 
    registerExecutable, 
    CommandBuilder,
} from '../deps.ts';

import { exec, execAsync } from "../util/_exec.ts";

const exe = 'bash';

export function bash(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function bash(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function bash(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function bash(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function bashAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function bashAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function bashAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function bashAsync(): Promise<IProcessResult> {
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