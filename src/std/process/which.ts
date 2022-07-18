
import { env as envDefault, IEnvironment } from "../env/mod.ts";
import { isAbsolute, filenameWithoutExtension, filename, join, resolve, PATH_SEPARATOR, } from "../path/mod.ts";
import { readDirectory, readDirectoryAsync, isFile, isFileAsync, isDirectory,isDirectoryAsync } from "../fs/mod.ts";
import { isWindows} from "../runtime/mod.ts";
import { isNullOrEmpty, isNullOrWhiteSpace } from "../primitives/string-utils.ts";
import { notNull, notNullOrWhiteSpace } from "../errors/check.ts";

const executableCache : { [key: string] : string | undefined} = {};

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
export function which(fileName: string, prependPath?: string[], env: IEnvironment = envDefault, useCache = true): string | undefined {
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

    prependPath = prependPath?.map<string>(o => {
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
    let pathExtSegments: string[] = [];

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
                } catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            } else {
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
                } catch (e) {
                    console.debug(e.toString());
                }
            }
        } else {
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
export async function whichAsync(fileName: string, prependPath?: string[], env: IEnvironment = envDefault, useCache = true): Promise<string | undefined> {
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

    prependPath = prependPath?.map<string>(o => {
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
    let pathExtSegments: string[] = [];

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
        if(!isDir)
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
                } catch (e) {
                    // TODO: replace with debug trace writer
                    console.debug(e.toString());
                }
            } else {
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
                } catch (e) {
                    console.debug(e.toString());
                }
            }
        } else {
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
            } catch (e) {
                console.debug(e.toString());
            }
        }
    }

    return undefined;
}
