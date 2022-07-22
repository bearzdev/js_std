import type { IRuntimeEnvironment, Browser, Engine, RuntimeArch, IVersion, OsFamily, Runtime } from './interfaces.js';
import { Version } from './version.js';
import { globalScope } from './global.js';
export { Version, IVersion, IRuntimeEnvironment, Browser, Engine, RuntimeArch, OsFamily, Runtime, globalScope, };
export declare function getBrowserRuntimeInformation(): Promise<IRuntimeEnvironment>;
