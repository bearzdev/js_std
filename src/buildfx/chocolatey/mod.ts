import { IProcessInvocationOptions, IProcessResult, run, runAsync } from '../deps.ts';


export function choco(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    
    return run('chocolatey', args, options);
}

export function chocoAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    return runAsync('chocolatey', args, options);
}


export function chocoInstall(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    args.unshift('install');
    args.push('-y')
    return choco(args, options);
}

export function chocoInstallAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    args.unshift('install');
    args.push('-y')
    return chocoAsync(args, options);
}

export function chocoUninstall(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    args.unshift('uninstall');
    args.push('-y')
    return choco(args, options);
}

export function chocoUninstallAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    args.unshift('uninstall');
    args.push('-y')
    return chocoAsync(args, options);
}

export function chocoUpgrade(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    args.unshift('upgrade');
    args.push('-y')
    return choco(args, options);
}

export function chocoUpgradeAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    args.unshift('upgrade');
    args.push('-y')
    return chocoAsync(args, options);
}

export function chocoSource(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    args.unshift('source');
    return choco(args, options);
}

export function chocoSourceAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    args.unshift('source');
    return chocoAsync(args, options);
}

export function chocoSourceList(args: string[] = [], options?: IProcessInvocationOptions): IProcessResult {
    args.unshift('source', 'list');
    return choco(args, options);
}

export function chocoSourceListAsync(args: string[] = [], options?: IProcessInvocationOptions): Promise<IProcessResult> {
    args.unshift('source', 'list');
    return chocoAsync(args, options);
}


export function* chocoListJson(): Iterator<{name: string, version: string}> {
    const result = choco(['list', '-l', '-r', '-f'], { capture: true });
    const lines = result.standardOut
    for (const line of lines) {
        const [name, version] = line.split('|');
        if (name && version) {
            yield { name, version };
        }
    }
}

export async function* chocoListJsonAsync(): AsyncIterator<{name: string, version: string}> {
    const result = await chocoAsync(['list', '-l', '-r', '-f'], { capture: true });
    const lines = result.standardOut
    for (const line of lines) {
        const [name, version] = line.split('|');
        if (name && version) {
            yield { name, version };
        }
    }
}