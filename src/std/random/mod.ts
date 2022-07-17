import { PlatformNotSupportedError } from '../errors/errors.ts';
import { globalScope } from '../runtime/mod.ts';
import { isNode } from '../runtime/mod.ts';

// deno-lint-ignore no-unused-vars
let getRandomValues = <T extends ArrayBufferView | null>(array: T): T => {
    throw new PlatformNotSupportedError();
};

let randomUUID = (): string => {
    throw new PlatformNotSupportedError();
};

if (isNode) {
    const c = globalScope.crypto.webcrypto;
    getRandomValues = <T extends ArrayBufferView | null>(array: T): T => c.getRandomValues(array);
    randomUUID = (): string => c.randomUUID();
} else {
    getRandomValues = <T extends ArrayBufferView | null>(array: T): T => crypto.getRandomValues(array);
    randomUUID = (): string => crypto.randomUUID();
}

const randomBytes = (length: number): Uint8Array => {
    const buffer = new Uint8Array(length);
    getRandomValues(buffer);
    return buffer;
};

export {
    randomBytes,
    getRandomValues,
    randomUUID,
};
