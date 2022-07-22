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
var _SystemError_stackLines;
export class SystemError extends Error {
    constructor(message, innerError) {
        super(message);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'SystemError'
        });
        Object.defineProperty(this, "innerError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // deno-lint-ignore no-explicit-any
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "link", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _SystemError_stackLines.set(this, void 0);
        this.innerError = innerError;
        this.data = new Map();
    }
    set(props) {
        for (const [key, value] of Object.entries(props)) {
            if (key === 'name' || key === 'stack') {
                continue;
            }
            if (Object.hasOwn(this, key)) {
                // @ts-ignore. between the Partial and Object.hasOwn, this is a valid property
                this[key] = value;
            }
        }
        return this;
    }
    set stack(value) {
        __classPrivateFieldSet(this, _SystemError_stackLines, undefined, "f");
        super.stack = value;
    }
    get stackTrace() {
        if (!__classPrivateFieldGet(this, _SystemError_stackLines, "f")) {
            if (this.stack) {
                __classPrivateFieldSet(this, _SystemError_stackLines, this.stack.split('\n').splice(0, 1), "f");
            }
            else {
                __classPrivateFieldSet(this, _SystemError_stackLines, [], "f");
            }
        }
        return __classPrivateFieldGet(this, _SystemError_stackLines, "f");
    }
    set stackTrace(value) {
        __classPrivateFieldSet(this, _SystemError_stackLines, value, "f");
        super.stack = value.join('\n');
    }
}
_SystemError_stackLines = new WeakMap();
/**
 * A decorator for hiding a function from the stack trace.
 *
 * @returns {(target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}}
 */
export function hideStack() {
    // deno-lint-ignore no-explicit-any
    return function (target, _propertyKey, descriptor) {
        const original = descriptor.value;
        if (typeof original === 'function') {
            descriptor.value = (...args) => {
                try {
                    return original.apply(target, args);
                }
                catch (e) {
                    if (e instanceof Error && e.stack) {
                        // first line of stack trace is the message, though could be multiple lines
                        // if the dev used '\n' in the error message.
                        // todo: figure out messages can exceed the first line.
                        const lines = e.stack.split('\n');
                        const start = lines.indexOf('    at ');
                        if (start > -1) {
                            e.stack = e.stack.split('\n').splice(start, 1).join('\n');
                        }
                    }
                    throw e;
                }
            };
        }
        return descriptor;
    };
}
export class ArgumentError extends SystemError {
    constructor(parameterName = null, message) {
        super(message || `Argument ${parameterName} is invalid.`);
        Object.defineProperty(this, "parameterName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
}
export class AssertionError extends SystemError {
    constructor(message) {
        super(message || 'Assertion failed.');
        this.name = 'AssertionError';
    }
}
export class PlatformNotSupportedError extends SystemError {
    constructor(message) {
        super(message || 'Platform is not supported.');
        this.name = 'PlatformNotSupportedError';
    }
}
export class ArgumentNullError extends ArgumentError {
    constructor(parameterName = null) {
        super(`Argument ${parameterName} must not be null or undefined.`);
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
    static validate(value, parameterName) {
        if (value === null || value === undefined) {
            throw new ArgumentNullError(parameterName);
        }
    }
}
export class TimeoutError extends SystemError {
    constructor(message) {
        super(message || 'Operation timed out.');
        this.name = 'TimeoutError';
    }
}
export class NotSupportedError extends SystemError {
    constructor(message) {
        super(message || 'Operation is not supported.');
        this.name = 'NotSupportedError';
    }
}
export class ObjectDisposedError extends SystemError {
    constructor(message, innerError) {
        super(message || 'Object has been disposed.', innerError);
        this.name = 'ObjectDisposedError';
    }
}
export class ArgumentEmptyError extends ArgumentError {
    constructor(parameterName = null) {
        super(`Argument ${parameterName} must not be null or empty.`);
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
}
export class ArgumentWhiteSpaceError extends ArgumentError {
    constructor(parameterName = null) {
        super(`Argument ${parameterName} must not be null, empty, or whitespace.`);
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
}
export class ArgumentRangeError extends ArgumentError {
    constructor(parameterName = null, message) {
        super(message || `Argument ${parameterName} is out of range.`);
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
}
export class NotImplementedError extends SystemError {
    constructor(message) {
        super(message || 'Not implemented');
        this.name = 'NotImplementedError';
    }
}
export class InvalidOperationError extends SystemError {
    constructor(message) {
        super(message || 'Invalid operation');
        this.name = 'InvalidOperationError';
    }
}
export class InvalidCastError extends SystemError {
    constructor(message) {
        super(message || 'Invalid cast');
        this.name = 'InvalidCastError';
    }
}
export class NullReferenceError extends SystemError {
    constructor(message) {
        super(message || 'Null or undefined reference');
        this.name = 'NullReferenceError';
    }
}
export class FormatError extends SystemError {
    constructor(message) {
        super(message || 'Format error');
        this.name = 'FormatError';
    }
}
//# sourceMappingURL=errors.js.map