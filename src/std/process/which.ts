import { env as envDefault, IEnvironment } from '../env/mod.ts';
import { filename, filenameWithoutExtension, isAbsolute, join, PATH_SEPARATOR, resolve, tmpDir } from '../path/mod.ts';
import { randomFileName } from '../random/mod.ts';
import {
    isDirectory,
    isDirectoryAsync,
    isFile,
    isFileAsync,
    readDirectory,
    readDirectoryAsync,
    removeFile,
    removeFileAsync,
    writeFile,
    writeFileAsync,
} from '../fs/mod.ts';
import { isDarwin, isWindows } from '../runtime/mod.ts';
import { isNullOrEmpty, isNullOrWhiteSpace } from '../primitives/string-utils.ts';
import { notNull, notNullOrWhiteSpace } from '../errors/check.ts';
import { NotFoundOnPathError } from './errors.ts';
import type { IPathFinder, IPathFinderEntry, IPathFinderOptions, IProcessStartInfo } from './interfaces.ts';
import { ArgumentError } from '../errors/errors.ts';

const executableCache: { [key: string]: string | undefined } = {};

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
export function which(
    fileName: string,
    prependPath?: string[],
    env: IEnvironment = envDefault,
    useCache = true,
): string | undefined {
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

    prependPath = prependPath?.map<string>((o) => {
        if (isAbsolute(o)) {
            return o;
        }

        return resolve(o);
    });

    const baseName = filename(fileName);
    const baseNameLowered = baseName.toLowerCase();

    const systemPaths = env.path.value.split(PATH_SEPARATOR)
        .filter((segment) => segment.length > 0)
        .map((segment) => env.expand(segment));

    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments: string[] = [];

    if (isWindows) {
        const pe = env.get('PATHEXT') || '';
        const pathExtensions = !isNullOrWhiteSpace(pe)
            ? pe?.toLowerCase()
            : '.com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh';

        pathExtSegments = pathExtensions.split(';')
            .filter((segment) => !isNullOrWhiteSpace(segment));
    }

    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment) || !isDirectory(pathSegment)) {
            continue;
        }

        if (isWindows) {
            const hasPathExt = pathExtSegments.find((segment) =>
                fileName.toLowerCase().endsWith(segment)
            ) !== undefined;

            if (hasPathExt) {
                try {
                    const first = readDirectory(pathSegment)
                        .find((dirInfo) => {
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
                } catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            } else {
                try {
                    const first = readDirectory(pathSegment)
                        .find((dirInfo) => {
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
                } catch (e) {
                    console.debug(e.toString());
                }
            }
        } else {
            try {
                const first = readDirectory(pathSegment)
                    .find((dirInfo) => {
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
            } catch (e) {
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
export async function whichAsync(
    fileName: string,
    prependPath?: string[],
    env: IEnvironment = envDefault,
    useCache = true,
): Promise<string | undefined> {
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

    prependPath = prependPath?.map<string>((o) => {
        if (isAbsolute(o)) {
            return o;
        }

        return resolve(o);
    });

    const baseName = filename(fileName);
    const baseNameLowered = baseName.toLowerCase();

    const systemPaths = env.path.value.split(PATH_SEPARATOR)
        .filter((segment) => segment.length > 0)
        .map((segment) => env.expand(segment));

    const pathSegments = prependPath !== undefined ? prependPath.concat(systemPaths) : systemPaths;
    let pathExtSegments: string[] = [];

    if (isWindows) {
        const pe = env.get('PATHEXT') || '';
        const pathExtensions = !isNullOrWhiteSpace(pe)
            ? pe?.toLowerCase()
            : '.com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh';

        pathExtSegments = pathExtensions.split(';')
            .filter((segment) => !isNullOrWhiteSpace(segment));
    }

    for (const pathSegment of pathSegments) {
        if (isNullOrEmpty(pathSegment)) {
            continue;
        }

        const isDir = await isDirectoryAsync(pathSegment);
        if (!isDir) {
            continue;
        }

        if (isWindows) {
            const hasPathExt = pathExtSegments.find((segment) =>
                fileName.toLowerCase().endsWith(segment)
            ) !== undefined;

            if (hasPathExt) {
                try {
                    const dirs = await readDirectoryAsync(pathSegment);
                    const first = dirs
                        .find((dirInfo) => {
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
                } catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            } else {
                try {
                    const dirs = await readDirectoryAsync(pathSegment);
                    const first = dirs
                        .find((dirInfo) => {
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
                } catch (e) {
                    console.debug(e.toString());
                }
            }
        } else {
            try {
                const dirs = await readDirectoryAsync(pathSegment);
                const first = dirs
                    .find((dirInfo) => {
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
            } catch (e) {
                console.debug(e.toString());
            }
        }
    }

    return undefined;
}

let instance: IPathFinder | undefined;
const globalRegistry: { [key: string]: IPathFinderEntry } = {};

export function registerExecutable(
    name: string,
    executableName: string,
    options?: IPathFinderOptions,
    registry = globalRegistry,
): void {
    registry[name] = {
        name: name,
        executableName: executableName,
        options: options,
    };
}

export function findExecutable(
    name: string,
    prependPaths?: string[],
    env: IEnvironment = envDefault,
    registry = globalRegistry,
): string | undefined {
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
        if (!isNullOrWhiteSpace(exe) && isFile(exe!)) {
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

export async function findExecutableAsync(
    name: string,
    prependPaths?: string[],
    env: IEnvironment = envDefault,
    registry = globalRegistry,
): Promise<string | undefined> {
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
        if (!isNullOrWhiteSpace(exe) && await isFileAsync(exe!)) {
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

export function findExecutableOrThrow(
    name: string,
    prependPaths?: string[],
    env: IEnvironment = envDefault,
    registry = globalRegistry,
): string {
    const exe = findExecutable(name, prependPaths, env, registry);
    if (isNullOrWhiteSpace(exe)) {
        const entry = registry[name];
        const exeName = entry.executablePath || entry.executableName;

        throw new NotFoundOnPathError(exeName);
    }

    return exe!;
}

export async function findExecutableOrThrowAsync(
    name: string,
    prependPaths?: string[],
    env: IEnvironment = envDefault,
    registry = globalRegistry,
): Promise<string> {
    const exe = await findExecutableAsync(name, prependPaths, env, registry);
    if (isNullOrWhiteSpace(exe)) {
        const entry = registry[name];
        const exeName = entry.executablePath || entry.executableName;

        throw new NotFoundOnPathError(exeName);
    }

    return exe!;
}

export class PathFinder implements IPathFinder {
    #registry: { [key: string]: IPathFinderEntry };

    constructor() {
        this.#registry = {};
    }

    static get default(): IPathFinder {
        return instance || (instance = new PathFinder());
    }

    static set default(value: IPathFinder) {
        instance = value;
    }

    register(name: string, executableName: string, options?: IPathFinderOptions): IPathFinder {
        registerExecutable(name, executableName, options, this.#registry);

        return this;
    }

    find(name: string, prependPaths?: string[], env: IEnvironment = envDefault): string | undefined {
        return findExecutable(name, prependPaths, env, this.#registry);
    }

    findAsync(name: string, prependPaths?: string[], env: IEnvironment = envDefault): Promise<string | undefined> {
        return findExecutableAsync(name, prependPaths, env, this.#registry);
    }

    findOrThrow(name: string, prependPaths?: string[], env: IEnvironment = envDefault): string {
        return findExecutableOrThrow(name, prependPaths, env, this.#registry);
    }

    findOrThrowAsync(name: string, prependPaths?: string[], env: IEnvironment = envDefault): Promise<string> {
        return findExecutableOrThrowAsync(name, prependPaths, env, this.#registry);
    }
}

export const pathFinder = PathFinder.default;

const nl = isWindows ? '\r\n' : '\n';

export { removeFile, removeFileAsync };

export async function resolveScriptAsync(
    script: string,
    shell: string | undefined,
    startInfo: IProcessStartInfo,
): Promise<string> {
    if (isNullOrWhiteSpace(shell)) {
        shell = isWindows ? 'powershell' : 'bash';
    }

    const encoder = new TextEncoder();

    const tmp = tmpDir();
    let fileName = join(tmp, randomFileName());

    shell = shell!.toLowerCase();

    const args: string[] = [];
    startInfo.fileName = shell;

    switch (shell) {
        case 'powershell':
        case 'pwsh': {
            fileName += '.ps1';
            const prepend = '$ErrorActionPreference = \'Stop\'';
            const append = `if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }`;
            const scriptContent = prepend + nl + script + nl + append;
            await writeFileAsync(fileName, encoder.encode(scriptContent));
            args.push('-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command');
            args.push(`. '${fileName}'`);

            startInfo.args = args;

            return fileName;
        }

        case 'cmd': {
            fileName += '.cmd';
            const scriptContent = `@echo off ${nl}${script}`;
            await writeFileAsync(fileName, encoder.encode(scriptContent));
            args.push('/D', '/E:ON', '/V:OFF', '/S', '/C', `"CALL '${fileName}' \""`);

            startInfo.args = args;

            return fileName;
        }

        case 'bash': {
            fileName += '.sh';
            await writeFileAsync(fileName, encoder.encode(script));
            args.push('-noprofile', '--norc', '-e', '-o', 'pipefail', `'${fileName}'`);
            startInfo.args = args;

            return fileName;
        }

        case 'sh': {
            fileName += '.sh';
            await writeFileAsync(fileName, encoder.encode(script));
            args.push('-e', `'${fileName}'`);

            startInfo.args = args;
            return fileName;
        }

        case 'python': {
            fileName += '.py';
            await writeFileAsync(fileName, encoder.encode(script));
            args.push(`'${fileName}'`);

            return fileName;
        }

        case 'node':
        case 'nodejs': {
            fileName += '.js';
            await writeFileAsync(fileName, encoder.encode(script));
            args.push(`'${fileName}'`);

            return fileName;
        }

        case 'deno': {
            fileName += '.ts';
            await writeFileAsync(fileName, encoder.encode(script));
            args.push('--allow-all', '--unstable', `'${fileName}'`);
            return fileName;
        }
        case 'deno-js': {
            fileName += '.js';
            await writeFileAsync(fileName, encoder.encode(script));
            args.push('--allow-all', '--unstable', `'${fileName}'`);
            return fileName;
        }

        default:
            throw new ArgumentError('shell', `Unsupported shell: ${shell}`);
    }
}

export function resolveScript(script: string, shell: string | undefined, startInfo: IProcessStartInfo): string {
    if (isNullOrWhiteSpace(shell)) {
        shell = isWindows ? 'powershell' : 'bash';
    }

    const encoder = new TextEncoder();

    const tmp = tmpDir();
    let fileName = join(tmp, randomFileName());

    shell = shell!.toLowerCase();

    const args: string[] = [];
    startInfo.fileName = shell;

    switch (shell) {
        case 'powershell':
        case 'pwsh': {
            fileName += '.ps1';
            const prepend = '$ErrorActionPreference = \'Stop\'';
            const append = `if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }`;
            const scriptContent = prepend + nl + script + nl + append;
            writeFile(fileName, encoder.encode(scriptContent));
            args.push('-ExecutionPolicy', 'Bypass', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command');
            args.push(`. '${fileName}'`);

            startInfo.args = args;

            return fileName;
        }

        case 'cmd': {
            fileName += '.cmd';
            const scriptContent = `@echo off ${nl}${script}`;
            writeFile(fileName, encoder.encode(scriptContent));
            args.push('/D', '/E:ON', '/V:OFF', '/S', '/C', `"CALL '${fileName}' \""`);

            startInfo.args = args;

            return fileName;
        }

        case 'bash': {
            fileName += '.sh';
            writeFile(fileName, encoder.encode(script));
            args.push('-noprofile', '--norc', '-e', '-o', 'pipefail', `'${fileName}'`);
            startInfo.args = args;

            return fileName;
        }

        case 'sh': {
            fileName += '.sh';
            writeFile(fileName, encoder.encode(script));
            args.push('-e', `'${fileName}'`);

            startInfo.args = args;
            return fileName;
        }

        case 'python': {
            fileName += '.py';
            writeFile(fileName, encoder.encode(script));
            args.push(`'${fileName}'`);

            return fileName;
        }

        case 'node':
        case 'nodejs': {
            fileName += '.js';
            writeFile(fileName, encoder.encode(script));
            args.push(`'${fileName}'`);

            return fileName;
        }

        case 'deno': {
            fileName += '.ts';
            writeFile(fileName, encoder.encode(script));
            args.push('--allow-all', '--unstable', `'${fileName}'`);
            return fileName;
        }
        case 'deno-js': {
            fileName += '.js';
            writeFile(fileName, encoder.encode(script));
            args.push('--allow-all', '--unstable', `'${fileName}'`);
            return fileName;
        }

        default:
            throw new ArgumentError('shell', `Unsupported shell: ${shell}`);
    }
}
