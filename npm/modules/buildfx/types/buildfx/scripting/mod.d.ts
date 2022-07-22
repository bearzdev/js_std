import { env, cwd, IProcessResult, StringBuilder, IProcessInvocationOptions, whichAsync, which } from '../deps.js';
import { bash, bashAsync, bashScript, bashScriptASync } from '../bash/mod.js';
import { pwsh, pwshAsync, pwshScript, pwshScriptAsync } from '../pwsh/mod.js';
import { isAdmin, isRoot, isProcessElevated } from '../util/mod.js';
export { bash, bashAsync, bashScript, bashScriptASync, cwd, env, isAdmin, isRoot, isProcessElevated, pwsh, pwshAsync, pwshScript, pwshScriptAsync, which, whichAsync };
export declare const cd: any;
export declare function exec(command: StringBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function exec(command: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function exec(command: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function execAsync(command: StringBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function execAsync(command: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function execAsync(command: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function getModuleFileInfo(importObj: {
    meta: ImportMeta;
}): {
    dir: any;
    file: any;
    name: any;
    ext: any;
};
export declare function echo(...args: unknown[]): void;
export declare function echo(result: IProcessResult): void;
export declare function pushd(path: string): void;
export declare function popd(): void;
