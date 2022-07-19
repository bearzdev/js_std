import { StringBuilder } from '../text/string-builder.ts';
import { ArgumentError, ArgumentNullError } from '../errors/errors.ts';
import type { IDisposable } from '../primitives/interfaces.ts';
import type { IProcessCapture, IProcessResult, IProcessStartInfo } from './interfaces.ts';
import { Char } from '../primitives/char.ts';

enum Boundary {
    TokenStart = 0,
    WordEnd = 1,
    QuoteStart = 2,
    QuoteEnd = 3,
}
// based on System.CommandLine.ArgumentStringSplitter
export function splitArguments(value: string): string[] {
    let startTokenIndex = 0;
    let pos = 0;
    let seeking = Boundary.TokenStart;
    let seekingQuote = Boundary.QuoteStart;

    const advance = () => pos++;
    const indexOfEndToken = () => pos - startTokenIndex;
    const isEol = () => pos == value.length;

    const currentToken = () => value.slice(startTokenIndex, indexOfEndToken()).replace('"', '');

    const results: string[] = [];

    while (pos < value.length) {
        const c = value[pos];
        if (Char.isWhiteSpaceAt(value, pos)) {
            if (seekingQuote === Boundary.QuoteStart) {
                switch (seeking) {
                    case Boundary.WordEnd:
                        results.push(currentToken());
                        startTokenIndex = pos;
                        seekingQuote = Boundary.TokenStart;
                        break;

                    case Boundary.TokenStart:
                        startTokenIndex = pos;
                        break;
                }
            }
        } else if (c === '"') {
            if (seeking === Boundary.TokenStart) {
                switch (seekingQuote) {
                    case Boundary.QuoteEnd:
                        results.push(currentToken());
                        startTokenIndex = pos;
                        seekingQuote = Boundary.QuoteStart;
                        break;

                    case Boundary.QuoteStart:
                        startTokenIndex = pos + 1;
                        seekingQuote = Boundary.QuoteEnd;
                        break;
                }
            } else {
                switch (seekingQuote) {
                    case Boundary.QuoteEnd:
                        seekingQuote = Boundary.QuoteStart;
                        break;

                    case Boundary.QuoteStart:
                        seekingQuote = Boundary.QuoteEnd;
                        break;
                }
            }
        } else if (
            seeking === Boundary.TokenStart &&
            seekingQuote === Boundary.QuoteStart
        ) {
            seeking = Boundary.WordEnd;
            startTokenIndex = pos;
        }

        advance();
        if (isEol()) {
            switch (seeking) {
                case Boundary.TokenStart:
                    break;
                default:
                    results.push(currentToken());
                    break;
            }
        }
    }

    return results;
}

export type {
    IProcessCapture,
    IProcessResult,
    IProcessStartInfo,
}


const decoder = new TextDecoder();
const encoder = new TextEncoder();

export abstract class ProcessCapture implements IProcessCapture, IDisposable {
    abstract write(data: Uint8Array | undefined): void;

    abstract writeLine(line: string | undefined): void;

    abstract dispose(): void;
}

export class ArrayCapture extends ProcessCapture implements IProcessCapture {
    #array: string[];
    #sb: string;

    constructor(array: string[]) {
        super();
        this.#array = array;
        this.#sb = '';
    }

    write(data: Uint8Array | undefined) {
        if (data === undefined) {
            if (this.#sb.length > 0) {
                this.#array.push(this.#sb);
            }

            return;
        }

        const str = decoder.decode(data);
        const lines = str.split('\n');
        if (lines.length > 1) {
            for (let i = 0; i < lines.length - 1; i++) {
                if (i === 0) {
                    this.#sb += lines[i];
                    this.#array.push(this.#sb);
                    this.#sb = '';
                    continue;
                }
                this.#array.push(lines[i]);
            }
            this.#sb += lines[lines.length - 1];
        } else {
            this.#sb += str;
        }
    }

    writeLine(line: string | undefined) {
        if (line === undefined) {
            return;
        }

        this.#array.push(line);
    }

    override dispose(): void {
        if (this.#sb.length > 0) {
            this.#array.push(this.#sb);
        }

        this.#sb = '';
    }
}

export class WritableStreamCapture extends ProcessCapture implements IProcessCapture {
    #stream: WritableStream<Uint8Array>;
    #chain: Promise<void>;
    #writer: WritableStreamDefaultWriter<Uint8Array>;
    #close: boolean;

