import { isNode, isDeno, isBrowser, globalScope, isWindows } from "../runtime/mod.ts";


let cwd : () => string;
let chdir : (path: string) => void;
let exit : (code?: number) => void;
let commandLine = '';
let commandLineArgs : string[] = [];

let exitCode = 0;
let processId = 0;

export const newLine = isWindows ? '\r\n' : '\n';
export const setExitCode = (code: number) =>  exitCode = code;
export const getExitCode = () => exitCode;

if(isDeno) {
    cwd = () =>  globalScope.Deno.cwd();
    chdir = (path: string) => globalScope.Deno.chdir(path);
    exit = (code?: number) => globalScope.Deno.exit(code || exitCode);
    commandLine = globalScope.Deno.execPath();
    commandLineArgs = globalScope.Deno.args;
    processId = globalScope.Deno.pid;
} else if(isNode) {
    cwd = () => globalScope.process.cwd();
    chdir = (path: string) => globalScope.process.chdir(path);
    exit = (code?: number) => globalScope.process.exit(code || exitCode);
    commandLine = globalScope.process.execPath;
    commandLineArgs = globalScope.process.argv.slice(2)
    processId = globalScope.process.pid;
} else if(isBrowser) {
    cwd = () => globalScope.location.pathname;
    chdir = (path: string) => globalScope.location.pathname = path;
    commandLine = self.location.pathname;
    commandLineArgs = self.location.search.slice(1).split('&').map(s => s.split('=')[1]);
    exit = (code?: number) =>  {
        if(code) 
            exitCode = code;
        self.close();
    }
    if(sessionStorage.stdTabId)
    {
        const tabId = JSON.parse(sessionStorage.stdTabId);
        processId = tabId.pid;
    }
    else 
    {
        processId = Math.floor(Math.random() * 100000);
        import('../random/mod.ts').then(({ randomUUID }) => {
            const uuid = randomUUID();
            const tabId = {
                'uuid': uuid,
                'pid': processId
            }

            sessionStorage.stdTabId = JSON.stringify(tabId);
        })
    }

} else {
    let currentDirectory = "/";
    cwd = () => currentDirectory;
    chdir = (path: string) => { currentDirectory = path; };
    exit = (code?: number) => { console.debug ("exit", code); };
}

export { cwd, chdir, exit, processId, commandLine, commandLineArgs };