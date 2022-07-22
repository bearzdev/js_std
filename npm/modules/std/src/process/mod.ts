import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { cancelAfter } from '../async/cancellation-token.js';
import { notNullOrWhiteSpace } from '../errors/check.js';
import { ArgumentNullError } from '../errors/errors.js';
import { NotFoundOnPathError, ProcessError } from './errors.js';
import type {
    IParameterBuilder,
    IProcessCapture,
    IProcessInvocationContext,
    IProcessInvocationOptions,
    IProcessResult,
    IProcessStartInfo,
} from './interfaces.js';
import { ArrayCapture, CommandBuilder, ProcessArgs, ProcessCapture, ProcessStartInfo } from './start-info.js';
import {
    findExecutable,
    findExecutableAsync,
    findExecutableOrThrow,
    findExecutableOrThrowAsync,
    pathFinder,
    registerExecutable,
    removeFile,
    removeFileAsync,
    resolveScript,
    resolveScriptAsync,
    which,
    whichAsync,
} from './which.js';

import { processRunner } from './base.node.js';

function createStartInfo(fileName: string, args?: string[], options?: IProcessInvocationOptions): ProcessStartInfo {
    options ||= {};
    options.fileName = fileName;
    options.args = args;
    const startInfo = new ProcessStartInfo(options);

    return startInfo;
}

export default class Process {
    startInfo: IProcessStartInfo;
    #outCaptures: IProcessCapture[];
    #errorCaptures: IProcessCapture[];

    constructor(startInfo: ProcessStartInfo);
    constructor(options: Partial<IProcessStartInfo>);
    constructor() {
        if (arguments.length === 0) {
            throw new ArgumentNullError('options');
        }

        this.#outCaptures = [];
        this.#errorCaptures = [];
        const first = arguments[0];

        if (typeof first === 'object') {
            if (first instanceof ProcessStartInfo) {
                this.startInfo = first;
            } else {
                this.startInfo = new ProcessStartInfo(first);
            }
        } else {
            this.startInfo = new ProcessStartInfo(first, ...arguments[1]);
        }
    }

    static capture(fileName: string, args?: string[], options?: IProcessInvocationOptions): IProcessResult {
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

    static async captureAsync(
        fileName: string,
        args?: string[],
        options?: IProcessInvocationOptions,
    ): Promise<IProcessResult> {
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

    static captureScript(script: string, shell?: string, options?: IProcessInvocationOptions): IProcessResult {
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
        } finally {
            removeFile(tmpFile);
        }
    }

    static async captureScriptAsync(
        script: string,
        shell?: string,
        options?: IProcessInvocationOptions,
    ): Promise<IProcessResult> {
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
        } finally {
            await removeFileAsync(tmpFile);
        }
    }

    static run(fileName: string, args?: string[], options?: IProcessInvocationOptions): IProcessResult {
        notNullOrWhiteSpace(fileName, 'fileName');
        const startInfo = createStartInfo(fileName, args, options);
        const process = new Process(startInfo);
        let result: IProcessResult;
        if (options?.capture) {
            result = process.capture();
        } else if (options?.tee) {
            result = process.tee();
        } else {
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

    static async runAsync(
        fileName: string,
        args?: string[],
        options?: IProcessInvocationOptions,
    ): Promise<IProcessResult> {
        notNullOrWhiteSpace(fileName, 'fileName');

        const startInfo = createStartInfo(fileName, args, options);
        const process = new Process(startInfo);
        let result: IProcessResult;
        if (options?.capture) {
            result = await process.captureAsync();
        } else if (options?.tee) {
            result = await process.teeAsync();
        } else {
            result = await process.runAsync();
        }
        const validator = options?.exitCodeValidator || ((code) => code === 0);
        if (!validator(result.exitCode)) {
            throw new ProcessError(fileName, result.exitCode);
        }

        return result;
    }

    static runScript(script: string, shell?: string, options?: IProcessInvocationOptions): IProcessResult {
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
        } finally {
            removeFile(tmpFile);
        }
    }

    static async runScriptAsync(
        script: string,
        shell?: string,
        options?: IProcessInvocationOptions,
    ): Promise<IProcessResult> {
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
        } finally {
            await removeFileAsync(tmpFile);
        }
    }

    static which = which;

    static whichAsync = whichAsync;

    redirectTo(array: string[]): void;
    redirectTo(capture: IProcessCapture): void;
    redirectTo() {
        if (arguments.length === 0) {
            throw new Error('No arguments');
        }
        const first = arguments[0];
        if (first === undefined || first === null) {
            throw new ArgumentNullError('capture');
        }

        this.#outCaptures ||= [];

        if (first instanceof ProcessCapture) {
            this.#outCaptures.push(arguments[0]);
            return this;
        }

        if (Array.isArray(first)) {
            this.#outCaptures.push(new ArrayCapture(first));
            return this;
        }
    }

    redirectErrorTo(array: string[]): void;
    redirectErrorTo(capture: IProcessCapture): void;
    redirectErrorTo() {
        if (arguments.length === 0) {
            throw new Error('No arguments');
        }
        const first = arguments[0];
        if (first === undefined || first === null) {
            throw new ArgumentNullError('capture');
        }

        this.#errorCaptures ||= [];

        if (first instanceof ProcessCapture) {
            this.#errorCaptures.push(arguments[0]);
            return this;
        }

        if (Array.isArray(first)) {
            this.#errorCaptures.push(new ArrayCapture(first));
            return this;
        }
    }

