import { CommandBuilder, IProcessInvocationOptions, IProcessResult } from '../deps.js';
export declare function choco(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function choco(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function choco(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function chocoAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function chocoAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function chocoAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function chocoListJsonAsync(): AsyncIterator<{
    name: string;
    version: string;
}>;
