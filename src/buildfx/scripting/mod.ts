import {  
    env, 
    cwd, 
    chdir, 
    isAbsolute, 
    fromArgs, 
    join, 
    IProcessResult, 
    fromFileUrl, 
    parse, 
    StringBuilder, 
    IProcessInvocationOptions, 
    run, 
    ArgumentError, 
    runAsync, 
    whichAsync, 
    which 
} from '../deps.ts';

import { bash, bashAsync, bashScript, bashScriptASync } from '../bash/mod.ts';
import { pwsh, pwshAsync, pwshScript, pwshScriptAsync } from '../pwsh/mod.ts';
import { isAdmin, isRoot, isProcessElevated } from '../util/mod.ts';

const pwd = env.currentDirectory;
const popState : string[] = [];

export { 
    bash, 
    bashAsync,
    bashScript, 
    bashScriptASync,
    cwd, 
    env,
    isAdmin,
    isRoot,
    isProcessElevated,
    pwsh,
    pwshAsync,
    pwshScript,
    pwshScriptAsync,
    which, 
    whichAsync 
}

export const cd = chdir;

export function exec(command: StringBuilder, options?: IProcessInvocationOptions): IProcessResult;
export function exec(command: string[], options?: IProcessInvocationOptions): IProcessResult;
export function exec(command: string, options?: IProcessInvocationOptions): IProcessResult;
export function exec() : IProcessResult {
    const first = arguments[0];
    const second = arguments[1] as undefined | IProcessInvocationOptions;

    if(typeof first === 'string') {
        const args = fromArgs(first);
        const exe = args[0];
        args.splice(0, 1);
        return run(exe, args.splice(0, 1), second);
    } else if(Array.isArray(first)) {
        const args = first;
        const exe = args[0];
        args.splice(0, 1);
        return run(exe, args.splice(0, 1), second);
    } else if (first instanceof StringBuilder) {
        const args = fromArgs(first);
        const exe = args[0];
        args.splice(0, 1);
        return run(exe, args.splice(0, 1), second);
    }

    throw new ArgumentError("Invalid argument type");
}

export async function execAsync(command: StringBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export async function execAsync(command: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export async function execAsync(command: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export async function execAsync() : Promise<IProcessResult> {
    const first = arguments[0];
    const second = arguments[1] as undefined | IProcessInvocationOptions;

    if(typeof first === 'string') {
        const args = fromArgs(first);
        const exe = args[0];
        return await runAsync(exe, args.splice(0, 1), second);
    } else if(Array.isArray(first)) {
        const args = first;
        const exe = args[0];
        return await runAsync(exe, args.splice(0, 1), second);
    } else if (first instanceof StringBuilder) {
        const args = fromArgs(first);
        const exe = args[0];
        return await runAsync(exe, args.splice(0, 1), second);
    }

    throw new ArgumentError("Invalid argument type");
}


export function getModuleFileInfo(importObj: { meta: ImportMeta }) {
    const module = importObj.meta.url;
    const path = fromFileUrl(module);
    const parsed = parse(path);
    return {
        dir: join(parsed.dir, parsed.base),
        file: parsed.base,
        name: parsed.name,
        ext: parsed.ext,
    }
}

export function echo(...args: unknown[]) : void
export function echo(result: IProcessResult) : void;
export function echo() {
    const first = arguments[0]
    if(first === undefined) {
        return;
    }

    if(typeof first === 'object' && first.standardOut) {
        const result = first as IProcessResult;
        for(const line in result.standardOut) {
            console.log(line);
        }
        return;
    }

    console.log(...arguments);
}

export function pushd(path: string) {
    path = env.expand(path);

    if(!isAbsolute(path))
        path = join(pwd, path);
    popState.push(path);
    chdir(path);
}

export function popd() {
    const path = popState.pop();
    if(path) {
        chdir(path);
    } else {
        chdir(pwd);
    }
}