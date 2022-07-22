import { env, cwd, chdir, isAbsolute, fromArgs, join, fromFileUrl, parse, StringBuilder, run, ArgumentError, runAsync, whichAsync, which } from '../deps.js';
import { bash, bashAsync, bashScript, bashScriptASync } from '../bash/mod.js';
import { pwsh, pwshAsync, pwshScript, pwshScriptAsync } from '../pwsh/mod.js';
import { isAdmin, isRoot, isProcessElevated } from '../util/mod.js';
const pwd = env.currentDirectory;
const popState = [];
export { bash, bashAsync, bashScript, bashScriptASync, cwd, env, isAdmin, isRoot, isProcessElevated, pwsh, pwshAsync, pwshScript, pwshScriptAsync, which, whichAsync };
export const cd = chdir;
export function exec() {
    const first = arguments[0];
    const second = arguments[1];
    if (typeof first === 'string') {
        const args = fromArgs(first);
        const exe = args[0];
        args.splice(0, 1);
        return run(exe, args.splice(0, 1), second);
    }
    else if (Array.isArray(first)) {
        const args = first;
        const exe = args[0];
        args.splice(0, 1);
        return run(exe, args.splice(0, 1), second);
    }
    else if (first instanceof StringBuilder) {
        const args = fromArgs(first);
        const exe = args[0];
        args.splice(0, 1);
        return run(exe, args.splice(0, 1), second);
    }
    throw new ArgumentError("Invalid argument type");
}
export async function execAsync() {
    const first = arguments[0];
    const second = arguments[1];
    if (typeof first === 'string') {
        const args = fromArgs(first);
        const exe = args[0];
        return await runAsync(exe, args.splice(0, 1), second);
    }
    else if (Array.isArray(first)) {
        const args = first;
        const exe = args[0];
        return await runAsync(exe, args.splice(0, 1), second);
    }
    else if (first instanceof StringBuilder) {
        const args = fromArgs(first);
        const exe = args[0];
        return await runAsync(exe, args.splice(0, 1), second);
    }
    throw new ArgumentError("Invalid argument type");
}
export function getModuleFileInfo(importObj) {
    const module = importObj.meta.url;
    const path = fromFileUrl(module);
    const parsed = parse(path);
    return {
        dir: join(parsed.dir, parsed.base),
        file: parsed.base,
        name: parsed.name,
        ext: parsed.ext,
    };
}
export function echo() {
    const first = arguments[0];
    if (first === undefined) {
        return;
    }
    if (typeof first === 'object' && first.standardOut) {
        const result = first;
        for (const line in result.standardOut) {
            console.log(line);
        }
        return;
    }
    console.log(...arguments);
}
export function pushd(path) {
    path = env.expand(path);
    if (!isAbsolute(path))
        path = join(pwd, path);
    popState.push(path);
    chdir(path);
}
export function popd() {
    const path = popState.pop();
    if (path) {
        chdir(path);
    }
    else {
        chdir(pwd);
    }
}
//# sourceMappingURL=mod.js.map