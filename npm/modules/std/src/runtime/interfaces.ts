export type Engine = 'v8' | 'spidermonkey' | 'jsc' | 'chromium' | 'rhino' | 'unknown';
export type Runtime = 'deno' | 'node' | 'browser' | 'electron' | 'unknown';
export type Browser = 'chrome' | 'chromium' | 'edge' | 'firefox' | 'ie' | 'opera' | 'safari' | 'brave' | 'unknown';
export type OsFamily =
    | 'unix'
    | 'linux'
    | 'darwin'
    | 'windows'
    | 'sunos'
    | 'freebsd'
    | 'openbsd'
    | 'netbsd'
    | 'aix'
    | 'unknown';
export type RuntimeArch =
    | 'arm'
    | 'arm64'
    | 'ia32'
    | 'mips'
    | 'mipsel'
    | 'ppc'
    | 'ppc64'
    | 's390'
    | 's390x'
    | 'x64'
    | 'x86_64'
    | 'x86'
    | 'aarch'
    | 'aarch64'
    | 'unknown';

export interface IVersion {
    readonly major: number;
    readonly minor: number;
    readonly build: number;
    readonly revision: number;
}

export interface IRuntimeEnvironment {
    readonly version: IVersion;
    readonly engine: Engine;
    readonly runtime: Runtime;
    readonly browser?: string;
    readonly osFamily: OsFamily;
    readonly arch: RuntimeArch;
    readonly mobile: boolean;
    readonly osVersion: string;

    readonly debug: boolean;

    readonly trace: boolean;

    readonly is64bitProcess: boolean;
    // deno-lint-ignore no-explicit-any
    readonly data: { [key: string]: any };
}
