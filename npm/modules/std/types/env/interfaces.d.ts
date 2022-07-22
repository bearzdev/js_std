import { IRuntimeEnvironment, IVersion, OsFamily, RuntimeArch } from "../runtime/interfaces.js";
export declare type CiType = "circleci" | "github" | "gitlab" | "travisci" | 'jenkins' | 'azure' | 'appveyor' | 'bitbucket' | 'bamboo' | 'teamcity' | 'harness';
export interface IVariableGetter {
    (name: string): string | undefined;
}
export interface IColorSupport {
    readonly off: boolean;
    readonly level: number;
    readonly hasBasic: boolean;
    readonly has256: boolean;
    readonly has16m: boolean;
}
export interface IStreamColorSupport {
    readonly stdout: IColorSupport;
    readonly stderr: IColorSupport;
}
export interface IExpandOptions {
    windows?: boolean;
    linux?: boolean;
    throw?: boolean;
}
export interface IEnvVarUpdate {
    name: string;
    value: string | null;
    isSecret: boolean;
}
export interface IEnvironmentPath extends Iterable<string> {
    readonly value: string;
    readonly home: string;
    readonly homeConfig: string;
    readonly homeData: string;
    readonly desktop: string;
    readonly downloads: string;
    readonly tmp: string;
    readonly opt: string;
    readonly win: string;
    readonly winProgramFiles: string;
    readonly winProgramFilesX86: string;
    readonly winSystemDrive: string;
    has(name: string): boolean;
    append(name: string): void;
    prepend(name: string): void;
    remove(name: string): void;
}
export interface IEnvironmentVariables extends Iterable<[key: string, value: string]> {
    readonly keys: string[];
    readonly secrets: string[];
    readonly length: number;
    delete(name: string): void;
    dump(): void;
    expand: (value: string) => string;
    get(name: string): string | undefined;
    has(name: string): boolean;
    set(key: string, value: string): void;
    set(key: string, value: string, isSecret: boolean): void;
    toObject: () => {
        [key: string]: string;
    };
}
export interface IEnvironment {
    readonly userName: string;
    userInteractive: boolean;
    readonly machineName: string;
    readonly userDomainName: string;
    readonly os: OsFamily;
    readonly arch: RuntimeArch;
    readonly runtime: IRuntimeEnvironment;
    readonly runtimeName: string;
    readonly deno: boolean;
    readonly node: boolean;
    readonly browser: boolean;
    readonly newLine: string;
    readonly is64BitProcess: boolean;
    readonly processId: number;
    readonly commandLine: string;
    readonly commandLineArgs: string[];
    currentDirectory: string;
    readonly version: IVersion;
    exitCode: number;
    readonly vars: IEnvironmentVariables;
    readonly path: IEnvironmentPath;
    exit(code?: number): void;
    get(name: string): string | undefined;
    set(name: string, value: string): void;
    set(name: string, value: string, isSecret: boolean): void;
    delete(name: string): void;
    has(name: string): boolean;
    expand(value: string): string;
}
