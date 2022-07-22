import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from "../deps.js";
export declare function scoop(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function scoop(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function scoop(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function scoopAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function scoopAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function scoopAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
