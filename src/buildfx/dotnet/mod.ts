import { VisualStudioVersion, VisualStudioEditions } from './enums.ts'
import { 
    run,
    runAsync,
    registerExecutable, 
    IProcessInvocationOptions,
    IProcessResult,
} from '../deps.ts'


registerExecutable('dotnet', 'dotnet.exe', {
    windows: [
        "%ProgramFiles%/dotnet/dotnet.exe",
        "%ProgramFiles(x86)%/dotnet/dotnet.exe",
    ]
})
registerExecutable('vswhere', 'vswhere.exe', {
    windows: [
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

export function nuget(args?: string[], options?: IProcessInvocationOptions): IProcessResult {
    return run("nuget", args, options);
}

export function nugetAsync(args?: string[], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync("nuget", args, options);
}

export function vsWhere(args?: string[], options?: IProcessInvocationOptions): IProcessResult {
    return run('vswhere', args, options);
}

export function vsWhereAsync(args?: string[], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('vswhere', args, options);
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

export function vsTest(args?: string[], options?: IProcessInvocationOptions): IProcessResult {
    const p = vsTest.path;
    return run(p, args, options);
}

export function vsTestAsync(args?: string[], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    const p = vsTestAsync.path;
    return runAsync(p, args, options);
}

vsTest.path = 'vstest.console.exe';
vsTestAsync.path = 'vstest.console.exe';

export function msBuild(args: string[], options?: IProcessInvocationOptions): IProcessResult {
    const p = msBuild.path;
    return run(p, args || [], options);
}

export function msBuildAsync(args: string[], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    const p = msBuildAsync.path;

    return runAsync(p, args, options);
}

msBuild.path = 'msbuild'
msBuildAsync.path = 'msbuild'

export function dotnet(args?: string[], options?: IProcessInvocationOptions): IProcessResult {
    return run('dotnet', args, options);
}

export function dotnetAsync(args?: string[], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('dotnet', args, options);
}