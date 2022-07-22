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
var _EnvironmentVariables_env, _EnvironmentVariables_secrets, _EnvironmentVariables_custom;
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { ArgumentError } from "../errors/errors.js";
import { isNode, isDeno, globalScope } from "../runtime/mod.js";
export default function expandVariables(template, getVariable, options) {
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
        template = template.replace(/\$\{([^\}]+)\}/g, function (_, variableName) {
            const value = getVariable(variableName);
            if (!value && throwOnError) {
                throw new ArgumentError(`Variable ${variableName} not found`);
            }
            return value || '';
        });
        // linux environment variable style expansion $variable
        template = template.replace(/\$([A-Za-z0-9]+)/g, function (_, variableName) {
            const value = getVariable(variableName);
            if (!value && throwOnError) {
                throw new ArgumentError(`Variable ${variableName} not found`);
            }
            return value || '';
        });
    }
    return template;
}
export class EnvironmentVariables {
    constructor(env) {
        _EnvironmentVariables_env.set(this, void 0);
        _EnvironmentVariables_secrets.set(this, void 0);
        /**
         * Notates that environments variables are using a custom map and is virtualized.
         * This is helpful if you want to clone the environment variables for the current process
         * and then update it without affecting the original environment variables.
        */
        _EnvironmentVariables_custom.set(this, void 0);
        __classPrivateFieldSet(this, _EnvironmentVariables_custom, env === undefined, "f");
        if (env) {
            __classPrivateFieldSet(this, _EnvironmentVariables_env, env, "f");
            __classPrivateFieldSet(this, _EnvironmentVariables_custom, true, "f");
        }
        else {
            __classPrivateFieldSet(this, _EnvironmentVariables_custom, false, "f");
            __classPrivateFieldSet(this, _EnvironmentVariables_env, isNode ? globalScope.process.env : { 'PATH': '' }, "f");
        }
        __classPrivateFieldSet(this, _EnvironmentVariables_secrets, [], "f");
    }
    get keys() {
        if (!__classPrivateFieldGet(this, _EnvironmentVariables_custom, "f") && isDeno) {
            return Object.keys(this.toObject());
        }
        return Object.keys(__classPrivateFieldGet(this, _EnvironmentVariables_env, "f"));
    }
    /**
     * Returns a copy of the environment variables that are secrets
     * for the purposes masking secrets in logs or dealing with CI/CD
     * environments.
     */
    get secrets() {
        return __classPrivateFieldGet(this, _EnvironmentVariables_secrets, "f");
    }
    get length() {
        return this.keys.length;
    }
    has(name) {
        if (!__classPrivateFieldGet(this, _EnvironmentVariables_custom, "f") && isDeno)
            return globalScope.Deno.env.get(name) !== undefined;
        return __classPrivateFieldGet(this, _EnvironmentVariables_env, "f")[name] !== undefined;
    }
    toObject() {
        if (!__classPrivateFieldGet(this, _EnvironmentVariables_custom, "f") && isDeno) {
            return globalScope.Deno.env.toObject();
        }
        const obj = {};
        for (const key of this.keys) {
            const value = __classPrivateFieldGet(this, _EnvironmentVariables_env, "f")[key];
            if (value === undefined)
                continue;
            obj[key] = value;
        }
        return obj;
    }
    expand(value) {
        return expandVariables(value, (name) => this.get(name));
    }
    *[(_EnvironmentVariables_env = new WeakMap(), _EnvironmentVariables_secrets = new WeakMap(), _EnvironmentVariables_custom = new WeakMap(), Symbol.iterator)]() {
        const data = this.toObject();
        for (const key of Object.keys(data)) {
            const value = data[key];
            yield [key, value];
        }
    }
    delete(name) {
        if (!__classPrivateFieldGet(this, _EnvironmentVariables_custom, "f") && isDeno) {
            globalScope.Deno.env.delete(name);
            return;
        }
        if (this.has(name)) {
            delete __classPrivateFieldGet(this, _EnvironmentVariables_env, "f")[name];
        }
    }
    get(name) {
        if (!__classPrivateFieldGet(this, _EnvironmentVariables_custom, "f") && isDeno) {
            return globalScope.Deno.env.get(name);
        }
        return __classPrivateFieldGet(this, _EnvironmentVariables_env, "f")[name];
    }
    dump() {
        const data = {};
        for (const key of this.keys) {
            let value = this.get(key);
            if (value === undefined)
                continue;
            if (__classPrivateFieldGet(this, _EnvironmentVariables_secrets, "f").includes(key))
                value = '*****';
            data[key] = value;
        }
        console.log(JSON.stringify(data, null, 4));
    }
    set(key, value, isSecret) {
        if (isSecret === undefined) {
            isSecret = false;
        }
        if (isSecret) {
            if (!__classPrivateFieldGet(this, _EnvironmentVariables_secrets, "f").includes(key)) {
                __classPrivateFieldGet(this, _EnvironmentVariables_secrets, "f").push(key);
            }
        }
        if (!__classPrivateFieldGet(this, _EnvironmentVariables_custom, "f") && isDeno) {
            globalScope.Deno.env.set(key, value);
            return;
        }
        __classPrivateFieldGet(this, _EnvironmentVariables_env, "f")[key] = value;
    }
}
export const envVars = new EnvironmentVariables();
//# sourceMappingURL=variables.js.map