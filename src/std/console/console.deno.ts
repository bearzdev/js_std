import { ArgumentError } from "../errors/errors.ts";
import { StdReader, StdWriter } from "./base.ts";


export class DenoStdWriter extends StdWriter {
    #encoder: TextEncoder;
    constructor() {
        super(Deno.stdout.rid, true);
        this.#encoder = new TextEncoder();
        if(Deno.isatty(Deno.stdout.rid)){
            super.supportsColor = true;
        }
    }

    get supportsColor(): boolean {
        if(Deno.noColor)
            return false;

        return super.supportsColor;
    }

    override write(): number {
        if(arguments.length !== 1) {
            throw new ArgumentError('Invalid number of arguments. write requires one argument.');
        }

        const value = arguments[0];
        if(typeof value === 'string') {
            const data = this.#encoder.encode(arguments[0]);
            return Deno.stdout.writeSync(data);
        }

        if(value instanceof Uint8Array) {
            return Deno.stdout.writeSync(value);
        }
        
        throw new TypeError("Argument must be a string or Uint8Array");
    }

    override writeAsync(): Promise<number> {
        if(arguments.length !== 1) {
            throw new ArgumentError('Invalid number of arguments. write requires one argument.');
        }

        const value = arguments[0];
        if(typeof value === 'string') {
            const data = this.#encoder.encode(arguments[0]);
            return Deno.stdout.write(data);
        }

        if(value instanceof Uint8Array) {
            return Deno.stdout.write(value);
        }
        
        throw new TypeError("Argument must be a string or Uint8Array");
    }

    override dispose(): void {
        Deno.stdout.close();
    }
}

export class DenoStdReader extends StdReader {
    #buffer: Uint8Array;
    #decoder: TextDecoder;
    #bytesRead: number;
    #offset: number;
    #sb: string;

    constructor() {
        super(Deno.stdin.rid, false);
        this.#buffer = new Uint8Array(1024);
        this.#decoder = new TextDecoder();
        this.#bytesRead = 0;
        this.#offset = 0;
        this.#sb = '';
    }
    
    readLine(): string|null {
        if(this.#sb.length > 0) {
            const index = this.#sb.indexOf(this.newLine);
            if(index !== -1) {
                const line = this.#sb.substring(0, index);
                this.#sb = this.#sb.substring(index + 1);
                return line;
            }
        } 
        
        while(true) 
        {
            const read = this.read(this.#buffer);
            if(read === null) {
                return null;
            }

            this.#sb += this.#decoder.decode(this.#buffer.slice(0, read));
            const index = this.#sb.indexOf(this.newLine);
            if(index !== -1) {
                const str = this.#sb.substring(0, index);
                this.#sb = this.#sb.substring(index + 1);
                return str;
            }
        }
    }
    
    readToEnd(): string {
        while(true) {
            const read = this.read(this.#buffer);
            if(read === null) {
                const str = this.#sb;
                this.#sb = '';
                return str;
            }

            this.#sb += this.#decoder.decode(this.#buffer.slice(0, read));;
        }
    }


    read(buf: Uint8Array): number|null {
        return Deno.stdin.readSync(buf);
    }

    async readLineAsync(): Promise<string|null> {
        if(this.#sb.length > 0) {
            const index = this.#sb.indexOf(this.newLine);
            if(index !== -1) {
                const line = this.#sb.substring(0, index);
                this.#sb = this.#sb.substring(index + 1);
                return line;
            }
        } 
        
        while(true) 
        {
            const read = await this.read(this.#buffer);
            if(read === null) {
                return null;
            }

            this.#sb += this.#decoder.decode(this.#buffer.slice(0, read));
            const index = this.#sb.indexOf(this.newLine);
            if(index !== -1) {
                const str = this.#sb.substring(0, index);
                this.#sb = this.#sb.substring(index + 1);
                return str;
            }
        }
    }

    async readToEndAsync(): Promise<string> {
        while(true) {
            const read = await this.read(this.#buffer);
            if(read === null) {
                const str = this.#sb;
                this.#sb = '';
                return str;
            }

            this.#sb += this.#decoder.decode(this.#buffer.slice(0, read));;
        }
    }

    readAsync(buf: Uint8Array): Promise<number|null> {
        return Deno.stdin.read(buf);
    }

    dispose(): void {
        Deno.stdin.close();
    }
}