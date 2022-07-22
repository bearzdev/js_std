import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from "@bearz/std/process/mod.js";
export declare function exec(exe: string, args: string | string[] | CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function execAsync(exe: string, args: string | string[] | CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
