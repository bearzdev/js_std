import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from "../deps.js";
export declare function winget(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function winget(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function winget(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function wingetAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function wingetAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function wingetAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
