import { ArgumentError } from '../errors/errors.ts';
import type { IEnvironmentVariables, IExpandOptions, IVariableGetter } from './interfaces.ts';
import { globalScope, isDeno, isNode } from '../runtime/mod.ts';

export default function expandVariables(
    template: string,
    getVariable: IVariableGetter,
    options?: IExpandOptions,
): string {
    // %variable%
    const windows = options?.windows || true;
    const linux = options?.linux || true;
    const throwOnError = options?.throw || false;

    if (windows) {
        // windows environment variable style expansion %variable%
        template = template.replace(/%([^%]+)%/gi, function (_, variableName) {
            const value = getVariable(variableName);
            if (!value && throwOnError) {
                throw new ArgumentError(`Variable ${variableName} not found`);
            }

            return value || '';
        });
    }

    if (linux) {
        // linux environment variable style expansion ${variable}
        template = template.replace(
            /\$\{([^\}]+)\}/g,
            function (_, variableName) {
                const value = getVariable(variableName);
                if (!value && throwOnError) {
                    throw new ArgumentError(`Variable ${variableName} not found`);
                }

                return value || '';
            },
        );

        // linux environment variable style expansion $variable
        template = template.replace(
            /\$([A-Za-z0-9]+)/g,
            function (_, variableName) {
                const value = getVariable(variableName);
                if (!value && throwOnError) {
                    throw new ArgumentError(`Variable ${variableName} not found`);
                }

                return value || '';
            },
        );
    }

    return template;
}

export class EnvironmentVariables implements IEnvironmentVariables {
    #env: { [key: string]: string };
    #secrets: string[];
    /**
     * Notates that environments variables are using a custom map and is virtualized.
     * This is helpful if you want to clone the environment variables for the current process
     * and then update it without affecting the original environment variables.
     */
    #custom: boolean;

    constructor(env?: { [key: string]: string }) {
        this.#custom = env === undefined;
        if (env) {
            this.#env = env;
            this.#custom = true;
        } else {
            this.#custom = false;
            this.#env = isNode ? globalScope.process.env : { 'PATH': '' };
        }

        this.#secrets = [];
    }

    get keys(): string[] {
        if (!this.#custom && isDeno) {
            return Object.keys(this.toObject());
        }

        return Object.keys(this.#env);
    }

    /**
     * Returns a copy of the environment variables that are secrets
     * for the purposes masking secrets in logs or dealing with CI/CD
     * environments.
     */
    get secrets(): string[] {
        return this.#secrets;
    }

    get length(): number {
        return this.keys.length;
    }

    has(name: string): boolean {
        if (!this.#custom && isDeno) {
            return globalScope.Deno.env.get(name) !== undefined;
        }

        return this.#env[name] !== undefined;
    }

    toObject(): { [key: string]: string } {
        if (!this.#custom && isDeno) {
            return globalScope.Deno.env.toObject();
        }

        const obj: { [key: string]: string } = {};
        for (const key of this.keys) {
            const value = this.#env[key];
            if (value === undefined) {
                continue;
            }

            obj[key] = value;
        }
        return obj;
    }

    expand(value: string): string {
        return expandVariables(value, (name) => this.get(name));
    }

    *[Symbol.iterator](): Iterator<[key: string, value: string]> {
        const data = this.toObject();

        for (const key of Object.keys(data)) {
            const value = data[key];
            yield [key, value];
        }
    }

    delete(name: string): void {
        if (!this.#custom && isDeno) {
            globalScope.Deno.env.delete(name);
            return;
        }

        if (this.has(name)) {
            delete this.#env[name];
        }
    }

    get(name: string): string | undefined {
        if (!this.#custom && isDeno) {
            return globalScope.Deno.env.get(name);
        }

        return this.#env[name];
    }

    dump(): void {
        const data: { [key: string]: string } = {};
        for (const key of this.keys) {
            let value = this.get(key);
            if (value === undefined) {
                continue;
            }

            if (this.#secrets.includes(key)) {
                value = '*****';
            }

            data[key] = value;
        }

        console.log(JSON.stringify(data, null, 4));
    }

    set(key: string, value: string): void;
    set(key: string, value: string, isSecret: boolean): void;
    set(key: string, value: string, isSecret?: boolean): void {
        if (isSecret === undefined) {
            isSecret = false;
        }

        if (isSecret) {
            if (!this.#secrets.includes(key)) {
                this.#secrets.push(key);
            }
        }

        if (!this.#custom && isDeno) {
            globalScope.Deno.env.set(key, value);
            return;
        }

        this.#env[key] = value;
    }
}

export const envVars = new EnvironmentVariables();
