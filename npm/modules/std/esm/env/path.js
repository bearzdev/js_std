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
var _EnvironmentPath_env;
import { isWindows } from '../runtime/mod.js';
import { envVars } from './variables.js';
const pathKey = isWindows ? 'Path' : 'PATH';
const homeKey = isWindows ? 'USERPROFILE' : 'HOME';
const homeConfigKey = isWindows ? 'APPDATA' : 'XDG_CONFIG_HOME';
const homeDataKey = isWindows ? 'LOCALAPPDATA' : 'XDG_DATA_HOME';
const homeDesktopKey = isWindows ? 'USERNAME' : 'XDG_DESKTOP_DIR';
const pathSeparator = isWindows ? ';' : ':';
const tmpKey = isWindows ? 'TMP' : 'TMPDIR';
export class EnvironmentPath {
    constructor(env) {
        _EnvironmentPath_env.set(this, void 0);
        __classPrivateFieldSet(this, _EnvironmentPath_env, env, "f");
    }
    get value() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get(pathKey) || '';
    }
    get win() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get('SystemRoot') || '';
    }
    get winSystemDrive() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get('SystemDrive') || '';
    }
    get winProgramFiles() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get('ProgramFiles') || '';
    }
    get winProgramFilesX86() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get('ProgramFiles(x86)') || '';
    }
    get winProgramData() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get('ProgramData') || '';
    }
    get opt() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get('OPTDIR') || __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get('ALLUSERSPROFILE') ||
            '/opt';
    }
    get tmp() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get(tmpKey) || '/tmp';
    }
    get desktop() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get(homeDesktopKey) || `${this.home}/Desktop`;
    }
    get downloads() {
        return `${this.home}/Downloads`;
    }
    get home() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get(homeKey) || '';
    }
    get homeConfig() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get(homeConfigKey) || '';
    }
    get homeData() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get(homeDataKey) || '';
    }
    *[(_EnvironmentPath_env = new WeakMap(), Symbol.iterator)]() {
        for (const path of this.value.split(pathSeparator)) {
            yield path;
        }
    }
    has(path) {
        return this.value.split(pathSeparator).includes(path);
    }
    remove(path) {
        if (!this.has(path)) {
            return;
        }
        const oldValue = this.value;
        const newValue = oldValue.split(pathSeparator).filter((p) => p !== path)
            .join(pathSeparator);
        __classPrivateFieldGet(this, _EnvironmentPath_env, "f").set(pathKey, newValue);
    }
    append(path) {
        if (this.has(path)) {
            return;
        }
        const newValue = this.value + pathSeparator + path;
        __classPrivateFieldGet(this, _EnvironmentPath_env, "f").set(pathKey, newValue);
    }
    prepend(path) {
        if (this.has(path)) {
            return;
        }
        const newValue = path + pathSeparator + this.value;
        __classPrivateFieldGet(this, _EnvironmentPath_env, "f").set(pathKey, newValue);
    }
    valueOf() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get(pathKey) || '';
    }
    toString() {
        return __classPrivateFieldGet(this, _EnvironmentPath_env, "f").get(pathKey) || '';
    }
}
export const envPath = new EnvironmentPath(envVars);
//# sourceMappingURL=path.js.map