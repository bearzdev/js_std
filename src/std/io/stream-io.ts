import { IStreamReader, IStreamWriter } from './interfaces.ts';

export abstract class StreamWriter implements IStreamWriter {
    #supportsSync: boolean;

    constructor(supportsSync: boolean) {
        this.#supportsSync = supportsSync;
    }

    get supportsSync(): boolean {
        return this.#supportsSync;
    }

    // deno-lint-ignore no-unused-vars
    write(buf: Uint8Array): number {
        throw new Error('Method not implemented.');
    }

    // deno-lint-ignore no-unused-vars
    writeAsync(p: Uint8Array): Promise<number> {
        throw new Error('Method not implemented.');
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }
}

export abstract class StreamReader implements IStreamReader {
    #supportsSync: boolean;

    constructor(supportsSync: boolean) {
        this.#supportsSync = supportsSync;
    }

    get supportsSync(): boolean {
        return this.#supportsSync;
    }

    // deno-lint-ignore no-unused-vars
    read(buf: Uint8Array): number | null {
        throw new Error('Method not implemented.');
    }

    // deno-lint-ignore no-unused-vars
    readAsync(p: Uint8Array): Promise<number | null> {
        throw new Error('Method not implemented.');
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }
}
