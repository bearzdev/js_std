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

const codes : number[] = [];
const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

for(let i = 0; i < validChars.length; i++) {
    codes.push(validChars.codePointAt(i)!);
}

function randomFileName() {
    // useful for generating as password that can be cleared from memory
        // as strings are immutable in javascript
    const chars: Uint8Array = new Uint8Array(12);

    chars.fill(0);
    const bytes = randomBytes(12);

    for (let i = 0; i < 12; i++) {
        const bit = (Math.abs(bytes[i]) % codes.length);
        chars[i] = codes[bit];
    }

    return String.fromCodePoint(...chars);
}

export {
    randomBytes,
    getRandomValues,
    randomFileName,
    randomUUID,
};
