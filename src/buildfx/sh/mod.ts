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
CommandBuilder
} from '../deps.ts';

import { exec, execAsync } from "../util/_exec.ts";

const exe = 'sh';

export function sh(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function sh(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function sh(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function sh(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function shAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function shAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function shAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function shAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}


// C:\Program Files\sh\cmd\sh.exe
// C:\Program Files\sh\usr\bin
registerExecutable('sh', 'sh', {
    windows: [
        "%ProgramFiles%\\sh\\user\\bin\\sh.exe",
        "%ChocolateyInstall%\\msys2\\usr\\bin\\sh.exe",
        "%SystemDrive%\\msys64\\usr\\bin\\sh.exe",
        "%SystemDrive%\\msys\\usr\\bin\\sh.exe",
    ]
});


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