    run(signal: AbortSignal): IProcessResult;
    run(timeout: number): IProcessResult;
    run(): IProcessResult;
    run(): IProcessResult {
        let fileName = this.startInfo.fileName;
        notNullOrWhiteSpace(fileName, 'startInfo.fileName');
        fileName = pathFinder.findOrThrow(fileName);
        this.startInfo.fileName = fileName;

        const first = arguments[0];
        if (first !== undefined) {
            if (first instanceof AbortSignal) {
                this.startInfo.signal = first;
            } else if (typeof first === 'number') {
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

        const ctx: IProcessInvocationContext = {
            startInfo: this.startInfo,
            signal: this.startInfo.signal,
            outCaptures: this.startInfo.outCaptures === undefined
                ? this.#outCaptures
                : this.startInfo.outCaptures.concat(this.#outCaptures),
            errorCaptures: this.startInfo.errorCaptures === undefined
                ? this.#errorCaptures
                : this.startInfo.errorCaptures.concat(this.#errorCaptures),
        };

        return processRunner.run(ctx);
    }

    runAsync(signal: AbortSignal): Promise<IProcessResult>;
    runAsync(timeout: number): Promise<IProcessResult>;
    runAsync(): Promise<IProcessResult>;
    runAsync(): Promise<IProcessResult> {
        let fileName = this.startInfo.fileName;
        notNullOrWhiteSpace(fileName, 'startInfo.fileName');
        fileName = pathFinder.findOrThrow(fileName);
        this.startInfo.fileName = fileName;

        const first = arguments[0];
        if (first !== undefined) {
            if (first instanceof AbortSignal) {
                this.startInfo.signal = first;
            } else if (typeof first === 'number') {
                this.startInfo.timeout = first;
                this.startInfo.signal = cancelAfter(first);
            }
        }

        const ctx: IProcessInvocationContext = {
            startInfo: this.startInfo,
            signal: this.startInfo.signal,
            outCaptures: this.startInfo.outCaptures === undefined
                ? this.#outCaptures
                : this.startInfo.outCaptures.concat(this.#outCaptures),
            errorCaptures: this.startInfo.errorCaptures === undefined
                ? this.#errorCaptures
                : this.startInfo.errorCaptures.concat(this.#errorCaptures),
        };

        return processRunner.runAsync(ctx);
    }

    capture(signal: AbortSignal): IProcessResult;
    capture(timeout: number): IProcessResult;
    capture(): IProcessResult;
    capture(): IProcessResult {
        const standardOut: string[] = [];
        const standardError: string[] = [];

        this.#outCaptures.push(new ArrayCapture(standardOut));
        this.#errorCaptures.push(new ArrayCapture(standardError));

        const result = this.run(arguments[0]);
        result.standardOut = standardOut;
        result.standardError = standardError;

        return result;
    }

    async captureAsync(signal: AbortSignal): Promise<IProcessResult>;
    async captureAsync(timeout: number): Promise<IProcessResult>;
    async captureAsync(): Promise<IProcessResult>;
    async captureAsync(): Promise<IProcessResult> {
        const standardOut: string[] = [];
        const standardError: string[] = [];

        this.#outCaptures.push(new ArrayCapture(standardOut));
        this.#errorCaptures.push(new ArrayCapture(standardError));

        const result = await this.runAsync(arguments[0]);
        result.standardOut = standardOut;
        result.standardError = standardError;

        return result;
    }

    tee(signal: AbortSignal): IProcessResult;
    tee(timeout: number): IProcessResult;
    tee(): IProcessResult;
    tee(): IProcessResult {
        const standardOut: string[] = [];
        const standardError: string[] = [];

        this.#outCaptures.push(new ArrayCapture(standardOut));
        this.#errorCaptures.push(new ArrayCapture(standardError));

        const result = this.run(arguments[0]);
        result.standardOut = standardOut;
        result.standardError = standardError;

        return result;
    }

    async teeAsync(signal: AbortSignal): Promise<IProcessResult>;
    async teeAsync(timeout: number): Promise<IProcessResult>;
    async teeAsync(): Promise<IProcessResult>;
    async teeAsync(): Promise<IProcessResult> {
        const standardOut: string[] = [];
        const standardError: string[] = [];

        this.#outCaptures.push(new ArrayCapture(standardOut));
        this.#errorCaptures.push(new ArrayCapture(standardError));

        const result = await this.runAsync(arguments[0]);
        result.standardOut = standardOut;
        result.standardError = standardError;

        return result;
    }
}

export const {
    run,

    runAsync,

    runScript,

    runScriptAsync,

    capture,

    captureAsync,

    captureScript,

    captureScriptAsync,
} = Process;

export {
    CommandBuilder,
    findExecutable,
    findExecutableAsync,
    findExecutableOrThrow,
    findExecutableOrThrowAsync,
    IParameterBuilder,
    IProcessCapture,
    IProcessInvocationOptions,
    IProcessResult,
    IProcessStartInfo,
    NotFoundOnPathError,
    pathFinder,
    ProcessArgs,
    ProcessError,
    registerExecutable,
    resolveScript,
    resolveScriptAsync,
    which,
    whichAsync,
};

export const fromArgs = ProcessArgs.from;
