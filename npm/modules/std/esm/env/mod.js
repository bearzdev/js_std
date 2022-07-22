var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Environment_vars, _Environment_path, _Environment_userInteractive;
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { runtimeInfo, isDeno, isBrowser, isNode, isWindows } from '../runtime/mod.js';
import { newLine, processId, getExitCode, setExitCode, commandLine, commandLineArgs, chdir, cwd, exit } from "./process.js";
import { envVars, EnvironmentVariables } from "./variables.js";
import { envPath, EnvironmentPath } from "./path.js";
import { getCiName, isCi } from "./ci.js";
export * from './interfaces.js';
const userKey = isWindows ? 'USERNAME' : 'USER';
const machineNameKey = isWindows ? 'COMPUTERNAME' : 'HOSTNAME';
const userDomainKey = isWindows ? 'USERDOMAIN' : '';
export class Environment {
    constructor(envVars, envPath) {
        _Environment_vars.set(this, void 0);
        _Environment_path.set(this, void 0);
        _Environment_userInteractive.set(this, true);
        __classPrivateFieldSet(this, _Environment_vars, envVars, "f");
        __classPrivateFieldSet(this, _Environment_path, envPath, "f");
    }
    get userInteractive() {
        return __classPrivateFieldGet(this, _Environment_userInteractive, "f");
    }
    set userInteractive(value) {
        __classPrivateFieldSet(this, _Environment_userInteractive, value, "f");
    }
    get vars() {
        return __classPrivateFieldGet(this, _Environment_vars, "f");
    }
    get newLine() {
        return newLine;
    }
    get is64BitProcess() {
        return runtimeInfo.is64bitProcess;
    }
    get os() {
        return runtimeInfo.osFamily;
    }
    get arch() {
        return runtimeInfo.arch;
    }
    get runtimeName() {
        return runtimeInfo.runtime;
    }
    get runtime() {
        return runtimeInfo;
    }
    get deno() {
        return isDeno;
    }
    get node() {
        return isNode;
    }
    get browser() {
        return isBrowser;
    }
    get processId() {
        return processId;
    }
    get machineName() {
        return __classPrivateFieldGet(this, _Environment_vars, "f").get(machineNameKey) || '';
    }
    get userName() {
        return __classPrivateFieldGet(this, _Environment_vars, "f").get(userKey) || '';
    }
    get userDomainName() {
        return __classPrivateFieldGet(this, _Environment_vars, "f").get(userDomainKey) || '';
    }
    get isCi() {
        return isCi();
    }
    get ciName() {
        return getCiName();
    }
    get exitCode() {
        return getExitCode();
    }
    set exitCode(value) {
        setExitCode(value);
    }
    get commandLine() {
        return commandLine;
    }
    get commandLineArgs() {
        return commandLineArgs;
    }
    get currentDirectory() {
        return cwd();
    }
    set currentDirectory(value) {
        chdir(value);
    }
    get version() {
        return runtimeInfo.version;
    }
    get path() {
        return __classPrivateFieldGet(this, _Environment_path, "f");
    }
    expand(value) {
        return __classPrivateFieldGet(this, _Environment_vars, "f").expand(value);
    }
    has(name) {
        return __classPrivateFieldGet(this, _Environment_vars, "f").has(name);
    }
    get(name) {
        return __classPrivateFieldGet(this, _Environment_vars, "f").get(name);
    }
    set(name, value, isSecret = false) {
        __classPrivateFieldGet(this, _Environment_vars, "f").set(name, value, isSecret);
    }
    delete(name) {
        __classPrivateFieldGet(this, _Environment_vars, "f").delete(name);
    }
    exit(code) {
        exit(code);
    }
}
_Environment_vars = new WeakMap(), _Environment_path = new WeakMap(), _Environment_userInteractive = new WeakMap();
export const env = new Environment(envVars, envPath);
export { envPath, envVars, chdir, cwd, exit, getExitCode, setExitCode, commandLine, commandLineArgs, newLine, processId, runtimeInfo, userDomainKey, userKey, machineNameKey, EnvironmentPath, EnvironmentVariables, };
//# sourceMappingURL=mod.js.map