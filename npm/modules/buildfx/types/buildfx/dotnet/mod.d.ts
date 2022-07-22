import { VisualStudioVersion, VisualStudioEditions } from './enums.js';
import { IProcessInvocationOptions, IProcessResult, CommandBuilder } from '../deps.js';
export { createMachineKey } from './machine-key.js';
export declare function dotnet(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function dotnet(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function dotnet(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function dotnetAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function dotnetAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function dotnetAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function getVisualStudioVersionArgs(version: VisualStudioVersion): string[];
export declare function getVisualStudioEditionArgs(edition: VisualStudioEditions): string[];
export declare function nuget(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function nuget(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function nuget(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function nugetAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function nugetAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function nugetAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function vsWhere(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function vsWhere(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function vsWhere(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare function vsWhereAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function vsWhereAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function vsWhereAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function findMsBuild(edition?: VisualStudioEditions, version?: VisualStudioVersion, is64Bit?: boolean, preRelease?: boolean, options?: IProcessInvocationOptions): string;
export declare function findVsTest(edition?: VisualStudioEditions, version?: VisualStudioVersion, preRelease?: boolean, options?: IProcessInvocationOptions): string;
export declare function vsTest(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function vsTest(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function vsTest(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare namespace vsTest {
    var path: string;
}
export declare function vsTestAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function vsTestAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function vsTestAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare namespace vsTestAsync {
    var path: string;
}
export declare function msBuild(args: string, options?: IProcessInvocationOptions): IProcessResult;
export declare function msBuild(args: string[], options?: IProcessInvocationOptions): IProcessResult;
export declare function msBuild(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult;
export declare namespace msBuild {
    var path: string;
}
export declare function msBuildAsync(args: string, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function msBuildAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare function msBuildAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>;
export declare namespace msBuildAsync {
    var path: string;
}
