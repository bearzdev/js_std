import { IAsyncTextReader, IAsyncTextWriter, IHandle, ITextReader, ITextWriter } from '../io/interfaces.ts';
import { StreamReader, StreamWriter } from '../io/stream-io.ts';

export abstract class StdWriter extends StreamWriter implements IHandle, ITextWriter, IAsyncTextWriter {
    #supportsColor: boolean;
    #handle: number;
    newLine: string;

    constructor(handle: number, supportsSync: boolean) {
        super(supportsSync);
        this.#handle = handle;
        this.newLine = '\n';
        this.#supportsColor = false;
    }

    get handle(): number {
        return this.#handle;
    }

    get supportsColor(): boolean {
        return this.#supportsColor;
    }

    set supportsColor(value: boolean) {
        this.#supportsColor = value;
    }

    writeLine(str: string): number {
        return this.write(str + this.newLine);
    }

    abstract write(str: string): number;
    abstract write(buf: Uint8Array): number;
    abstract write(): number;

    writeLineAsync(str: string): Promise<number> {
        return this.writeAsync(str + this.newLine);
    }

    abstract writeAsync(str: string): Promise<number>;
    abstract writeAsync(buf: Uint8Array): Promise<number>;
    abstract writeAsync(): Promise<number>;
}

export abstract class StdReader extends StreamReader implements IHandle, ITextReader, IAsyncTextReader {
    #handle: number;
    newLine: string;

    constructor(handle: number, supportsSync: boolean) {
        super(supportsSync);
        this.#handle = handle;
        this.newLine = '\n';
    }

    get handle(): number {
        return this.#handle;
    }

    abstract readLine(): string | null;
    abstract readToEnd(): string;
    abstract read(buf: Uint8Array): number | null;

    abstract readLineAsync(): Promise<string | null>;
    abstract readToEndAsync(): Promise<string>;
    abstract readAsync(buf: Uint8Array): Promise<number | null>;
}
