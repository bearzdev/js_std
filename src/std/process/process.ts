import { cancelAfter } from "../async/cancellation-token.ts";
import { notNullOrWhiteSpace } from "../errors/check.ts";
import { ArgumentNullError } from "../errors/errors.ts";
import { ProcessError } from "./errors.ts";
import type { 
    IProcessInvocationOptions, 
    IProcessStartInfo, 
    IProcessResult, 
    IProcessInvocationContext, 
    IProcessCapture,
} from "./interfaces.ts";
import { ProcessStartInfo, ArrayCapture, ProcessCapture } from "./start-info.ts";
import { 
    pathFinder, 
    findExecutable, 
    findExecutableAsync, 
    findExecutableOrThrow, 
    findExecutableOrThrowAsync,
    registerExecutable,
    which, 
    whichAsync,
    resolveScript,
    resolveScriptAsync,
    removeFile, 
    removeFileAsync 
} from "./which.ts";

import { processRunner } from "./base.deno.ts";

function map(startInfo: ProcessStartInfo,  options?: IProcessInvocationOptions) {
    if (options) {
        if (options?.workingDirectory) {
            startInfo.workingDirectory = options.workingDirectory;
        }
        if (options?.env) {
            startInfo.env = options.env;
        }
        if (options.outCaptures) {
            startInfo.outCaptures = options.outCaptures;
        }
        if (options.errorCaptures) {
            startInfo.errorCaptures = options.errorCaptures;
        }
        if (options.timeout) {
            startInfo.timeout = options.timeout;
        }
        if (options.userId) {
            startInfo.userId = options.userId;
        }
        if (options.groupId) {
            startInfo.groupId = options.groupId;
        }
        if (options.signal) {
            startInfo.signal = options.signal;
        }
    }

    return startInfo;
}

function createStartInfo(fileName: string, args?: string[], options?: IProcessInvocationOptions): ProcessStartInfo {
    const startInfo = new ProcessStartInfo(fileName, ...(args || []));

    map(startInfo, options);

    return startInfo;
}

export default class Process {
    startInfo: IProcessStartInfo;
    #outCaptures: IProcessCapture[];
    #errorCaptures: IProcessCapture[];

    constructor(startInfo: ProcessStartInfo)
    constructor(options: Partial<IProcessStartInfo>)
    constructor() {
        if(arguments.length === 0)
           throw new ArgumentNullError('options');

        this.#outCaptures = [];
        this.#errorCaptures = [];
        const first = arguments[0];

        if(typeof first === 'object') {
            if(first instanceof ProcessStartInfo) {
                this.startInfo = first;
            }
            else 
            {
                this.startInfo = new ProcessStartInfo(first);
            }
        } else {
            this.startInfo = new ProcessStartInfo(first, ...arguments[1]);
        }
    }

    static capture(fileName: string, args?: string[], options?: IProcessInvocationOptions) : IProcessResult {
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

    static async captureAsync(fileName: string, args?: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult> {
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

    static captureScript(script: string, shell?: string, options?: IProcessInvocationOptions) : IProcessResult {
        const startInfo = new ProcessStartInfo();
        map(startInfo, options);
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

    static async captureScriptAsync(script: string, shell?: string, options?: IProcessInvocationOptions) : Promise<IProcessResult> {
        const startInfo = new ProcessStartInfo();
        map(startInfo, options);
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

    static run(fileName: string, args?: string[], options?: IProcessInvocationOptions) : IProcessResult {
        notNullOrWhiteSpace(fileName, 'fileName');
        const startInfo = createStartInfo(fileName, args, options);
        const process = new Process(startInfo);
        const result = process.run();

        const validator = options?.exitCodeValidator || ((code) => code === 0);
        if (!validator(result.exitCode)) {
            throw new ProcessError(fileName, result.exitCode);
        }

        return result;
    }

    static async runAsync(fileName: string, args?: string[], options?: IProcessInvocationOptions) : Promise<IProcessResult> {
        notNullOrWhiteSpace(fileName, 'fileName');

        const startInfo = createStartInfo(fileName, args, options);
        const process = new Process(startInfo);
        const result = await process.run();

        const validator = options?.exitCodeValidator || ((code) => code === 0);
        if (!validator(result.exitCode)) {
            throw new ProcessError(fileName, result.exitCode);
        }

        return result;
    }

    static runScript(script: string, shell?: string, options?: IProcessInvocationOptions) : IProcessResult {
        const startInfo = new ProcessStartInfo();
        map(startInfo, options);
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

    static async runScriptAsync(script: string, shell?: string, options?: IProcessInvocationOptions) : Promise<IProcessResult> {
        const startInfo = new ProcessStartInfo();
        map(startInfo, options);
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
        if(first === undefined || first === null) {
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
        if(first === undefined || first === null) {
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
        fileName = pathFinder.findOrThrow(fileName);
        this.startInfo.fileName = fileName;

        const first = arguments[0];
        if(first !== undefined) {
            if(first instanceof AbortSignal) {
                this.startInfo.signal = first;
            } else if (typeof first === 'number') {
                this.startInfo.signal = cancelAfter(first);
            }
        }

        const ctx : IProcessInvocationContext = {
            startInfo: this.startInfo,
            signal: this.startInfo.signal,
            outCaptures: this.startInfo.outCaptures === undefined ? 
                this.#outCaptures : 
                this.startInfo.outCaptures.concat(this.#outCaptures),
            errorCaptures: this.startInfo.errorCaptures === undefined ? 
                this.#errorCaptures : 
                this.startInfo.errorCaptures.concat(this.#errorCaptures),
        }

        return processRunner.run(ctx);
    }

    runAsync(signal: AbortSignal): Promise<IProcessResult>;
    runAsync(timeout: number): Promise<IProcessResult>;
    runAsync(): Promise<IProcessResult>;
    runAsync(): Promise<IProcessResult> {
        let fileName = this.startInfo.fileName;
        fileName = pathFinder.findOrThrow(fileName);
        this.startInfo.fileName = fileName;

        const first = arguments[0];
        if(first !== undefined) {
            if(first instanceof AbortSignal) {
                this.startInfo.signal = first;
            } else if (typeof first === 'number') {
                this.startInfo.timeout = first;
                this.startInfo.signal = cancelAfter(first);
            }
        }

        const ctx : IProcessInvocationContext = {
            startInfo: this.startInfo,
            signal: this.startInfo.signal,
            outCaptures: this.startInfo.outCaptures === undefined ? 
                this.#outCaptures : 
                this.startInfo.outCaptures.concat(this.#outCaptures),
            errorCaptures: this.startInfo.errorCaptures === undefined ? 
                this.#errorCaptures : 
                this.startInfo.errorCaptures.concat(this.#errorCaptures),
        }

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
} = Process

export { 
    pathFinder,
    findExecutable,
    findExecutableAsync,
    findExecutableOrThrow,
    findExecutableOrThrowAsync,
    registerExecutable,
    resolveScript,
    resolveScriptAsync,
    which, 
    whichAsync,   
};