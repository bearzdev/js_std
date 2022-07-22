import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { IEnvironment } from '../env/mod.js';
import { removeFile, removeFileAsync } from '../fs/mod.js';
import type { IPathFinder, IPathFinderEntry, IPathFinderOptions, IProcessStartInfo } from './interfaces.js';
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
export declare function which(fileName: string, prependPath?: string[], env?: IEnvironment, useCache?: boolean): string | undefined;
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
export declare function whichAsync(fileName: string, prependPath?: string[], env?: IEnvironment, useCache?: boolean): Promise<string | undefined>;
export declare function registerExecutable(name: string, executableName: string, options?: IPathFinderOptions, registry?: {
    [key: string]: IPathFinderEntry;
}): void;
export declare function findExecutable(name: string, prependPaths?: string[], env?: IEnvironment, registry?: {
    [key: string]: IPathFinderEntry;
}): string | undefined;
export declare function findExecutableAsync(name: string, prependPaths?: string[], env?: IEnvironment, registry?: {
    [key: string]: IPathFinderEntry;
}): Promise<string | undefined>;
export declare function findExecutableOrThrow(name: string, prependPaths?: string[], env?: IEnvironment, registry?: {
    [key: string]: IPathFinderEntry;
}): string;
export declare function findExecutableOrThrowAsync(name: string, prependPaths?: string[], env?: IEnvironment, registry?: {
    [key: string]: IPathFinderEntry;
}): Promise<string>;
export declare class PathFinder implements IPathFinder {
    #private;
    constructor();
    static get default(): IPathFinder;
    static set default(value: IPathFinder);
    register(name: string, executableName: string, options?: IPathFinderOptions): IPathFinder;
    find(name: string, prependPaths?: string[], env?: IEnvironment): string | undefined;
    findAsync(name: string, prependPaths?: string[], env?: IEnvironment): Promise<string | undefined>;
    findOrThrow(name: string, prependPaths?: string[], env?: IEnvironment): string;
    findOrThrowAsync(name: string, prependPaths?: string[], env?: IEnvironment): Promise<string>;
}
export declare const pathFinder: IPathFinder;
export { removeFile, removeFileAsync };
export declare function resolveScriptAsync(script: string, shell: string | undefined, startInfo: IProcessStartInfo): Promise<string>;
export declare function resolveScript(script: string, shell: string | undefined, startInfo: IProcessStartInfo): string;
