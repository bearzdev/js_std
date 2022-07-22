import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from "../deps.js";
export declare function docker(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function docker(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function docker(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function dockerAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function dockerAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function dockerAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
