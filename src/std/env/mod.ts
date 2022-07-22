import { IEnvironment, IEnvironmentPath, IEnvironmentVariables } from './interfaces.ts';
import {
    IRuntimeEnvironment,
    isBrowser,
    isDeno,
    isNode,
    isWindows,
    IVersion,
    OsFamily,
    Runtime,
    RuntimeArch,
    runtimeInfo,
} from '../runtime/mod.ts';
import {
    chdir,
    commandLine,
    commandLineArgs,
    cwd,
    exit,
    getExitCode,
    newLine,
    processId,
    setExitCode,
} from './process.ts';
import { EnvironmentVariables, envVars } from './variables.ts';
import { EnvironmentPath, envPath } from './path.ts';
import { getCiName, isCi } from './ci.ts';

export * from './interfaces.ts';

const userKey = isWindows ? 'USERNAME' : 'USER';
const machineNameKey = isWindows ? 'COMPUTERNAME' : 'HOSTNAME';
const userDomainKey = isWindows ? 'USERDOMAIN' : '';

export class Environment implements IEnvironment {
    #vars: IEnvironmentVariables;
    #path: IEnvironmentPath;
    #userInteractive = true;

    constructor(envVars: IEnvironmentVariables, envPath: IEnvironmentPath) {
        this.#vars = envVars;
        this.#path = envPath;
    }

    get userInteractive() {
        return this.#userInteractive;
    }

    set userInteractive(value: boolean) {
        this.#userInteractive = value;
    }

    get vars(): IEnvironmentVariables {
        return this.#vars;
    }

    get newLine(): string {
        return newLine;
    }

    get is64BitProcess(): boolean {
        return runtimeInfo.is64bitProcess;
    }

    get os(): OsFamily {
        return runtimeInfo.osFamily;
    }

    get arch(): RuntimeArch {
        return runtimeInfo.arch;
    }

    get runtimeName(): Runtime {
        return runtimeInfo.runtime;
    }

    get runtime(): IRuntimeEnvironment {
        return runtimeInfo;
    }

    get deno(): boolean {
        return isDeno;
    }

    get node(): boolean {
        return isNode;
    }

    get browser(): boolean {
        return isBrowser;
    }

    get processId(): number {
        return processId;
    }

    get machineName(): string {
        return this.#vars.get(machineNameKey) || '';
    }

    get userName(): string {
        return this.#vars.get(userKey) || '';
    }

    get userDomainName(): string {
        return this.#vars.get(userDomainKey) || '';
    }

    get isCi(): boolean {
        return isCi();
    }

    get ciName(): string | undefined {
        return getCiName();
    }

    get exitCode(): number {
        return getExitCode();
    }

    set exitCode(value: number) {
        setExitCode(value);
    }

    get commandLine(): string {
        return commandLine;
    }

    get commandLineArgs(): string[] {
        return commandLineArgs;
    }

    get currentDirectory(): string {
        return cwd();
    }

    set currentDirectory(value: string) {
        chdir(value);
    }

    get version(): IVersion {
        return runtimeInfo.version;
    }

    get path(): IEnvironmentPath {
        return this.#path;
    }

    expand(value: string): string {
        return this.#vars.expand(value);
    }

    has(name: string): boolean {
        return this.#vars.has(name);
    }

    get(name: string): string | undefined {
        return this.#vars.get(name);
    }

    set(name: string, value: string, isSecret = false): void {
        this.#vars.set(name, value, isSecret);
    }

    delete(name: string): void {
        this.#vars.delete(name);
    }

    exit(code?: number): void {
        exit(code);
    }
}

export const env = new Environment(envVars, envPath);

export {
    chdir,
    commandLine,
    commandLineArgs,
    cwd,
    EnvironmentPath,
    EnvironmentVariables,
    envPath,
    envVars,
    exit,
    getExitCode,
    machineNameKey,
    newLine,
    processId,
    runtimeInfo,
    setExitCode,
    userDomainKey,
    userKey,
};
