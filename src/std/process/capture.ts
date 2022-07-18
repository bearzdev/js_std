import { IDisposable } from '../primitives/interfaces.ts';

export interface IProcessCapture extends IDisposable {
    write(data: Uint8Array): void;
    writeLine(line: string): void;
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