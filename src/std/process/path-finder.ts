import { isNullOrWhiteSpace } from "../primitives/string-utils.ts"
import {env, IEnvironment} from "../env/mod.ts"
import { isFile, isFileAsync } from "../fs/mod.ts"
import { isAbsolute } from "../path/mod.ts"
import { which, whichAsync} from './which.ts'
import { isWindows, isDarwin } from "../runtime/mod.ts";
import {NotFoundOnPathError} from "./errors.ts";

export interface IPathFinderOptions {
    envVariable?: string
    paths?: string[]
    windows?: string[]
    linux?: string[]
    darwin?: string[]
}

export interface IPathFinderEntry {
    name: string
    executableName: string
    executablePath?: string
    options?: IPathFinderOptions
}

export interface IPathFinder {
    register(name: string, executableName: string, options?: IPathFinderOptions): IPathFinder

    find(name: string): string | undefined;

    findOrThrow(name: string): string;
}

let instance: IPathFinder | undefined;
const envDefault : IEnvironment = env;
const globalRegistry : { [key: string]: IPathFinderEntry } = {};

export function registerExecutable(
    name: string, 
    executableName: string, 
    options?: IPathFinderOptions,
    registry = globalRegistry) : void {
    registry[name] = {
        name: name,
        executableName: executableName,
        options: options
    }
}

export function findExecutable(name: string, prependPaths?: string[], env: IEnvironment = envDefault, registry = globalRegistry): string | undefined {
    const entry = registry[name];
        if (!entry) {
            registry[name] = {
                name: name,
                executableName: name,
            }
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
        if(env.has(varName))
        {
            exe = env.get(varName);
            if (!isNullOrWhiteSpace(exe) && isFile(exe!)) {
                entry.executablePath = exe;
                return exe;
            }
        }

        if(o?.paths?.length)
        {
            for (const next in o.paths)
            {
                const expanded = env.expand(o.paths[next]);
                if(isFile(expanded))
                {
                    entry.executablePath = expanded;
                    return expanded;
                }
            }
        }

        exe = which(entry.executableName, prependPaths, env);
        if(!isNullOrWhiteSpace(exe))
        {
            entry.executablePath = exe;
            return exe;
        }

        if(isWindows)
        {
            if(o?.windows?.length)
            {
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

        if(isDarwin && o?.darwin?.length)
        {
            for (const next in o.darwin) {
                const expanded = env.expand(next);
                if (isFile(expanded)) {
                    entry.executablePath = expanded;
                    return expanded;
                }
            }
        }

        if(o?.linux?.length)
        {
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

export async function findExecutableAsync(name: string, prependPaths?: string[], env: IEnvironment = envDefault, registry = globalRegistry): Promise<string | undefined> {
    const entry = registry[name];
        if (!entry) {
            registry[name] = {
                name: name,
                executableName: name,
            }
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
        if(env.has(varName))
        {
            exe = env.get(varName);
            if (!isNullOrWhiteSpace(exe) && await isFileAsync(exe!)) {
                entry.executablePath = exe;
                return exe;
            }
        }

        if(o?.paths?.length)
        {
            for (const next in o.paths)
            {
                const expanded = env.expand(o.paths[next]);
                const isF = await isFileAsync(expanded);
                if(isF)
                {
                    entry.executablePath = expanded;
                    return expanded;
                }
            }
        }

        exe = await whichAsync(entry.executableName, prependPaths, env);
        if(!isNullOrWhiteSpace(exe))
        {
            entry.executablePath = exe;
            return exe;
        }

        if(isWindows)
        {
            if(o?.windows?.length)
            {
                for (const next in o.windows) {
                    const expanded = env.expand(next);
                    const isF = await isFileAsync(expanded);
                    if(isF) {
                        entry.executablePath = expanded;
                        return expanded;
                    }
                }
            }

            return undefined
        }

        if(isDarwin)
        {
            if(o?.darwin?.length)
            {
                for (const next in o.darwin) {
                    const expanded = env.expand(next);
                    const isF = await isFileAsync(expanded);
                    if(isF) {
                        entry.executablePath = expanded;
                        return expanded;
                    }
                }
            }

            return undefined
        }

        if(o?.linux?.length)
        {
            for (const next in o.linux) {
                const expanded = env.expand(next);
                const isF = await isFileAsync(expanded);
                if(isF) {
                    entry.executablePath = expanded;
                    return expanded;
                }
            }
        }

       

        return undefined;
}

export function findExecutableOrThrow(name: string, prependPaths?: string[], env: IEnvironment = envDefault, registry = globalRegistry): string {
    const exe = findExecutable(name, prependPaths, env, registry);
    if(isNullOrWhiteSpace(exe))
    {
        const entry = registry[name];
        const exeName = entry.executablePath || entry.executableName;

        throw new NotFoundOnPathError(exeName);
    }

    return exe!;
}

export async function  findExecutableOrThrowAsync(name: string, prependPaths?: string[], env: IEnvironment = envDefault, registry = globalRegistry): Promise<string> {
    const exe = await findExecutableAsync(name, prependPaths, env, registry);
    if(isNullOrWhiteSpace(exe))
    {
        const entry = registry[name];
        const exeName = entry.executablePath || entry.executableName;

        throw new NotFoundOnPathError(exeName);
    }

    return exe!;
}

export class PathFinder implements IPathFinder
{
    #registry: { [key: string]: IPathFinderEntry }

    constructor() {
        this.#registry ={};
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