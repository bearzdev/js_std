import { Char } from '../primitives/char.ts';
import { randomBytes } from '../random/mod.ts';

export function validate(data: Uint8Array) {
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

export interface ISecretGenerator {
    setValidator(validator: (value: Uint8Array) => boolean): void;
    add(value: string): ISecretGenerator;
    generate(length: number): string;
    generateAsUint8Array(length: number): Uint8Array;
}

export default class SecretGenerator {
    #codes: number[];
    #validator: (value: Uint8Array) => boolean;

    constructor() {
        this.#codes = [];
        this.#validator = validate;
    }

    setValidator(validator: (value: Uint8Array) => boolean) {
        this.#validator = validator;
    }

    addDefaults() {
        this.add(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-#@~*:{}',
        );
        return this;
    }

    add(value: string) {
        for (let i = 0; i < value.length; i++) {
            const c = value.codePointAt(i);
            if (c === undefined) {
                continue;
            }

            if (this.#codes.includes(c)) {
                continue;
            }

            this.#codes.push(c);
        }

        return this;
    }

    generateAsUint8Array(length: number): Uint8Array {
        // useful for generating as password that can be cleared from memory
        // as strings are immutable in javascript
        let valid = false;
        const chars: Uint8Array = new Uint8Array(length);
        const maxAttempts = 5000;
        let attempts = 0;

        while (!valid && attempts <  maxAttempts) {
            chars.fill(0);
            const bytes = randomBytes(length);

            for (let i = 0; i < length; i++) {
                const bit = (Math.abs(bytes[i]) % this.#codes.length);
                chars[i] = this.#codes[bit];
            }

            attempts++;
            valid = this.#validator(chars);
        }

        if(!valid) {
            throw new Error('Failed to generate secret');
        }

        return chars;
    }

    generate(length: number) {
        const chars = this.generateAsUint8Array(length);
        return String.fromCodePoint(...chars);
    }
}

export function generateSecret(length: number, characters?: string) {
    const generator = new SecretGenerator();
    if (characters) {
        generator.add(characters);
    } else {
        generator.addDefaults();
    }

    return generator.generate(length);
}

export const secretGenerator = new SecretGenerator().addDefaults();
