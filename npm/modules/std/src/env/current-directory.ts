import { globalScope, isBrowser, isDeno, isNode } from '../runtime/mod.js';

let cwd: () => string;
let chdir: (path: string) => void;

if (isDeno) {
    cwd = () => globalScope.Deno.cwd();
    chdir = (path: string) => globalScope.Deno.chdir(path);
} else if (isNode) {
    cwd = () => globalScope.process.cwd();
    chdir = (path: string) => globalScope.process.chdir(path);
} else if (isBrowser) {
    cwd = () => globalScope.location.pathname;
    chdir = (path: string) => globalScope.location.pathname = path;
} else {
    let currentDirectory = '/';
    cwd = () => currentDirectory;
    chdir = (path: string) => {
        currentDirectory = path;
    };
}

export { chdir, cwd };
