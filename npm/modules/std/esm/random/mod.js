import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { PlatformNotSupportedError } from '../errors/errors.js';
import { isNode } from '../runtime/mod.js';
// deno-lint-ignore no-unused-vars
let getRandomValues = (array) => {
    throw new PlatformNotSupportedError();
};
let randomUUID = () => {
    throw new PlatformNotSupportedError();
};
if (isNode) {
    // deno-lint-ignore no-explicit-any
    const c = await import(`crypto`);
    const wc = c.webcrypto;
    getRandomValues = (array) => wc.getRandomValues(array);
    randomUUID = () => wc.randomUUID();
}
else {
    getRandomValues = (array) => crypto.getRandomValues(array);
    randomUUID = () => crypto.randomUUID();
}
const randomBytes = (length) => {
    const buffer = new Uint8Array(length);
    getRandomValues(buffer);
    return buffer;
};
const codes = [];
const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
for (let i = 0; i < validChars.length; i++) {
    codes.push(validChars.codePointAt(i));
}
function randomFileName() {
    // useful for generating as password that can be cleared from memory
    // as strings are immutable in javascript
    const chars = new Uint8Array(12);
    chars.fill(0);
    const bytes = randomBytes(12);
    for (let i = 0; i < 12; i++) {
        const bit = (Math.abs(bytes[i]) % codes.length);
        chars[i] = codes[bit];
    }
    return String.fromCodePoint(...chars);
}
export { getRandomValues, randomBytes, randomFileName, randomUUID };
//# sourceMappingURL=mod.js.map