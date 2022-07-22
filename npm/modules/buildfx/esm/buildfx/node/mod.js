import { isWindows, env, join, findExecutableOrThrowAsync, findExecutableOrThrow } from '../deps.js';
import { exec, execAsync } from "../util/_exec.js";
const exe = 'node';
export function node() {
    return exec(exe, arguments[0], arguments[1]);
}
export function nodeAsync() {
    return execAsync(exe, arguments[0], arguments[1]);
}
const npmExe = isWindows ? 'npm.cmd' : 'npm';
export function npm() {
    return exec(npmExe, arguments[0], arguments[1]);
}
export function npmAsync() {
    return execAsync(npmExe, arguments[0], arguments[1]);
}
const yarnExe = isWindows ? 'yarn.cmd' : 'yarn';
export function yarn() {
    return exec(yarnExe, arguments[0], arguments[1]);
}
export function yarnAsync() {
    return execAsync(yarnExe, arguments[0], arguments[1]);
}
export function qunit() {
    const cli = findNpmBinFile('qunit-cli');
    return exec(cli, arguments[0], arguments[1]);
}
export async function qunitAsync() {
    const cli = await findNpmBinFileAsync('qunit-cli');
    return await execAsync(cli, arguments[0], arguments[1]);
}
export function gulp() {
    const cli = findNpmBinFile('gulp');
    return exec(cli, arguments[0], arguments[1]);
}
export async function gulpAsync() {
    const cli = await findNpmBinFileAsync('gulp');
    return await execAsync(cli, arguments[0], arguments[1]);
}
export function tsc() {
    const cli = findNpmBinFile('tsc');
    return exec(cli, arguments[0], arguments[1]);
}
export async function tscAsync() {
    const cli = await findNpmBinFileAsync('tsc');
    return await execAsync(cli, arguments[0], arguments[1]);
}
export function tsNode() {
    const cli = findNpmBinFile('ts-node');
    return exec(cli, arguments[0], arguments[1]);
}
export async function tsNodeAsync() {
    const cli = await findNpmBinFileAsync('ts-node');
    return await execAsync(cli, arguments[0], arguments[1]);
}
export function findNpmBinFile(exe, workingDirectory) {
    exe = isWindows ? `${exe}.cmd` : exe;
    workingDirectory ||= env.currentDirectory;
    const dir = join(workingDirectory, "node_modules", ".bin");
    return findExecutableOrThrow(exe, [dir]);
}
export async function findNpmBinFileAsync(exe, workingDirectory) {
    exe = isWindows ? `${exe}.cmd` : exe;
    workingDirectory ||= env.currentDirectory;
    const dir = join(workingDirectory, "node_modules", ".bin");
    return await findExecutableOrThrowAsync(exe, [dir]);
}
//# sourceMappingURL=mod.js.map