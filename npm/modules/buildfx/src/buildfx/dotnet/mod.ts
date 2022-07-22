import { VisualStudioVersion, VisualStudioEditions } from './enums.js'
import { 
    registerExecutable, 
    IProcessInvocationOptions,
    IProcessResult,
    CommandBuilder,
} from '../deps.js'

import { exec, execAsync } from "../util/_exec.js";
export { createMachineKey } from './machine-key.js'

const exe = 'dotnet';

export function dotnet(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function dotnet(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function dotnet(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function dotnet(): IProcessResult {
    return exec(exe, arguments[0], arguments[1]);
}

export function dotnetAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function dotnetAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function dotnetAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function dotnetAsync(): Promise<IProcessResult> {
    return execAsync(exe, arguments[0], arguments[1]);
}


registerExecutable('dotnet', 'dotnet.exe', {
    windows: [
        "%ProgramFiles%/dotnet/dotnet.exe",
        "%ProgramFiles(x86)%/dotnet/dotnet.exe",
    ]
})
registerExecutable('vswhere', 'vswhere.exe', {
    windows: [
        "%ChocolateyInstall%\\bin\\vswhere.exe",
        "%ProgramFiles(x86)%\\Microsoft Visual Studio\\Installer\\vswhere.exe",
    ]
})

export function getVisualStudioVersionArgs(version: VisualStudioVersion): string[] {
    switch (version) {
        case VisualStudioVersion.Latest:
            return ['--latest']
        case VisualStudioVersion.VisualStudio2022:
            return ['--version', '17.0']
        case VisualStudioVersion.VisualStudio2019:
            return ['--version', '16.0']
        case VisualStudioVersion.VisualStudio2017:
            return ['--version', '15.0']
        case VisualStudioVersion.VisualStudio2015:
            return ['--version', '14.0']
        default:
            throw new Error(`Unknown Visual Studio version: ${version}`)
    }
}

export function getVisualStudioEditionArgs(edition: VisualStudioEditions): string[] {
    const args = [];
    args.push("--edition");
    if(edition === VisualStudioEditions.All) {
        args.push("*");
        return args;
    }

    args.push(`Microsoft.VisualStudio.Product.${edition}`);
    return args;
}

export function nuget(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function nuget(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function nuget(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function nuget(): IProcessResult {
    return exec('nuget', arguments[0], arguments[1]);
}

export function nugetAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function nugetAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function nugetAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function nugetAsync(): Promise<IProcessResult> {
    return execAsync('nuget', arguments[0], arguments[1]);
}

export function vsWhere(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function vsWhere(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function vsWhere(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function vsWhere(): IProcessResult {
    return exec('vsWhere', arguments[0], arguments[1]);
}

export function vsWhereAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function vsWhereAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function vsWhereAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function vsWhereAsync(): Promise<IProcessResult> {
    return execAsync('vsWhere', arguments[0], arguments[1]);
}

export function findMsBuild(
    edition: VisualStudioEditions = VisualStudioEditions.Community,
    version: VisualStudioVersion = VisualStudioVersion.VisualStudio2022, 
    is64Bit?: boolean, 
    preRelease?: boolean, 
    options?: IProcessInvocationOptions): string {

    const args = [
        ...getVisualStudioVersionArgs(version),
        ...getVisualStudioEditionArgs(edition),
        "-property", "MSBuildBinPath",
    ];

    if (preRelease) {
        args.push("-prerelease");
    }

    const query = is64Bit ?
        "MSBuild\\**\\Bin\\amd64\\MSBuild.exe" :
        "MSBuild\\**\\Bin\\MSBuild.exe";

    args.push("-requires", "Microsoft.Component.MSBuild");
    args.push("-find", query);

    const result = vsWhere(args, options);
    if(result.standardOut && result.standardOut.length)
        return result.standardOut[0];

    return '';
}

export function findVsTest( edition: VisualStudioEditions = VisualStudioEditions.Community,
    version: VisualStudioVersion = VisualStudioVersion.VisualStudio2022, 
    preRelease?: boolean, 
    options?: IProcessInvocationOptions): string {
    
    const args = [
        ...getVisualStudioVersionArgs(version),
        ...getVisualStudioEditionArgs(edition),
        "-property", "MSBuildBinPath",
    ];

    if (preRelease) {
        args.push("-prerelease");
    }

    const query = "Common7\\IDE\\CommonExtensions\\Microsoft\\TestWindow\\vstest.console.exe"
    args.push("-find", query);


    const result = vsWhere(args, options);
    if(result.standardOut && result.standardOut.length)
        return result.standardOut[0];

    return '';
}

export function vsTest(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function vsTest(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function vsTest(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function vsTest(): IProcessResult {
    return exec(vsTest.path, arguments[0], arguments[1]);
}

export function vsTestAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function vsTestAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function vsTestAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function vsTestAsync(): Promise<IProcessResult> {
    return execAsync(vsTestAsync.path, arguments[0], arguments[1]);
}

vsTest.path = 'vstest.console.exe';
vsTestAsync.path = 'vstest.console.exe';

export function msBuild(args: string, options?: IProcessInvocationOptions) : IProcessResult
export function msBuild(args: string[], options?: IProcessInvocationOptions) : IProcessResult
export function msBuild(command: CommandBuilder, options?: IProcessInvocationOptions): IProcessResult
export function msBuild(): IProcessResult {
    return exec(msBuild.path, arguments[0], arguments[1]);
}

export function msBuildAsync(args: string, options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function msBuildAsync(args: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult>
export function msBuildAsync(command: CommandBuilder, options?: IProcessInvocationOptions): Promise<IProcessResult>
export function msBuildAsync(): Promise<IProcessResult> {
    return execAsync(msBuildAsync.path, arguments[0], arguments[1]);
}
msBuild.path = 'msbuild'
msBuildAsync.path = 'msbuild'