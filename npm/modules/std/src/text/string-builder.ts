import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
export class StringBuilder {
    #buffer: Uint8Array;
    #length: number;

    constructor(capacity: number);
    constructor(value: StringBuilder);
    constructor(value: string);
    constructor();
    constructor(value?: unknown) {
        let initialCapacity = 10;
        if (typeof (value) === 'number') {
            if (value < 1) {
                throw new RangeError(
                    'Capacity must be greater than or equal to 1.',
                );
            }

            initialCapacity = value;
        }

        this.#length = 0;
        this.#buffer = new Uint8Array(initialCapacity);
    }

    get length(): number {
        return this.#length;
    }

    set length(value: number) {
        if (value < 0) {
            throw new RangeError('Length must be greater than or equal to 0.');
        }

        this.#length = value;
    }

    clear() {
        this.#length = 0;
        this.#buffer.fill(0);
    }

    // deno-lint-ignore ban-types
    repeat(value: boolean | number | object, count: number): StringBuilder;
    repeat(
        value: string | Uint8Array | StringBuilder,
        count: number,
    ): StringBuilder;
    repeat(value: unknown, count: number): StringBuilder {
        const t = typeof value;
        if (
            t === 'boolean' || t === 'number' || t === 'string' ||
            value instanceof Uint8Array || value instanceof StringBuilder
        ) {
            for (let i = 0; i < count; i++) {
                // @ts-ignore : typescript does a poor dealing with typeof.
                this.append(value);
            }

            return this;
        }

        throw TypeError(
            'Invalid value type. Value must be a string, number, boolean, Uint8Array, or StringBuilder.',
        );
    }

    // deno-lint-ignore ban-types
    append(value: boolean | number | object): StringBuilder;
    append(
        value: string | Uint8Array | StringBuilder,
        index?: number,
        length?: number,
    ): StringBuilder;
    append(
        value: unknown,
        startIndex?: number,
        length?: number,
    ): StringBuilder {
        const i = startIndex || 0;

        if (i < 0) {
            throw new RangeError(
                'Start index must be greater than or equal to 0.',
            );
        }

        if (value instanceof StringBuilder) {
            value = value.#buffer;
        }

        if (value instanceof Uint8Array) {
            let l = length || value.length;
            l = Math.min(i + l, value.length);

            if ((l - 1) <= i) {
                throw RangeError(
                    `Length (${l}) must be greater than start index ${i} + 1.`,
                );
            }

            const set = value.slice(i, l);
            this.push(...set);
            return this;
        }

        if (value === null || value === undefined) {
            return this;
        }

        if (
            typeof value === 'number' || typeof value === 'boolean' ||
            typeof value === 'object'
        ) {
            value = value.toString();
        }

        if (typeof value === 'string') {
            const l = length || value.length;
            if (l > value.length) {
                throw RangeError(
                    `Length (${l}) must not exceed the length of the value being appended ${value.length}.`,
                );
            }

            if ((i + 1) > l) {
                throw RangeError(
                    `The index ${i} + 1 must not exceed the length`,
                );
            }

            for (let j = i; j < l; j++) {
                const c = value.codePointAt(j);
                if (c === undefined) {
                    continue;
                }

                this.push(c);
            }

            return this;
        }

        return this;
    }

    // deno-lint-ignore ban-types
    appendLine(value: boolean | number | object): StringBuilder;
    appendLine(
        value: string | Uint8Array | StringBuilder,
        index?: number,
        length?: number,
    ): StringBuilder;
    appendLine(
        value: unknown,
        startIndex?: number,
        length?: number,
    ): StringBuilder {
        if (
            typeof value === 'string' || value instanceof Uint8Array ||
            value instanceof StringBuilder
        ) {
            this.append(value, startIndex, length);
            return this;
        }

        const t = typeof value;
        if (t === 'boolean' || t === 'number' || t === 'object') {
            // @ts-ignore : typescript does a poor dealing with typeof.
            this.append(value);
        }

        return this;
    }

    at(index: number): number {
        if (index < 0 || index >= this.#length) {
            throw RangeError(
                'Index out of range. Index must be greater than or equal to 0 and less than length.',
            );
        }

        return this.#buffer[index];
    }

    // deno-lint-ignore ban-types
    insert(index: number, value: boolean | number | object): StringBuilder;
    insert(
        index: number,
        value: string | Uint8Array | StringBuilder,
        startIndex?: number,
        length?: number,
    ): StringBuilder;
    insert(
        index: number,
        value: unknown,
        startIndex?: number,
        length?: number,
    ): StringBuilder {
        if (index < 0 || index >= this.#length) {
            throw RangeError(
                'Index out of range. Index must be greater than or equal to 0 and less than length.',
            );
        }

        const i = startIndex || 0;

        if (i < 0) {
            throw new RangeError(
                'Start index must be greater than or equal to 0.',
            );
        }

        if (value instanceof StringBuilder) {
            value = value.#buffer;
        }

        if (value instanceof Uint8Array) {
            let l = length || value.length;
            l = Math.min(i + l, value.length);

            if ((l - 1) <= i) {
                throw RangeError(
                    `Length (${l}) must be greater than start index ${i} + 1.`,
                );
            }

            const set = value.slice(i, l);
            this.insertAt(index, ...set);
            return this;
        }

        if (value === null || value === undefined) {
            return this;
        }

        if (
            typeof value === 'number' || typeof value === 'boolean' ||
            typeof value === 'object'
        ) {
            value = value.toString();
        }

        if (typeof value === 'string') {
            const l = length || value.length;
            if ((l - 1) <= i) {
                throw RangeError(
                    `Length (${l}) must be greater than start index ${i} + 1.`,
                );
            }

            for (let j = i; j < l; j++) {
                const c = value.codePointAt(j);
                if (c === undefined) {
                    continue;
                }

                this.insertAt(index++, c);
            }

            return this;
        }

        return this;
    }

    push(...args: number[]) {
        if (this.#length >= this.#buffer.length) {
            let growth = this.#buffer.length * 2;
            if (growth < args.length) {
                growth = args.length;
            }
            this.grow(growth);
        }

        for (let i = 0; i < args.length; i++) {
            const c = args[i];
            if (c < 0) {
                throw RangeError(
                    `Invalid character. Character must be greater than or equal to 0 at index ${i} .`,
                );
            }
            this.#buffer[this.#length++] = args[i];
        }
    }

    valueOf(): string {
        return this.toString();
    }

    toString() {
        return String.fromCodePoint(...this.#buffer.slice(0, this.#length));
    }

    private insertAt(index: number, ...args: number[]) {
        if (this.#length >= this.#buffer.length) {
            let growth = this.#buffer.length * 2;
            const minLength = index + args.length;
            if (growth < minLength) {
                growth = minLength;
            }
            this.grow(growth);
        }

        for (let i = index; i < args.length; i++) {
            const c = args[i];
            if (c < 0) {
                throw RangeError(
                    `Invalid character. Character must be greater than or equal to 0 at index ${i} .`,
                );
            }
            this.#buffer[this.#length++] = args[i];
        }
    }

    private grow(size: number) {
        const newBuffer = new Uint8Array(this.#buffer.length + size);
        newBuffer.set(this.#buffer);
        this.#buffer = newBuffer;
    }
}
