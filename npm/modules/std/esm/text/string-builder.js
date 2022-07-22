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
var _StringBuilder_buffer, _StringBuilder_length;
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
export class StringBuilder {
    constructor(value) {
        _StringBuilder_buffer.set(this, void 0);
        _StringBuilder_length.set(this, void 0);
        let initialCapacity = 10;
        if (typeof (value) === 'number') {
            if (value < 1) {
                throw new RangeError('Capacity must be greater than or equal to 1.');
            }
            initialCapacity = value;
        }
        __classPrivateFieldSet(this, _StringBuilder_length, 0, "f");
        __classPrivateFieldSet(this, _StringBuilder_buffer, new Uint8Array(initialCapacity), "f");
    }
    get length() {
        return __classPrivateFieldGet(this, _StringBuilder_length, "f");
    }
    set length(value) {
        if (value < 0) {
            throw new RangeError('Length must be greater than or equal to 0.');
        }
        __classPrivateFieldSet(this, _StringBuilder_length, value, "f");
    }
    clear() {
        __classPrivateFieldSet(this, _StringBuilder_length, 0, "f");
        __classPrivateFieldGet(this, _StringBuilder_buffer, "f").fill(0);
    }
    repeat(value, count) {
        const t = typeof value;
        if (t === 'boolean' || t === 'number' || t === 'string' ||
            value instanceof Uint8Array || value instanceof StringBuilder) {
            for (let i = 0; i < count; i++) {
                // @ts-ignore : typescript does a poor dealing with typeof.
                this.append(value);
            }
            return this;
        }
        throw TypeError('Invalid value type. Value must be a string, number, boolean, Uint8Array, or StringBuilder.');
    }
    append(value, startIndex, length) {
        const i = startIndex || 0;
        if (i < 0) {
            throw new RangeError('Start index must be greater than or equal to 0.');
        }
        if (value instanceof StringBuilder) {
            value = __classPrivateFieldGet(value, _StringBuilder_buffer, "f");
        }
        if (value instanceof Uint8Array) {
            let l = length || value.length;
            l = Math.min(i + l, value.length);
            if ((l - 1) <= i) {
                throw RangeError(`Length (${l}) must be greater than start index ${i} + 1.`);
            }
            const set = value.slice(i, l);
            this.push(...set);
            return this;
        }
        if (value === null || value === undefined) {
            return this;
        }
        if (typeof value === 'number' || typeof value === 'boolean' ||
            typeof value === 'object') {
            value = value.toString();
        }
        if (typeof value === 'string') {
            const l = length || value.length;
            if (l > value.length) {
                throw RangeError(`Length (${l}) must not exceed the length of the value being appended ${value.length}.`);
            }
            if ((i + 1) > l) {
                throw RangeError(`The index ${i} + 1 must not exceed the length`);
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
    appendLine(value, startIndex, length) {
        if (typeof value === 'string' || value instanceof Uint8Array ||
            value instanceof StringBuilder) {
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
    at(index) {
        if (index < 0 || index >= __classPrivateFieldGet(this, _StringBuilder_length, "f")) {
            throw RangeError('Index out of range. Index must be greater than or equal to 0 and less than length.');
        }
        return __classPrivateFieldGet(this, _StringBuilder_buffer, "f")[index];
    }
    insert(index, value, startIndex, length) {
        if (index < 0 || index >= __classPrivateFieldGet(this, _StringBuilder_length, "f")) {
            throw RangeError('Index out of range. Index must be greater than or equal to 0 and less than length.');
        }
        const i = startIndex || 0;
        if (i < 0) {
            throw new RangeError('Start index must be greater than or equal to 0.');
        }
        if (value instanceof StringBuilder) {
            value = __classPrivateFieldGet(value, _StringBuilder_buffer, "f");
        }
        if (value instanceof Uint8Array) {
            let l = length || value.length;
            l = Math.min(i + l, value.length);
            if ((l - 1) <= i) {
                throw RangeError(`Length (${l}) must be greater than start index ${i} + 1.`);
            }
            const set = value.slice(i, l);
            this.insertAt(index, ...set);
            return this;
        }
        if (value === null || value === undefined) {
            return this;
        }
        if (typeof value === 'number' || typeof value === 'boolean' ||
            typeof value === 'object') {
            value = value.toString();
        }
        if (typeof value === 'string') {
            const l = length || value.length;
            if ((l - 1) <= i) {
                throw RangeError(`Length (${l}) must be greater than start index ${i} + 1.`);
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
    push(...args) {
        var _a, _b;
        if (__classPrivateFieldGet(this, _StringBuilder_length, "f") >= __classPrivateFieldGet(this, _StringBuilder_buffer, "f").length) {
            let growth = __classPrivateFieldGet(this, _StringBuilder_buffer, "f").length * 2;
            if (growth < args.length) {
                growth = args.length;
            }
            this.grow(growth);
        }
        for (let i = 0; i < args.length; i++) {
            const c = args[i];
            if (c < 0) {
                throw RangeError(`Invalid character. Character must be greater than or equal to 0 at index ${i} .`);
            }
            __classPrivateFieldGet(this, _StringBuilder_buffer, "f")[__classPrivateFieldSet(this, _StringBuilder_length, (_b = __classPrivateFieldGet(this, _StringBuilder_length, "f"), _a = _b++, _b), "f"), _a] = args[i];
        }
    }
    valueOf() {
        return this.toString();
    }
    toString() {
        return String.fromCodePoint(...__classPrivateFieldGet(this, _StringBuilder_buffer, "f").slice(0, __classPrivateFieldGet(this, _StringBuilder_length, "f")));
    }
    insertAt(index, ...args) {
        var _a, _b;
        if (__classPrivateFieldGet(this, _StringBuilder_length, "f") >= __classPrivateFieldGet(this, _StringBuilder_buffer, "f").length) {
            let growth = __classPrivateFieldGet(this, _StringBuilder_buffer, "f").length * 2;
            const minLength = index + args.length;
            if (growth < minLength) {
                growth = minLength;
            }
            this.grow(growth);
        }
        for (let i = index; i < args.length; i++) {
            const c = args[i];
            if (c < 0) {
                throw RangeError(`Invalid character. Character must be greater than or equal to 0 at index ${i} .`);
            }
            __classPrivateFieldGet(this, _StringBuilder_buffer, "f")[__classPrivateFieldSet(this, _StringBuilder_length, (_b = __classPrivateFieldGet(this, _StringBuilder_length, "f"), _a = _b++, _b), "f"), _a] = args[i];
        }
    }
    grow(size) {
        const newBuffer = new Uint8Array(__classPrivateFieldGet(this, _StringBuilder_buffer, "f").length + size);
        newBuffer.set(__classPrivateFieldGet(this, _StringBuilder_buffer, "f"));
        __classPrivateFieldSet(this, _StringBuilder_buffer, newBuffer, "f");
    }
}
_StringBuilder_buffer = new WeakMap(), _StringBuilder_length = new WeakMap();
//# sourceMappingURL=string-builder.js.map