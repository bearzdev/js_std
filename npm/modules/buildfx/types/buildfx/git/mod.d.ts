import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from "../deps.js";
export declare function git(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function git(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function git(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function gitAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function gitAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function gitAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
