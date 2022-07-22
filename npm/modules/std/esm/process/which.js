var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PathFinder_registry;
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { env as envDefault } from "../env/mod.js";
import { isAbsolute, filenameWithoutExtension, filename, join, resolve, PATH_SEPARATOR, tmpDir } from "../path/mod.js";
import { randomFileName } from "../random/mod.js";
import { readDirectory, readDirectoryAsync, isFile, isFileAsync, isDirectory, isDirectoryAsync, writeFile, writeFileAsync, removeFile, removeFileAsync } from "../fs/mod.js";
import { isWindows, isDarwin } from "../runtime/mod.js";
import { isNullOrEmpty, isNullOrWhiteSpace } from "../primitives/string-utils.js";
import { notNull, notNullOrWhiteSpace } from "../errors/check.js";
import { NotFoundOnPathError } from "./errors.js";
import { ArgumentError } from "../errors/errors.js";
const executableCache = {};
/**
 * which - Returns the full path of the executable file of the given program;
 * otherwise, returns undefined.
 *
 * @remarks The returned path is the full path of the executable file of the given program
 * if the program can be found in the system PATH environment variable or
 * using any of the paths from `prependedPaths` if specified.
 *
 * By default, `which` will cache the first lookup and then use the cache
 * for subsequent lookups unless `useCache` is set to false.
 *
 * @param {string} fileName The program file name.
 * @param {(string[] | undefined)} prependPath The paths to prepend to the PATH environment variable.
 * @param {IEnvironment} env The environment class to use to lookup environment variables. Defaults to `envDefault`.
 * @param {boolean} useCache
 * @returns {string | undefined}
 */
export function which(fileName, prependPath, env = envDefault, useCache = true) {
    notNullOrWhiteSpace(fileName, 'fileName');
    notNull(env, 'env');
    const rootName = filenameWithoutExtension(fileName);
    let location = executableCache[rootName];
    if (useCache && location !== undefined) {
        return location;
    }
    if (isAbsolute(fileName) && isFile(fileName)) {
        location = fileName;
        if (useCache) {
            executableCache[rootName] = location;
            executableCache[fileName] = location;
        }
        return location;
    }
    prependPath = prependPath?.map(o => {
        if (isAbsolute(o))
            return o;
        return resolve(o);
    });
    const baseName = filename(fileName);
    const baseNameLowered = baseName.toLowerCase();
    const systemPaths = env.path.value.split(PATH_SEPARATOR)
        .filter(segment => segment.length > 0)
        .map(segment => env.expand(segment));
    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments = [];
    if (isWindows) {
        const pe = env.get('PATHEXT') || '';
        const pathExtensions = !isNullOrWhiteSpace(pe) ?
            pe?.toLowerCase() :
            ".com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh";
        pathExtSegments = pathExtensions.split(';')
            .filter(segment => !isNullOrWhiteSpace(segment));
    }
    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment) || !isDirectory(pathSegment))
            continue;
        if (isWindows) {
            const hasPathExt = pathExtSegments.find(segment => fileName.toLowerCase().endsWith(segment)) !== undefined;
            if (hasPathExt) {
                try {
                    const first = readDirectory(pathSegment)
                        .find(dirInfo => {
                        if (dirInfo.isFile && dirInfo.name) {
                            return dirInfo.name.toLowerCase() === baseNameLowered;
                        }
                    });
                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;
                        return location;
                    }
                }
                catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            }
            else {
                try {
                    const first = readDirectory(pathSegment)
                        .find(dirInfo => {
                        if (dirInfo.isFile && dirInfo.name) {
                            return filenameWithoutExtension(dirInfo.name).toLowerCase() === baseNameLowered;
                        }
                    });
                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;
                        return location;
                    }
                }
                catch (e) {
                    console.debug(e.toString());
                }
            }
        }
        else {
            try {
                const first = readDirectory(pathSegment)
                    .find(dirInfo => {
                    if (dirInfo.isFile && dirInfo.name) {
                        return dirInfo.name === baseName;
                    }
                });
                if (first?.name) {
                    location = join(pathSegment, first.name);
                    executableCache[rootName] = location;
                    executableCache[fileName] = location;
                    return location;
                }
            }
            catch (e) {
                console.debug(e.toString());
            }
        }
    }
    return undefined;
}
/**
 * which - Returns the full path of the executable file of the given program;
 * otherwise, returns undefined.
 *
 * @remarks The returned path is the full path of the executable file of the given program
 * if the program can be found in the system PATH environment variable or
 * using any of the paths from `prependedPaths` if specified.
 *
 * By default, `which` will cache the first lookup and then use the cache
 * for subsequent lookups unless `useCache` is set to false.
 *
 * @param {string} fileName The program file name.
 * @param {(string[] | undefined)} prependPath The paths to prepend to the PATH environment variable.
 * @param {IEnvironment} env The environment class to use to lookup environment variables. Defaults to `envDefault`.
 * @param {boolean} useCache
 * @returns {string | undefined}
 */
