import { Version } from './version.js';
export declare type Engine = 'v8' | 'spidermonkey' | 'jsc' | 'chromium' | 'rhino' | 'unknown';
export declare type Runtime = 'deno' | 'node' | 'browser' | 'electron' | 'unknown';
export declare type Browser = 'chrome' | 'chromium' | 'edge' | 'firefox' | 'ie' | 'opera' | 'safari' | 'brave' | 'unknown';
export interface IRuntimeEnvironment {
    readonly version: Version;
    readonly engine: Engine;
    readonly runtime: Runtime;
    readonly browser?: string;
}
export declare const runtimeInfo: IRuntimeEnvironment;
export declare const isDeno: boolean;
export declare const isNode: boolean;
export declare const isBrowser: boolean;
