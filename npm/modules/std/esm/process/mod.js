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
var _Process_outCaptures, _Process_errorCaptures;
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { cancelAfter } from '../async/cancellation-token.js';
import { notNullOrWhiteSpace } from '../errors/check.js';
import { ArgumentNullError } from '../errors/errors.js';
import { NotFoundOnPathError, ProcessError } from './errors.js';
import { ArrayCapture, CommandBuilder, ProcessArgs, ProcessCapture, ProcessStartInfo } from './start-info.js';
import { findExecutable, findExecutableAsync, findExecutableOrThrow, findExecutableOrThrowAsync, pathFinder, registerExecutable, removeFile, removeFileAsync, resolveScript, resolveScriptAsync, which, whichAsync, } from './which.js';
import { processRunner } from './base.node.js';
function createStartInfo(fileName, args, options) {
    options ||= {};
    options.fileName = fileName;
    options.args = args;
    const startInfo = new ProcessStartInfo(options);
    return startInfo;
}
export default class Process {
    constructor() {
        Object.defineProperty(this, "startInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _Process_outCaptures.set(this, void 0);
        _Process_errorCaptures.set(this, void 0);
        if (arguments.length === 0) {
            throw new ArgumentNullError('options');
        }
        __classPrivateFieldSet(this, _Process_outCaptures, [], "f");
        __classPrivateFieldSet(this, _Process_errorCaptures, [], "f");
        const first = arguments[0];
        if (typeof first === 'object') {
            if (first instanceof ProcessStartInfo) {
                this.startInfo = first;
            }
            else {
                this.startInfo = new ProcessStartInfo(first);
            }
        }
        else {
            this.startInfo = new ProcessStartInfo(first, ...arguments[1]);
        }
    }
    static capture(fileName, args, options) {
        pathFinder.findOrThrow(fileName);
        const startInfo = createStartInfo(fileName, args, options);
        const process = new Process(startInfo);
        const result = process.capture();
        const validator = options?.exitCodeValidator || ((code) => code === 0);
        if (!validator(result.exitCode)) {
            throw new ProcessError(fileName, result.exitCode);
        }
        return result;
    }
    static async captureAsync(fileName, args, options) {
        pathFinder.findOrThrow(fileName);
        const startInfo = createStartInfo(fileName, args, options);
        const process = new Process(startInfo);
        const result = await process.captureAsync();
        const validator = options?.exitCodeValidator || ((code) => code === 0);
        if (!validator(result.exitCode)) {
            throw new ProcessError(fileName, result.exitCode);
        }
        return result;
    }
    static captureScript(script, shell, options) {
        const startInfo = new ProcessStartInfo(options || {});
        const tmpFile = processRunner.resolveShellScript(script, shell, startInfo);
        const process = new Process(startInfo);
        try {
            const result = process.capture();
            const validator = options?.exitCodeValidator || ((code) => code === 0);
            if (!validator(result.exitCode)) {
                throw new ProcessError(script, result.exitCode);
            }
            return result;
        }
        finally {
            removeFile(tmpFile);
        }
    }
    static async captureScriptAsync(script, shell, options) {
        const startInfo = new ProcessStartInfo(options || {});
        const tmpFile = await processRunner.resolveShellScriptAsync(script, shell, startInfo);
        const process = new Process(startInfo);
        try {
            const result = await process.captureAsync();
            const validator = options?.exitCodeValidator || ((code) => code === 0);
            if (!validator(result.exitCode)) {
                throw new ProcessError(script, result.exitCode);
            }
            return result;
        }
        finally {
            await removeFileAsync(tmpFile);
        }
    }
    static run(fileName, args, options) {
        notNullOrWhiteSpace(fileName, 'fileName');
        const startInfo = createStartInfo(fileName, args, options);
        const process = new Process(startInfo);
        let result;
        if (options?.capture) {
            result = process.capture();
        }
        else if (options?.tee) {
            result = process.tee();
        }
        else {
            result = process.run();
        }
        const validator = options?.exitCodeValidator || ((code) => code === 0);
        if (!validator(result.exitCode)) {
            console.log(startInfo);
            console.error(result.standardError.join('\n'));
            throw new ProcessError(fileName, result.exitCode);
        }
        return result;
    }
    static async runAsync(fileName, args, options) {
        notNullOrWhiteSpace(fileName, 'fileName');
        const startInfo = createStartInfo(fileName, args, options);
        const process = new Process(startInfo);
        let result;
        if (options?.capture) {
            result = await process.captureAsync();
        }
        else if (options?.tee) {
            result = await process.teeAsync();
        }
        else {
            result = await process.runAsync();
        }
        const validator = options?.exitCodeValidator || ((code) => code === 0);
        if (!validator(result.exitCode)) {
            throw new ProcessError(fileName, result.exitCode);
        }
        return result;
    }
    static runScript(script, shell, options) {
        const startInfo = new ProcessStartInfo(options || {});
        const tmpFile = processRunner.resolveShellScript(script, shell, startInfo);
        const process = new Process(startInfo);
        try {
            const result = process.run();
            const validator = options?.exitCodeValidator || ((code) => code === 0);
            if (!validator(result.exitCode)) {
                throw new ProcessError(script, result.exitCode);
            }
            return result;
        }
        finally {
            removeFile(tmpFile);
        }
    }
    static async runScriptAsync(script, shell, options) {
        const startInfo = new ProcessStartInfo(options || {});
        const tmpFile = await processRunner.resolveShellScriptAsync(script, shell, startInfo);
        const process = new Process(startInfo);
        try {
            const result = await process.runAsync();
            const validator = options?.exitCodeValidator || ((code) => code === 0);
            if (!validator(result.exitCode)) {
                throw new ProcessError(script, result.exitCode);
            }
            return result;
        }
        finally {
            await removeFileAsync(tmpFile);
        }
    }
    redirectTo() {
        if (arguments.length === 0) {
            throw new Error('No arguments');
        }
        const first = arguments[0];
        if (first === undefined || first === null) {
            throw new ArgumentNullError('capture');
        }
        __classPrivateFieldSet(this, _Process_outCaptures, __classPrivateFieldGet(this, _Process_outCaptures, "f") || [], "f");
        if (first instanceof ProcessCapture) {
            __classPrivateFieldGet(this, _Process_outCaptures, "f").push(arguments[0]);
            return this;
        }
        if (Array.isArray(first)) {
            __classPrivateFieldGet(this, _Process_outCaptures, "f").push(new ArrayCapture(first));
            return this;
        }
    }
    redirectErrorTo() {
        if (arguments.length === 0) {
            throw new Error('No arguments');
        }
        const first = arguments[0];
        if (first === undefined || first === null) {
            throw new ArgumentNullError('capture');
        }
        __classPrivateFieldSet(this, _Process_errorCaptures, __classPrivateFieldGet(this, _Process_errorCaptures, "f") || [], "f");
        if (first instanceof ProcessCapture) {
            __classPrivateFieldGet(this, _Process_errorCaptures, "f").push(arguments[0]);
            return this;
        }
        if (Array.isArray(first)) {
            __classPrivateFieldGet(this, _Process_errorCaptures, "f").push(new ArrayCapture(first));
            return this;
        }
    }
    run() {
        let fileName = this.startInfo.fileName;
        notNullOrWhiteSpace(fileName, 'startInfo.fileName');
        fileName = pathFinder.findOrThrow(fileName);
        this.startInfo.fileName = fileName;
        const first = arguments[0];
        if (first !== undefined) {
            if (first instanceof AbortSignal) {
                this.startInfo.signal = first;
            }
            else if (typeof first === 'number') {
                this.startInfo.signal = cancelAfter(first);
            }
        }
        if (this.startInfo.args && this.startInfo.args instanceof ProcessArgs) {
            const next = [];
            for (let i = 0; i < this.startInfo.args.length; i++) {
                next.push(this.startInfo.args[i]);
            }
            this.startInfo.args = next;
        }
        const ctx = {
            startInfo: this.startInfo,
            signal: this.startInfo.signal,
            outCaptures: this.startInfo.outCaptures === undefined
                ? __classPrivateFieldGet(this, _Process_outCaptures, "f")
                : this.startInfo.outCaptures.concat(__classPrivateFieldGet(this, _Process_outCaptures, "f")),
            errorCaptures: this.startInfo.errorCaptures === undefined
                ? __classPrivateFieldGet(this, _Process_errorCaptures, "f")
                : this.startInfo.errorCaptures.concat(__classPrivateFieldGet(this, _Process_errorCaptures, "f")),
        };
        return processRunner.run(ctx);
    }
    runAsync() {
        let fileName = this.startInfo.fileName;
        notNullOrWhiteSpace(fileName, 'startInfo.fileName');
        fileName = pathFinder.findOrThrow(fileName);
        this.startInfo.fileName = fileName;
        const first = arguments[0];
        if (first !== undefined) {
            if (first instanceof AbortSignal) {
                this.startInfo.signal = first;
            }
            else if (typeof first === 'number') {
                this.startInfo.timeout = first;
                this.startInfo.signal = cancelAfter(first);
            }
        }
        const ctx = {
            startInfo: this.startInfo,
            signal: this.startInfo.signal,
            outCaptures: this.startInfo.outCaptures === undefined
                ? __classPrivateFieldGet(this, _Process_outCaptures, "f")
                : this.startInfo.outCaptures.concat(__classPrivateFieldGet(this, _Process_outCaptures, "f")),
            errorCaptures: this.startInfo.errorCaptures === undefined
                ? __classPrivateFieldGet(this, _Process_errorCaptures, "f")
                : this.startInfo.errorCaptures.concat(__classPrivateFieldGet(this, _Process_errorCaptures, "f")),
        };
        return processRunner.runAsync(ctx);
    }
    capture() {
        const standardOut = [];
        const standardError = [];
        __classPrivateFieldGet(this, _Process_outCaptures, "f").push(new ArrayCapture(standardOut));
        __classPrivateFieldGet(this, _Process_errorCaptures, "f").push(new ArrayCapture(standardError));
        const result = this.run(arguments[0]);
        result.standardOut = standardOut;
        result.standardError = standardError;
        return result;
    }
    async captureAsync() {
        const standardOut = [];
        const standardError = [];
        __classPrivateFieldGet(this, _Process_outCaptures, "f").push(new ArrayCapture(standardOut));
        __classPrivateFieldGet(this, _Process_errorCaptures, "f").push(new ArrayCapture(standardError));
        const result = await this.runAsync(arguments[0]);
        result.standardOut = standardOut;
        result.standardError = standardError;
        return result;
    }
    tee() {
        const standardOut = [];
        const standardError = [];
        __classPrivateFieldGet(this, _Process_outCaptures, "f").push(new ArrayCapture(standardOut));
        __classPrivateFieldGet(this, _Process_errorCaptures, "f").push(new ArrayCapture(standardError));
        const result = this.run(arguments[0]);
        result.standardOut = standardOut;
        result.standardError = standardError;
        return result;
    }
    async teeAsync() {
        const standardOut = [];
        const standardError = [];
        __classPrivateFieldGet(this, _Process_outCaptures, "f").push(new ArrayCapture(standardOut));
        __classPrivateFieldGet(this, _Process_errorCaptures, "f").push(new ArrayCapture(standardError));
        const result = await this.runAsync(arguments[0]);
        result.standardOut = standardOut;
        result.standardError = standardError;
        return result;
    }
}
_Process_outCaptures = new WeakMap(), _Process_errorCaptures = new WeakMap();
Object.defineProperty(Process, "which", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: which
});
Object.defineProperty(Process, "whichAsync", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: whichAsync
});
export const { run, runAsync, runScript, runScriptAsync, capture, captureAsync, captureScript, captureScriptAsync, } = Process;
export { CommandBuilder, findExecutable, findExecutableAsync, findExecutableOrThrow, findExecutableOrThrowAsync, NotFoundOnPathError, pathFinder, ProcessArgs, ProcessError, registerExecutable, resolveScript, resolveScriptAsync, which, whichAsync, };
export const fromArgs = ProcessArgs.from;
//# sourceMappingURL=mod.js.map