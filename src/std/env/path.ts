import { isWindows } from '../runtime/mod.ts';
import type { IEnvironmentPath, IEnvironmentVariables } from './interfaces.ts';
import { envVars } from './variables.ts';

const pathKey = isWindows ? 'Path' : 'PATH';
const homeKey = isWindows ? 'USERPROFILE' : 'HOME';
const homeConfigKey = isWindows ? 'APPDATA' : 'XDG_CONFIG_HOME';
const homeDataKey = isWindows ? 'LOCALAPPDATA' : 'XDG_DATA_HOME';
const homeDesktopKey = isWindows ? 'USERNAME' : 'XDG_DESKTOP_DIR';
const pathSeparator = isWindows ? ';' : ':';
const tmpKey = isWindows ? 'TMP' : 'TMPDIR';

export class EnvironmentPath implements IEnvironmentPath {
    #env: IEnvironmentVariables;

    constructor(env: IEnvironmentVariables) {
        this.#env = env;
    }

    get value(): string {
        return this.#env.get(pathKey) || '';
    }

    get win(): string {
        return this.#env.get('SystemRoot') || '';
    }

    get winSystemDrive(): string {
        return this.#env.get('SystemDrive') || '';
    }

    get winProgramFiles(): string {
        return this.#env.get('ProgramFiles') || '';
    }

    get winProgramFilesX86(): string {
        return this.#env.get('ProgramFiles(x86)') || '';
    }

    get winProgramData(): string {
        return this.#env.get('ProgramData') || '';
    }

    get opt(): string {
        return this.#env.get('OPTDIR') || this.#env.get('ALLUSERSPROFILE') ||
            '/opt';
    }

    get tmp(): string {
        return this.#env.get(tmpKey) || '/tmp';
    }

    get desktop(): string {
        return this.#env.get(homeDesktopKey) || `${this.home}/Desktop`;
    }

    get downloads(): string {
        return `${this.home}/Downloads`;
    }

    get home(): string {
        return this.#env.get(homeKey) || '';
    }

    get homeConfig(): string {
        return this.#env.get(homeConfigKey) || '';
    }

    get homeData(): string {
        return this.#env.get(homeDataKey) || '';
    }

    *[Symbol.iterator]() {
        for (const path of this.value.split(pathSeparator)) {
            yield path;
        }
    }

    has(path: string): boolean {
        return this.value.split(pathSeparator).includes(path);
    }

    remove(path: string) {
        if (!this.has(path)) {
            return;
        }

        const oldValue = this.value;
        const newValue = oldValue.split(pathSeparator).filter((p) => p !== path)
            .join(pathSeparator);
        this.#env.set(pathKey, newValue);
    }

    append(path: string) {
        if (this.has(path)) {
            return;
        }

        const newValue = this.value + pathSeparator + path;
        this.#env.set(pathKey, newValue);
    }

    prepend(path: string) {
        if (this.has(path)) {
            return;
        }

        const newValue = path + pathSeparator + this.value;
        this.#env.set(pathKey, newValue);
    }

    valueOf() {
        return this.#env.get(pathKey) || '';
    }

    toString() {
        return this.#env.get(pathKey) || '';
    }
}

export const envPath = new EnvironmentPath(envVars);