export async function whichAsync(fileName, prependPath, env = envDefault, useCache = true) {
    notNullOrWhiteSpace(fileName, 'fileName');
    notNull(env, 'env');
    const rootName = filenameWithoutExtension(fileName);
    let location = executableCache[rootName];
    if (useCache && location !== undefined) {
        return location;
    }
    if (isAbsolute(fileName) && await isFileAsync(fileName)) {
        location = fileName;
        if (useCache) {
            executableCache[rootName] = location;
            executableCache[fileName] = location;
        }
        return location;
    }
    prependPath = prependPath?.map(o => {
        if (isAbsolute(o))
            return o;
        return resolve(o);
    });
    const baseName = filename(fileName);
    const baseNameLowered = baseName.toLowerCase();
    const systemPaths = env.path.value.split(PATH_SEPARATOR)
        .filter(segment => segment.length > 0)
        .map(segment => env.expand(segment));
    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments = [];
    if (isWindows) {
        const pe = env.get('PATHEXT') || '';
        const pathExtensions = !isNullOrWhiteSpace(pe) ?
            pe?.toLowerCase() :
            ".com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh";
        pathExtSegments = pathExtensions.split(';')
            .filter(segment => !isNullOrWhiteSpace(segment));
    }
    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment))
            continue;
        const isDir = await isDirectoryAsync(pathSegment);
        if (!isDir)
            continue;
        if (isWindows) {
            const hasPathExt = pathExtSegments.find(segment => fileName.toLowerCase().endsWith(segment)) !== undefined;
            if (hasPathExt) {
                try {
                    const dirs = await readDirectoryAsync(pathSegment);
                    const first = dirs
                        .find(dirInfo => {
                        if (dirInfo.isFile && dirInfo.name) {
                            return dirInfo.name.toLowerCase() === baseNameLowered;
                        }
                    });
                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;
                        return location;
                    }
                }
                catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            }
            else {
                try {
                    const dirs = await readDirectoryAsync(pathSegment);
                    const first = dirs
                        .find(dirInfo => {
                        if (dirInfo.isFile && dirInfo.name) {
                            return filenameWithoutExtension(dirInfo.name).toLowerCase() === baseNameLowered;
                        }
                    });
                    if (first?.name) {
                        location = join(pathSegment, first.name);
                        executableCache[rootName] = location;
                        executableCache[fileName] = location;
                        return location;
                    }
                }
                catch (e) {
                    console.debug(e.toString());
                }
            }
        }
        else {
            try {
                const dirs = await readDirectoryAsync(pathSegment);
                const first = dirs
                    .find(dirInfo => {
                    if (dirInfo.isFile && dirInfo.name) {
                        return dirInfo.name === baseName;
                    }
                });
                if (first?.name) {
                    location = join(pathSegment, first.name);
                    executableCache[rootName] = location;
                    executableCache[fileName] = location;
                    return location;
                }
            }
            catch (e) {
                console.debug(e.toString());
            }
        }
    }
    return undefined;
}
let instance;
const globalRegistry = {};
export function registerExecutable(name, executableName, options, registry = globalRegistry) {
    registry[name] = {
        name: name,
        executableName: executableName,
        options: options
    };
}
export function findExecutable(name, prependPaths, env = envDefault, registry = globalRegistry) {
    let entry = registry[name];
    if (!entry) {
        entry = registry[name] = {
            name: name,
            executableName: name,
        };
    }
    let exe = entry.executablePath;
    if (!isNullOrWhiteSpace(exe)) {
        return exe;
    }
    exe = entry.executableName;
    if (isAbsolute(exe) && isFile(exe)) {
        entry.executablePath = exe;
        return exe;
    }
    const o = entry.options;
    const varName = o?.envVariable || `${entry.name.toUpperCase().replace('-', '_')}_PATH`;
    if (env.has(varName)) {
        exe = env.get(varName);
        if (!isNullOrWhiteSpace(exe) && isFile(exe)) {
            entry.executablePath = exe;
            return exe;
        }
    }
    if (o?.paths?.length) {
        for (const next in o.paths) {
            const expanded = env.expand(o.paths[next]);
            if (isFile(expanded)) {
                entry.executablePath = expanded;
                return expanded;
            }
        }
    }
    exe = which(entry.executableName, prependPaths, env);
    if (!isNullOrWhiteSpace(exe)) {
        entry.executablePath = exe;
        return exe;
    }
    if (isWindows) {
        if (o?.windows?.length) {
            for (const next in o.windows) {
                const expanded = env.expand(next);
                if (isFile(expanded)) {
                    entry.executablePath = expanded;
                    return expanded;
                }
            }
        }
        return undefined;
    }
    if (isDarwin && o?.darwin?.length) {
        for (const next in o.darwin) {
            const expanded = env.expand(next);
            if (isFile(expanded)) {
                entry.executablePath = expanded;
                return expanded;
            }
        }
    }
    if (o?.linux?.length) {
        for (const next in o.linux) {
            const expanded = env.expand(next);
            if (isFile(expanded)) {
                entry.executablePath = expanded;
                return expanded;
            }
        }
    }
    return undefined;
}
export async function findExecutableAsync(name, prependPaths, env = envDefault, registry = globalRegistry) {
    const entry = registry[name];
    if (!entry) {
        registry[name] = {
            name: name,
            executableName: name,
        };
    }
    let exe = entry.executablePath;
    if (!isNullOrWhiteSpace(exe)) {
        return exe;
    }
    exe = entry.executableName;
    if (isAbsolute(exe) && await isFileAsync(exe)) {
        entry.executablePath = exe;
        return exe;
    }
    const o = entry.options;
    const varName = o?.envVariable || `${entry.name.toUpperCase().replace('-', '_')}_PATH`;
    if (env.has(varName)) {
        exe = env.get(varName);
        if (!isNullOrWhiteSpace(exe) && await isFileAsync(exe)) {
            entry.executablePath = exe;
            return exe;
        }
    }
    if (o?.paths?.length) {
        for (const next in o.paths) {
            const expanded = env.expand(o.paths[next]);
            const isF = await isFileAsync(expanded);
            if (isF) {
                entry.executablePath = expanded;
                return expanded;
            }
        }
    }
    exe = await whichAsync(entry.executableName, prependPaths, env);
    if (!isNullOrWhiteSpace(exe)) {
        entry.executablePath = exe;
        return exe;
    }
    if (isWindows) {
        if (o?.windows?.length) {
            for (const next in o.windows) {
                const expanded = env.expand(next);
                const isF = await isFileAsync(expanded);
                if (isF) {
                    entry.executablePath = expanded;
                    return expanded;
                }
            }
        }
        return undefined;
    }
    if (isDarwin) {
        if (o?.darwin?.length) {
            for (const next in o.darwin) {
                const expanded = env.expand(next);
                const isF = await isFileAsync(expanded);
                if (isF) {
                    entry.executablePath = expanded;
                    return expanded;
                }
            }
        }
        return undefined;
    }
    if (o?.linux?.length) {
        for (const next in o.linux) {
            const expanded = env.expand(next);
            const isF = await isFileAsync(expanded);
            if (isF) {
                entry.executablePath = expanded;
                return expanded;
            }
        }
    }
    return undefined;
}
export function findExecutableOrThrow(name, prependPaths, env = envDefault, registry = globalRegistry) {
    const exe = findExecutable(name, prependPaths, env, registry);
    if (isNullOrWhiteSpace(exe)) {
        const entry = registry[name];
        const exeName = entry.executablePath || entry.executableName;
        throw new NotFoundOnPathError(exeName);
    }
    return exe;
}
export async function findExecutableOrThrowAsync(name, prependPaths, env = envDefault, registry = globalRegistry) {
    const exe = await findExecutableAsync(name, prependPaths, env, registry);
    if (isNullOrWhiteSpace(exe)) {
        const entry = registry[name];
        const exeName = entry.executablePath || entry.executableName;
        throw new NotFoundOnPathError(exeName);
    }
    return exe;
}
export class PathFinder {
    constructor() {
        _PathFinder_registry.set(this, void 0);
        __classPrivateFieldSet(this, _PathFinder_registry, {}, "f");
    }
    static get default() {
        return instance || (instance = new PathFinder());
    }
    static set default(value) {
        instance = value;
    }
    register(name, executableName, options) {
        registerExecutable(name, executableName, options, __classPrivateFieldGet(this, _PathFinder_registry, "f"));
        return this;
    }
    find(name, prependPaths, env = envDefault) {
        return findExecutable(name, prependPaths, env, __classPrivateFieldGet(this, _PathFinder_registry, "f"));
    }
    findAsync(name, prependPaths, env = envDefault) {
        return findExecutableAsync(name, prependPaths, env, __classPrivateFieldGet(this, _PathFinder_registry, "f"));
    }
    findOrThrow(name, prependPaths, env = envDefault) {
        return findExecutableOrThrow(name, prependPaths, env, __classPrivateFieldGet(this, _PathFinder_registry, "f"));
    }
    findOrThrowAsync(name, prependPaths, env = envDefault) {
        return findExecutableOrThrowAsync(name, prependPaths, env, __classPrivateFieldGet(this, _PathFinder_registry, "f"));
    }
}
_PathFinder_registry = new WeakMap();
export const pathFinder = PathFinder.default;
const nl = isWindows ? "\r\n" : "\n";
export { removeFile, removeFileAsync, };
export async function resolveScriptAsync(script, shell, startInfo) {
    if (isNullOrWhiteSpace(shell)) {
        shell = isWindows ? 'powershell' : 'bash';
    }
    const encoder = new TextEncoder();
    const tmp = tmpDir();
    let fileName = join(tmp, randomFileName());
    shell = shell.toLowerCase();
    const args = [];
    startInfo.fileName = shell;
    switch (shell) {
        case 'powershell':
        case 'pwsh':
            {
                fileName += '.ps1';
                const prepend = "$ErrorActionPreference = 'Stop'";
                const append = `if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }`;
                const scriptContent = prepend + nl + script + nl + append;
                await writeFileAsync(fileName, encoder.encode(scriptContent));
                args.push('-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command');
                args.push(`. '${fileName}'`);
                startInfo.args = args;
                return fileName;
            }
        case 'cmd':
            {
                fileName += '.cmd';
                const scriptContent = `@echo off ${nl}${script}`;
                await writeFileAsync(fileName, encoder.encode(scriptContent));
                args.push('/D', '/E:ON', '/V:OFF', '/S', '/C', `"CALL '${fileName}' \""`);
                startInfo.args = args;
                return fileName;
            }
        case 'bash':
            {
                fileName += '.sh';
                await writeFileAsync(fileName, encoder.encode(script));
                args.push('-noprofile', '--norc', '-e', '-o', 'pipefail', `'${fileName}'`);
                startInfo.args = args;
                return fileName;
            }
        case 'sh':
            {
                fileName += '.sh';
                await writeFileAsync(fileName, encoder.encode(script));
                args.push('-e', `'${fileName}'`);
                startInfo.args = args;
                return fileName;
            }
        case 'python':
            {
                fileName += '.py';
                await writeFileAsync(fileName, encoder.encode(script));
                args.push(`'${fileName}'`);
                return fileName;
            }
        case 'node':
        case 'nodejs':
            {
                fileName += '.js';
                await writeFileAsync(fileName, encoder.encode(script));
                args.push(`'${fileName}'`);
                return fileName;
            }
        case 'deno':
            {
                fileName += '.ts';
                await writeFileAsync(fileName, encoder.encode(script));
                args.push('--allow-all', '--unstable', `'${fileName}'`);
                return fileName;
            }
        case 'deno-js':
            {
                fileName += '.js';
                await writeFileAsync(fileName, encoder.encode(script));
                args.push('--allow-all', '--unstable', `'${fileName}'`);
                return fileName;
            }
        default:
            throw new ArgumentError('shell', `Unsupported shell: ${shell}`);
    }
}
export function resolveScript(script, shell, startInfo) {
    if (isNullOrWhiteSpace(shell)) {
        shell = isWindows ? 'powershell' : 'bash';
    }
    const encoder = new TextEncoder();
    const tmp = tmpDir();
    let fileName = join(tmp, randomFileName());
    shell = shell.toLowerCase();
    const args = [];
    startInfo.fileName = shell;
    switch (shell) {
        case 'powershell':
        case 'pwsh':
            {
                fileName += '.ps1';
                const prepend = "$ErrorActionPreference = 'Stop'";
                const append = `if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }`;
                const scriptContent = prepend + nl + script + nl + append;
                writeFile(fileName, encoder.encode(scriptContent));
                args.push('-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command');
                args.push(`. '${fileName}'`);
                startInfo.args = args;
                return fileName;
            }
        case 'cmd':
            {
                fileName += '.cmd';
                const scriptContent = `@echo off ${nl}${script}`;
                writeFile(fileName, encoder.encode(scriptContent));
                args.push('/D', '/E:ON', '/V:OFF', '/S', '/C', `"CALL '${fileName}' \""`);
                startInfo.args = args;
                return fileName;
            }
        case 'bash':
            {
                fileName += '.sh';
                writeFile(fileName, encoder.encode(script));
                args.push('-noprofile', '--norc', '-e', '-o', 'pipefail', `'${fileName}'`);
                startInfo.args = args;
                return fileName;
            }
        case 'sh':
            {
                fileName += '.sh';
                writeFile(fileName, encoder.encode(script));
                args.push('-e', `'${fileName}'`);
                startInfo.args = args;
                return fileName;
            }
        case 'python':
            {
                fileName += '.py';
                writeFile(fileName, encoder.encode(script));
                args.push(`'${fileName}'`);
                return fileName;
            }
        case 'node':
        case 'nodejs':
            {
                fileName += '.js';
                writeFile(fileName, encoder.encode(script));
                args.push(`'${fileName}'`);
                return fileName;
            }
        case 'deno':
            {
                fileName += '.ts';
                writeFile(fileName, encoder.encode(script));
                args.push('--allow-all', '--unstable', `'${fileName}'`);
                return fileName;
            }
        case 'deno-js':
            {
                fileName += '.js';
                writeFile(fileName, encoder.encode(script));
                args.push('--allow-all', '--unstable', `'${fileName}'`);
                return fileName;
            }
        default:
            throw new ArgumentError('shell', `Unsupported shell: ${shell}`);
    }
}
//# sourceMappingURL=which.js.map