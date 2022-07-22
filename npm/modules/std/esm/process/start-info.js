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
var _ArrayCapture_array, _ArrayCapture_sb, _WritableStreamCapture_stream, _WritableStreamCapture_chain, _WritableStreamCapture_writer, _WritableStreamCapture_close, _CommandBuilder_parameters;
import { StringBuilder } from '../text/string-builder.js';
import { ArgumentError, ArgumentNullError } from '../errors/errors.js';
// based on System.CommandLine.ArgumentStringSplitter
export function splitArguments(value) {
    let Quote;
    (function (Quote) {
        Quote[Quote["None"] = 0] = "None";
        Quote[Quote["Single"] = 1] = "Single";
        Quote[Quote["Double"] = 2] = "Double";
    })(Quote || (Quote = {}));
    let token = '';
    let quote = Quote.None;
    const tokens = [];
    for (let i = 0; i < value.length; i++) {
        const c = value[i];
        if (quote > Quote.None) {
            if (quote === Quote.Single && c === '\'') {
                quote = Quote.None;
                tokens.push(token);
                token = '';
                continue;
            }
            else if (quote === Quote.Double && c === '"') {
                quote = Quote.None;
                tokens.push(token);
                token = '';
                continue;
            }
            token += c;
            continue;
        }
        if (c === ' ') {
            const remaining = (value.length - 1) - i;
            if (remaining > 2) {
                // if the line ends with characters that normally allow for scripts with multiline
                // statements, consume token and skip characters.
                // ' \\\n'
                // ' \\\r\n'
                // ' `\n'
                // ' `\r\n'
                const j = value[i + 1];
                const k = value[i + 2];
                if (j === '\'' || j === '`') {
                    if (k === '\n') {
                        i += 2;
                        if (token.length > 0) {
                            tokens.push(token);
                        }
                        token = '';
                        continue;
                    }
                    if (remaining > 3) {
                        const l = value[i + 3];
                        if (k === '\r' && l === '\n') {
                            i += 3;
                            if (token.length > 0) {
                                tokens.push(token);
                            }
                            token = '';
                            continue;
                        }
                    }
                }
            }
            if (token.length > 0) {
                tokens.push(token);
                token = '';
            }
            continue;
        }
        if (token.length === 0) {
            if (c === '\'') {
                quote = Quote.Single;
                continue;
            }
            if (c === '"') {
                quote = Quote.Double;
                continue;
            }
        }
        token += c;
    }
    if (token.length > 0) {
        tokens.push(token);
    }
    return tokens;
}
const decoder = new TextDecoder();
const encoder = new TextEncoder();
export class ProcessCapture {
}
export class ArrayCapture extends ProcessCapture {
    constructor(array) {
        super();
        _ArrayCapture_array.set(this, void 0);
        _ArrayCapture_sb.set(this, void 0);
        __classPrivateFieldSet(this, _ArrayCapture_array, array, "f");
        __classPrivateFieldSet(this, _ArrayCapture_sb, '', "f");
    }
    write(data) {
        if (data === undefined) {
            if (__classPrivateFieldGet(this, _ArrayCapture_sb, "f").length > 0) {
                __classPrivateFieldGet(this, _ArrayCapture_array, "f").push(__classPrivateFieldGet(this, _ArrayCapture_sb, "f"));
            }
            return;
        }
        const str = decoder.decode(data);
        const lines = str.split('\n');
        if (lines.length > 1) {
            for (let i = 0; i < lines.length - 1; i++) {
                if (i === 0) {
                    __classPrivateFieldSet(this, _ArrayCapture_sb, __classPrivateFieldGet(this, _ArrayCapture_sb, "f") + lines[i], "f");
                    __classPrivateFieldGet(this, _ArrayCapture_array, "f").push(__classPrivateFieldGet(this, _ArrayCapture_sb, "f"));
                    __classPrivateFieldSet(this, _ArrayCapture_sb, '', "f");
                    continue;
                }
                __classPrivateFieldGet(this, _ArrayCapture_array, "f").push(lines[i]);
            }
            __classPrivateFieldSet(this, _ArrayCapture_sb, __classPrivateFieldGet(this, _ArrayCapture_sb, "f") + lines[lines.length - 1], "f");
        }
        else {
            __classPrivateFieldSet(this, _ArrayCapture_sb, __classPrivateFieldGet(this, _ArrayCapture_sb, "f") + str, "f");
        }
    }
    writeLine(line) {
        if (line === undefined) {
            return;
        }
        __classPrivateFieldGet(this, _ArrayCapture_array, "f").push(line);
    }
    dispose() {
        if (__classPrivateFieldGet(this, _ArrayCapture_sb, "f").length > 0) {
            __classPrivateFieldGet(this, _ArrayCapture_array, "f").push(__classPrivateFieldGet(this, _ArrayCapture_sb, "f"));
        }
        __classPrivateFieldSet(this, _ArrayCapture_sb, '', "f");
    }
}
_ArrayCapture_array = new WeakMap(), _ArrayCapture_sb = new WeakMap();
export class WritableStreamCapture extends ProcessCapture {
    constructor(stream, close = true) {
        super();
        _WritableStreamCapture_stream.set(this, void 0);
        _WritableStreamCapture_chain.set(this, void 0);
        _WritableStreamCapture_writer.set(this, void 0);
        _WritableStreamCapture_close.set(this, void 0);
        __classPrivateFieldSet(this, _WritableStreamCapture_stream, stream, "f");
        __classPrivateFieldSet(this, _WritableStreamCapture_chain, Promise.resolve(), "f");
        __classPrivateFieldSet(this, _WritableStreamCapture_writer, __classPrivateFieldGet(this, _WritableStreamCapture_stream, "f").getWriter(), "f");
        __classPrivateFieldSet(this, _WritableStreamCapture_close, close, "f");
    }
    write(data) {
        __classPrivateFieldGet(this, _WritableStreamCapture_chain, "f").then(() => __classPrivateFieldGet(this, _WritableStreamCapture_writer, "f").write(data));
    }
    writeLine(line) {
        __classPrivateFieldGet(this, _WritableStreamCapture_chain, "f").then(() => __classPrivateFieldGet(this, _WritableStreamCapture_writer, "f").write(encoder.encode(line + '\n')));
    }
    dispose() {
        if (__classPrivateFieldGet(this, _WritableStreamCapture_close, "f")) {
            __classPrivateFieldGet(this, _WritableStreamCapture_chain, "f").finally(() => __classPrivateFieldGet(this, _WritableStreamCapture_writer, "f").close());
        }
    }
}
_WritableStreamCapture_stream = new WeakMap(), _WritableStreamCapture_chain = new WeakMap(), _WritableStreamCapture_writer = new WeakMap(), _WritableStreamCapture_close = new WeakMap();
const collapseArgs = (parameters) => {
    if (parameters === undefined || parameters.length === 0) {
        return [];
    }
    if (parameters.length === 1 && Array.isArray(parameters[0])) {
        return parameters[0];
    }
    return [...parameters];
};
export class ProcessArgs extends Array {
    constructor() {
        super(...collapseArgs(arguments));
    }
    append() {
        if (arguments.length === 1) {
            const first = arguments[0];
            if (typeof first === 'string') {
                const args = splitArguments(first);
                super.push(...args);
                return this;
            }
            if (first instanceof ProcessArgs) {
                super.push(...first);
                return this;
            }
            if (first instanceof StringBuilder) {
                super.push(...splitArguments(first.toString()));
                return this;
            }
            if (Array.isArray(first)) {
                this.push(...first);
                return this;
            }
            if (Object.prototype.toString.call(first) === '[object Object]') {
                Object.keys(first).forEach((key) => {
                    super.push(key);
                    super.push(first[key]);
                });
                return this;
            }
            throw new TypeError(`Cannot convert ${first} to ProcessArgs`);
        }
        throw new ArgumentError(`ProcessArgs.from() takes 1 argument, but got ${arguments.length}`);
    }
    push(...args) {
        let count = 0;
        args.forEach((arg) => {
            const next = splitArguments(arg);
            count += super.push(...next);
        });
        return count;
    }
    static from() {
        return new ProcessArgs().append(...arguments);
    }
}
export class CommandBuilder {
    constructor() {
        _CommandBuilder_parameters.set(this, void 0);
        __classPrivateFieldSet(this, _CommandBuilder_parameters, new ProcessArgs(), "f");
    }
    addArgument() {
        const first = arguments[0];
        if (typeof first === 'string') {
            __classPrivateFieldGet(this, _CommandBuilder_parameters, "f").push(first);
            return this;
        }
        if (typeof first === 'number') {
            __classPrivateFieldGet(this, _CommandBuilder_parameters, "f").push(first.toString());
            return this;
        }
        throw new TypeError(`Cannot convert ${first} to string`);
    }
    addOption() {
        if (arguments.length != 2) {
            throw new ArgumentError(`CommandBuilder.addOption() takes 2 arguments, but got ${arguments.length}`);
        }
        const name = arguments[0];
        const value = arguments[1];
        if (typeof name !== 'string') {
            throw new TypeError(`Cannot convert ${name} to string`);
        }
        if (typeof value === 'string') {
            __classPrivateFieldGet(this, _CommandBuilder_parameters, "f").push(name, value);
            return this;
        }
        if (typeof value === 'number') {
            __classPrivateFieldGet(this, _CommandBuilder_parameters, "f").push(name, value.toString());
            return this;
        }
        if (typeof value === 'boolean') {
            __classPrivateFieldGet(this, _CommandBuilder_parameters, "f").push(name);
            return this;
        }
        throw new TypeError(`Argument value type is not supported ${typeof (value)}`);
    }
    build() {
        return __classPrivateFieldGet(this, _CommandBuilder_parameters, "f");
    }
    valueOf() {
        return __classPrivateFieldGet(this, _CommandBuilder_parameters, "f");
    }
    toString() {
        return __classPrivateFieldGet(this, _CommandBuilder_parameters, "f").join(' ');
    }
}
_CommandBuilder_parameters = new WeakMap();
export class ProcessResult {
    constructor(options) {
        Object.defineProperty(this, "exitCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "standardOut", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "standardError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fileName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "startedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stoppedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.standardOut = [];
        this.standardError = [];
        this.args = [];
        this.fileName = '';
        this.set(options);
    }
    set(options) {
        if (options) {
            Object.assign(this, options);
        }
        return this;
    }
}
export class ProcessStartInfo {
    constructor() {
        Object.defineProperty(this, "env", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "workingDirectory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "groupId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fileName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "outCaptures", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "errorCaptures", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "signal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.outCaptures = [];
        this.errorCaptures = [];
        this.args = [];
        this.fileName = '';
        if (arguments.length === 0) {
            return;
        }
        const first = arguments[0];
        if (typeof (first) === 'object') {
            this.set(first);
            return;
        }
        if (typeof (first) === 'string') {
            this.fileName = first || '';
            this.args = arguments.length >= 2 ? [...arguments].slice(1) : this.args;
        }
    }
    set(options) {
        if (options) {
            Object.assign(this, options);
        }
        return this;
    }
    redirectTo() {
        if (arguments.length === 0) {
            throw new Error('No arguments');
        }
        const first = arguments[0];
        if (first === undefined || first === null) {
            throw new ArgumentNullError('capture');
        }
        this.outCaptures ||= [];
        if (first instanceof ProcessCapture) {
            this.outCaptures.push(arguments[0]);
            return this;
        }
        if (Array.isArray(first)) {
            this.outCaptures.push(new ArrayCapture(first));
            return this;
        }
    }
    redirectErrorTo() {
        if (arguments.length === 0) {
            throw new Error('No arguments');
        }
        const first = arguments[0];
        if (first === undefined || first === null) {
            throw new ArgumentNullError('capture');
        }
        this.errorCaptures ||= [];
        if (first instanceof ProcessCapture) {
            this.errorCaptures.push(arguments[0]);
            return this;
        }
        if (Array.isArray(first)) {
            this.errorCaptures.push(new ArrayCapture(first));
            return this;
        }
    }
    push(...args) {
        this.args.push(...args);
        return this;
    }
}
//# sourceMappingURL=start-info.js.map