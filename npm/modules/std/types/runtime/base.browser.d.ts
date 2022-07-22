import type { Browser, Engine, IRuntimeEnvironment, IVersion, OsFamily, Runtime, RuntimeArch } from './interfaces.js';
import { Version } from './version.js';
import { globalScope } from './global.js';
export { Browser, Engine, globalScope, IRuntimeEnvironment, IVersion, OsFamily, Runtime, RuntimeArch, Version };
export declare function getBrowserRuntimeInformation(): Promise<IRuntimeEnvironment>;
