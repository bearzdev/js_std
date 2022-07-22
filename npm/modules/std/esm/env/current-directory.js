import { globalScope, isBrowser, isDeno, isNode } from '../runtime/mod.js';
let cwd;
let chdir;
if (isDeno) {
    cwd = () => globalScope.Deno.cwd();
    chdir = (path) => globalScope.Deno.chdir(path);
}
else if (isNode) {
    cwd = () => globalScope.process.cwd();
    chdir = (path) => globalScope.process.chdir(path);
}
else if (isBrowser) {
    cwd = () => globalScope.location.pathname;
    chdir = (path) => globalScope.location.pathname = path;
}
else {
    let currentDirectory = '/';
    cwd = () => currentDirectory;
    chdir = (path) => {
        currentDirectory = path;
    };
}
export { chdir, cwd };
//# sourceMappingURL=current-directory.js.map