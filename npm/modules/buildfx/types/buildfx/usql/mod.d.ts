import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from '../deps.js';
export declare function usql(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function usql(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function usql(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function usqlAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function usqlAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function usqlAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function usqlJson(args?: string[], options?: IProcessInvocationOptions): any | undefined;
