import { StringBuilder } from '../text/string-builder.ts';
import { ArgumentError, ArgumentNullError } from '../errors/errors.ts';
import type { IDisposable } from '../primitives/interfaces.ts';
import type { IProcessCapture, IProcessResult, IProcessStartInfo } from './interfaces.ts';


// based on System.CommandLine.ArgumentStringSplitter
export function splitArguments(value: string): string[] {
    
    enum Quote {
        None = 0,
        Single = 1,
        Double = 2,
    }

    let token = "";
    let quote = Quote.None;
    const tokens = [];

    for(let i = 0; i < value.length; i++) {
        const c = value[i];

        if(quote > Quote.None) {
            if(quote === Quote.Single && c === '\'') {
                quote = Quote.None;
                tokens.push(token);
                token = "";
                continue;
            } else if(quote === Quote.Double && c === '"') {
                quote = Quote.None;  
                tokens.push(token);
                token = "";
                continue;
            }
            
            token += c;
            continue;
        }

        if(c === ' ') {
            const remaining = (value.length - 1) - i;
            if(remaining > 2) {

                // if the line ends with characters that normally allow for scripts with multiline
                // statements, consume token and skip characters.
                // ' \\\n'
                // ' \\\r\n'
                // ' `\n'
                // ' `\r\n'
                const j = value[i + 1];
                const k = value[i + 2];
                if(j === '\'' || j === '`') 
                {
                    if(k === '\n')
                    {
                        i += 2;
                        if(token.length > 0)
                            tokens.push(token);
                        token = "";
                        continue;
                    }
                    
                    if(remaining > 3)
                    {
                        const l = value[i + 3];
                        if(k === '\r' && l === '\n')
                        {
                            i += 3;
                            if(token.length > 0)
                                tokens.push(token);
                            token = "";
                            continue;
                        }
                    }
                }
            }


            if(token.length > 0) {
                tokens.push(token);
                token = "";
            }
            continue;
        }
    

        if(token.length === 0) {
            if(c === '\'') {
                quote = Quote.Single;
                continue;
            }
            if(c === '"') {
                quote = Quote.Double;
                continue;
            }
        }

        token += c;
    }

    if(token.length > 0) {
        tokens.push(token);
    }


    return tokens;
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

const collapseArgs  = (parameters: IArguments) : string[] => {
    if(parameters === undefined || parameters.length === 0)
        return [];
    if(parameters.length === 1 && Array.isArray(parameters[0])) {
        return parameters[0];
    }

    return [...parameters] as string[];
}

export class ProcessArgs extends Array<string> {

    constructor(args: string[])
    constructor(...args: string[])
    constructor() {
        super(...collapseArgs(arguments));
    }

    append(value: string): ProcessArgs;
    append(...args: string[]): ProcessArgs;
    append(value: StringBuilder): ProcessArgs;
    append(value: ProcessArgs): ProcessArgs;
    append() {
        if (arguments.length === 1) {
            const first = arguments[0];
            if (typeof first === 'string') {
                const args = splitArguments(first);
                super.push(...args);
                return this;
            }

            if (first instanceof ProcessArgs) {
                super.push(...first);
                return this;
            }

            if (first instanceof StringBuilder) {
                super.push(...splitArguments(first.toString()))
                return this;
            }

            if (Array.isArray(first)) {
                this.push(...first);
                return this;
            }

            if (Object.prototype.toString.call(first) === '[object Object]') {
             
                Object.keys(first).forEach((key) => {
                    super.push(key);
                    super.push(first[key]);
                });

                return this;
            }

            throw new TypeError(`Cannot convert ${first} to ProcessArgs`);
        }

        throw new ArgumentError(
            `ProcessArgs.from() takes 1 argument, but got ${arguments.length}`,
        );
    }

    override push(...args: string[]) {
        let count = 0;
        args.forEach((arg) => {
            const next = splitArguments(arg);
            count += super.push(...next);
        });

        return count;
    }

    static from(value: string): ProcessArgs;
    static from(...args: string[]): ProcessArgs;
    static from(value: StringBuilder): ProcessArgs;
    static from(value: ProcessArgs): ProcessArgs;
    static from(): ProcessArgs {
        return new ProcessArgs().append(...arguments);
    }
}

export class CommandBuilder {
    #parameters: ProcessArgs; 
    

    constructor()
    {
        this.#parameters = new ProcessArgs();
    }

    addArgument(value: number) : this
    addArgument(value: string) : this
    addArgument() : this {
        const first = arguments[0];
        if(typeof first === 'string') {
            this.#parameters.push(first);
            return this;
        }

        if(typeof first === 'number') {
            this.#parameters.push(first.toString());
            return this;
        }

        throw new TypeError(`Cannot convert ${first} to string`);
    }

    addOption(name: string, value: number) : this
    addOption(name: string, value: boolean) : this 
    addOption(name: string, value: string) : this 
    addOption() : this {
        if(arguments.length != 2) {
            throw new ArgumentError(
                `CommandBuilder.addOption() takes 2 arguments, but got ${arguments.length}`,
            );
        }

        const name = arguments[0] as string;
        const value = arguments[1];

        if(typeof name !== 'string') {
            throw new TypeError(`Cannot convert ${name} to string`);
        }

        if(typeof value === 'string') {
            this.#parameters.push(name, value);
            return this;
        }

        if(typeof value === 'number') {
            this.#parameters.push(name, value.toString());
            return this;
        }

        if(typeof value === 'boolean') {
            this.#parameters.push(name);
            return this;
        }

        throw new TypeError(`Argument value type is not supported ${typeof(value)}`);
    }
    
    build(): string[]
    {
        return this.#parameters;
    }

    valueOf() {
        return this.#parameters;
    }

    toString() 
    {
        return this.#parameters.join(' ');
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