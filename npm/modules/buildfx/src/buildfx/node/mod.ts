import { isWindows, env, join, findExecutableOrThrowAsync, findExecutableOrThrow, IProcessInvocationOptions, IProcessResult, CommandBuilder } from '../deps.js';

import { exec, execAsync } from "../util/_exec.js";

const exe = 'node';

export function node(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function node(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function node(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function node(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function nodeAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function nodeAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function nodeAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function nodeAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}


const npmExe = isWindows ? 'npm.cmd' : 'npm';

export function npm(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function npm(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function npm(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function npm(): IProcessResult {
    return exec(npmExe, arguments[0], arguments[1]);
}

export function npmAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function npmAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function npmAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function npmAsync(): Promise<IProcessResult> {
    return execAsync(npmExe, arguments[0], arguments[1]);
}

const yarnExe = isWindows ? 'yarn.cmd' : 'yarn';

export function yarn(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function yarn(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function yarn(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function yarn(): IProcessResult {
    return exec(yarnExe, arguments[0], arguments[1]);
}

export function yarnAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function yarnAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function yarnAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function yarnAsync(): Promise<IProcessResult> {
    return execAsync(yarnExe, arguments[0], arguments[1]);
}


export function qunit(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function qunit(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function qunit(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function qunit(): IProcessResult {
    const cli = findNpmBinFile('qunit-cli')
    return exec(cli, arguments[0], arguments[1]);
}

export function qunitAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function qunitAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function qunitAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export async function qunitAsync(): Promise<IProcessResult> {
    const cli = await findNpmBinFileAsync('qunit-cli');
    return await execAsync(cli, arguments[0], arguments[1]);
}

export function gulp(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function gulp(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function gulp(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function gulp(): IProcessResult {
    const cli = findNpmBinFile('gulp')
    return exec(cli, arguments[0], arguments[1]);
}

export function gulpAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function gulpAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function gulpAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export async function gulpAsync(): Promise<IProcessResult> {
    const cli = await findNpmBinFileAsync('gulp');
    return await execAsync(cli, arguments[0], arguments[1]);
}


export function tsc(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function tsc(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function tsc(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function tsc(): IProcessResult {
    const cli = findNpmBinFile('tsc')
    return exec(cli, arguments[0], arguments[1]);
}

export function tscAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function tscAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function tscAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export async function tscAsync(): Promise<IProcessResult> {
    const cli = await findNpmBinFileAsync('tsc');
    return await execAsync(cli, arguments[0], arguments[1]);
}

export function tsNode(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function tsNode(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function tsNode(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function tsNode(): IProcessResult {
    const cli = findNpmBinFile('ts-node')
    return exec(cli, arguments[0], arguments[1]);
}

export function tsNodeAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function tsNodeAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function tsNodeAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export async function tsNodeAsync(): Promise<IProcessResult> {
    const cli = await findNpmBinFileAsync('ts-node');
    return await execAsync(cli, arguments[0], arguments[1]);
}

export function findNpmBinFile(exe: string, workingDirectory?: string) : string {
    exe = isWindows ? `${exe}.cmd` : exe;
    workingDirectory ||= env.currentDirectory;
    
    const dir = join(workingDirectory, "node_modules", ".bin");

    return findExecutableOrThrow(exe, [dir]);
}

export async function findNpmBinFileAsync(exe: string, workingDirectory?: string) : Promise<string> {
    exe = isWindows ? `${exe}.cmd` : exe;
    workingDirectory ||= env.currentDirectory;
    
    const dir = join(workingDirectory, "node_modules", ".bin");

    return await findExecutableOrThrowAsync(exe, [dir]);
}