var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SecretGenerator_codes, _SecretGenerator_validator;
import { Char } from '../primitives/char.js';
import { randomBytes } from '../random/mod.js';
export function validate(data) {
    let isDigit = false;
    let isUpperCase = false;
    let isLowerCase = false;
    let isSpecial = false;
    for (let i = 0; i < data.length; i++) {
        const c = data[i];
        // throw?
        if (c === undefined) {
            continue;
        }
        if (Char.isLetterCodePoint(c)) {
            if (Char.isUpperCodePoint(c)) {
                isUpperCase = true;
                continue;
            }
            isLowerCase = true;
            continue;
        }
        if (Char.isDigitCodePoint(c)) {
            isDigit = true;
            continue;
        }
        isSpecial = true;
    }
    return isDigit && isLowerCase && isUpperCase && isSpecial;
}
export default class SecretGenerator {
    constructor() {
        _SecretGenerator_codes.set(this, void 0);
        _SecretGenerator_validator.set(this, void 0);
        __classPrivateFieldSet(this, _SecretGenerator_codes, [], "f");
        __classPrivateFieldSet(this, _SecretGenerator_validator, validate, "f");
    }
    setValidator(validator) {
        __classPrivateFieldSet(this, _SecretGenerator_validator, validator, "f");
    }
    addDefaults() {
        this.add('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-#@~*:{}');
        return this;
    }
    add(value) {
        for (let i = 0; i < value.length; i++) {
            const c = value.codePointAt(i);
            if (c === undefined) {
                continue;
            }
            if (__classPrivateFieldGet(this, _SecretGenerator_codes, "f").includes(c)) {
                continue;
            }
            __classPrivateFieldGet(this, _SecretGenerator_codes, "f").push(c);
        }
        return this;
    }
    generateAsUint8Array(length) {
        // useful for generating as password that can be cleared from memory
        // as strings are immutable in javascript
        let valid = false;
        const chars = new Uint8Array(length);
        while (!valid) {
            chars.fill(0);
            const bytes = randomBytes(length);
            for (let i = 0; i < length; i++) {
                const bit = (Math.abs(bytes[i]) % __classPrivateFieldGet(this, _SecretGenerator_codes, "f").length);
                chars[i] = __classPrivateFieldGet(this, _SecretGenerator_codes, "f")[bit];
            }
            valid = __classPrivateFieldGet(this, _SecretGenerator_validator, "f").call(this, chars);
        }
        return chars;
    }
    generate(length) {
        const chars = this.generateAsUint8Array(length);
        return String.fromCodePoint(...chars);
    }
}
_SecretGenerator_codes = new WeakMap(), _SecretGenerator_validator = new WeakMap();
export function generateSecret(length, characters) {
    const generator = new SecretGenerator();
    if (characters) {
        generator.add(characters);
    }
    else {
        generator.addDefaults();
    }
    return generator.generate(length);
}
export const secretGenerator = new SecretGenerator();
//# sourceMappingURL=generator.js.map