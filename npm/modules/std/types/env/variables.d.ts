import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import type { IEnvironmentVariables, IExpandOptions, IVariableGetter } from './interfaces.js';
export default function expandVariables(template: string, getVariable: IVariableGetter, options?: IExpandOptions): string;
export declare class EnvironmentVariables implements IEnvironmentVariables {
    #private;
    constructor(env?: {
        [key: string]: string;
    });
    get keys(): string[];
    /**
     * Returns a copy of the environment variables that are secrets
     * for the purposes masking secrets in logs or dealing with CI/CD
     * environments.
     */
    get secrets(): string[];
    get length(): number;
    has(name: string): boolean;
    toObject(): {
        [key: string]: string;
    };
    expand(value: string): string;
    [Symbol.iterator](): Iterator<[key: string, value: string]>;
    delete(name: string): void;
    get(name: string): string | undefined;
    dump(): void;
    set(key: string, value: string): void;
    set(key: string, value: string, isSecret: boolean): void;
}
export declare const envVars: EnvironmentVariables;
