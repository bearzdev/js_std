import { 
    DirectoryNotFoundError, 
    InvalidOperationError, 
    env, 
    isDirectory, 
    isWindows, 
    join, 
    DIRECTORY_SEPARATOR,
    registerExecutable,
    run,
isDirectoryAsync, } from '../deps.ts';


export function getNvsHome() {

    if (env.has("NVS_HOME")) {
        return env.get("NVS_HOME");
    }

    if (isWindows) {
        const appData = env.get("LOCALAPPDATA");
        if (!appData) {
            return undefined;
        }

        const dir = join(appData, "nvs");
        if(isDirectory(dir))
           env.set("NVS_HOME", dir);
        
        return dir;
    }
    const home = env.get("HOME");
    if (!home) {
        return undefined;
    }
    
    const linuxDir = join(home, ".nvs")
    if(isDirectory(linuxDir))
        env.set("NVS_HOME", linuxDir);

    return linuxDir;
}

export async function getNvsHomeAsync() {

    if (env.has("NVS_HOME")) {
        return env.get("NVS_HOME");
    }

    if (isWindows) {
        const appData = env.get("LOCALAPPDATA");
        if (!appData) {
            return undefined;
        }

        const dir = join(appData, "nvs");
        if(await isDirectoryAsync(dir))
           env.set("NVS_HOME", dir);
        
        return dir;
    }
    const home = env.get("HOME");
    if (!home) {
        return undefined;
    }
    
    const linuxDir = join(home, ".nvs")
    if(await isDirectoryAsync(linuxDir))
        env.set("NVS_HOME", linuxDir);

    return linuxDir;
}

registerExecutable('nvs', 'nvs', {
    windows: ['%NVS_HOME%\\nvs.cmd'],
    linux: ['%NVS_HOME%/nvs'],
});

export async function nvsUseAsync(version: string, arch = 'x64') {
    const nvsHome = getNvsHome();
    if (!nvsHome) {
        throw new InvalidOperationError("NVS_HOME is not set.");
    }

    const nodeDir = join(nvsHome, "node")

    let isDir = await isDirectoryAsync(nodeDir);
    if (!isDir) {
        throw new DirectoryNotFoundError(nodeDir);    
    }

    const versionDir = join(nodeDir, version, arch);

    isDir = await isDirectoryAsync(versionDir);
    if (!isDir) {
        throw new DirectoryNotFoundError(versionDir);
    }

    const currentPath = env.path.value.split(DIRECTORY_SEPARATOR).find(p => p.startsWith(nvsHome));
    if(currentPath) {
        env.path.remove(currentPath);
    }

    env.path.prepend(versionDir);
}


export function nvsUse(version: string, arch = 'x64') {
    const nvsHome = getNvsHome();
    if (!nvsHome) {
        throw new InvalidOperationError("NVS_HOME is not set.");
    }

    const nodeDir = join(nvsHome, "node")

    if (!isDirectory(nodeDir)) {
        throw new DirectoryNotFoundError(nodeDir);    
    }

    const versionDir = join(nodeDir, version, arch);

    if (!isDirectory(versionDir)) {
        throw new DirectoryNotFoundError(versionDir);
    }

    const currentPath = env.path.value.split(DIRECTORY_SEPARATOR).find(p => p.startsWith(nvsHome));
    if(currentPath) {
        env.path.remove(currentPath);
    }

    env.path.prepend(versionDir);
}

export function nvsAdd(version: string) {
    return run('nvs', ['add', version]);
}