    constructor(stream: WritableStream<Uint8Array>, close = true) {
        super();
        this.#stream = stream;
        this.#chain = Promise<void>.resolve();
        this.#writer = this.#stream.getWriter();
        this.#close = close;
    }

    write(data: Uint8Array | undefined): void {
        this.#chain.then(() => this.#writer.write(data));
    }

    writeLine(line: string | undefined): void {
        this.#chain.then(() => this.#writer.write(encoder.encode(line + '\n')));
    }

    override dispose(): void {
        if (this.#close) {
            this.#chain.finally(() => this.#writer.close());
        }
    }
}

export class ProcessArgs extends Array<string> {
    constructor(...args: string[]) {
        super(...args);
    }

    append(value: string): ProcessArgs;
    append(...args: string[]): ProcessArgs;
    append(value: StringBuilder): ProcessArgs;
    append(value: ProcessArgs): ProcessArgs;
    append() {
        if (arguments.length === 1) {
            const first = arguments[0];
            if (typeof first === 'string') {
                return new ProcessArgs(...splitArguments(first));
            }

            if (first instanceof ProcessArgs) {
                return first;
            }

            if (first instanceof StringBuilder) {
                return new ProcessArgs(...splitArguments(first.toString()));
            }

            if (Array.isArray(first)) {
                const args = new ProcessArgs();
                args.push(...first);
                return args;
            }

            if (Object.prototype.toString.call(first) === '[object Object]') {
                const args = new ProcessArgs();
                Object.keys(first).forEach((key) => {
                    args.push(key);
                    args.push(first[key]);
                });

                return args;
            }

            throw new TypeError(`Cannot convert ${first} to ProcessArgs`);
        }

        throw new ArgumentError(
            `ProcessArgs.from() takes 1 argument, but got ${arguments.length}`,
        );
    }

    override push(...args: string[]) {
        const set: string[] = [];
        args.forEach((arg) => {
            const next = splitArguments(arg);
            set.push(...next);
        });

        return super.push(...set);
    }

    static from(value: string): ProcessArgs;
    static from(...args: string[]): ProcessArgs;
    static from(value: StringBuilder): ProcessArgs;
    static from(value: ProcessArgs): ProcessArgs;
    static from(): ProcessArgs {
        const args = new ProcessArgs();
        args.append(...arguments);
        return args;
    }
}

    
 export class ProcessResult implements IProcessResult {
        exitCode = 0;
        standardOut: string[];
        standardError: string[];
        fileName: string;
        args: string[];
        startedAt?: Date;
        stoppedAt?: Date;
    
        constructor(options?: Partial<IProcessResult>) {
            this.standardOut = [];
            this.standardError = [];
            this.args = [];
            this.fileName = '';
    
            this.set(options);
        }

        set (options?: Partial<IProcessResult>) {
            if (options) {
                Object.assign(this, options);
            }
            return this;
        }
    }
    
    export class ProcessStartInfo implements IProcessStartInfo {
        env?: { [key: string]: string };
        args: string[];
        workingDirectory?: string;
        userId?: number;
        groupId?: number;
        fileName = '';
        outCaptures?: IProcessCapture[];
        errorCaptures?: IProcessCapture[];
        timeout?: number;
        signal?: AbortSignal;
    
    
        constructor(fileName: string, ...args: string[])
        constructor(options: Partial<IProcessStartInfo>)
        constructor()
        constructor() {
            this.outCaptures = [];
            this.errorCaptures = [];
            this.args = [];
            this.fileName = '';
            if(arguments.length === 0) {
                return;
            }

            const first = arguments[0];
            if(typeof (first) === 'object') {
                this.set(first);
                return;
            }

            if(typeof (first) === 'string') {
                this.fileName = first || '';
                this.args = arguments.length >= 2 ? [...arguments].slice(1) : this.args;
            }

        }
    
        set(options?: Partial<IProcessStartInfo>)  {
            if(options) {
                Object.assign(this, options);
            }
    
            return this;
        }
    
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
    
            this.outCaptures ||= [];
    
            if (first instanceof ProcessCapture) {
                this.outCaptures.push(arguments[0]);
                return this;
            }
    
            if (Array.isArray(first)) {
                this.outCaptures.push(new ArrayCapture(first));
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
    
            this.errorCaptures ||= [];
    
            if (first instanceof ProcessCapture) {
                this.errorCaptures.push(arguments[0]);
                return this;
            }
    
            if (Array.isArray(first)) {
                this.errorCaptures.push(new ArrayCapture(first));
                return this;
            }
        }
    
        push(...args: string[]) {
            this.args.push(...args);
            return this;
        }
    }