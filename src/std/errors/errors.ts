export class SystemError extends Error {
    override name = 'SystemError';
    innerError?: Error;
    // deno-lint-ignore no-explicit-any
    data: Map<string, any>;

    link?: string | URL;

    #stackLines?: string[];

    constructor(message: string, innerError?: Error) {
        super(message);

        this.innerError = innerError;
        this.data = new Map();
    }

    set stack(value: string | undefined) {
        this.#stackLines = undefined;
        super.stack = value;
    }

    get stackTrace(): string[] {
        if(!this.#stackLines) {
            if(this.stack) {
                this.#stackLines = this.stack.split('\n').splice(0, 1);
            } else {
                this.#stackLines = [];
            }
        }  

        return this.#stackLines;
    }

    set stackTrace(value: string[]) {
        this.#stackLines = value;
        super.stack = value.join('\n');
    }
}

/**
 * A decorator for hiding a function from the stack trace.
 * 
 * @returns {(target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}} 
 */
export function hideStack() {

    // deno-lint-ignore no-explicit-any
    return function(target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        if (typeof original === 'function') {
          descriptor.value = (...args: unknown[]) => {
            try {
                return original.apply(target, args);
            } catch (e) {
                if(e instanceof Error && e.stack) {
                    // first line of stack trace is the message, though could be multiple lines
                    // if the dev used '\n' in the error message.
                    // todo: figure out messages can exceed the first line.
                    const lines = e.stack.split('\n');
                    const start = lines.indexOf('    at ');
                    if(start > -1) {
                        e.stack = e.stack.split('\n').splice(start, 1).join('\n');
                    }
                }
                throw e;
            }
          }
        }
        return descriptor;
    }
}

export class ArgumentError extends SystemError {
    parameterName: string | null;

    constructor(parameterName: string | null = null, message?: string) {
        super(message || `Argument ${parameterName} is invalid.`);
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
}

export class AssertionError extends SystemError {
    constructor(message?: string) {
        super(message || 'Assertion failed.');
        this.name = 'AssertionError';
    }
}

export class PlatformNotSupportedError extends SystemError {
    constructor(message?: string) {
        super(message || 'Platform is not supported.');
        this.name = 'PlatformNotSupportedError';
    }
}

export class ArgumentNullError extends ArgumentError {
    constructor(parameterName: string | null = null) {
        super(`Argument ${parameterName} must not be null or undefined.`);
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }

    static validate(value: unknown, parameterName: string) {
        if (value === null || value === undefined) {
            throw new ArgumentNullError(parameterName);
        }
    }
}

export class TimeoutError extends SystemError {
    constructor(message?: string) {
        super(message || 'Operation timed out.');
        this.name = 'TimeoutError';
    }
}

export class NotSupportedError extends SystemError {
    constructor(message?: string) {
        super(message || 'Operation is not supported.');
        this.name = 'NotSupportedError';
    }
}

export class ArgumentEmptyError extends ArgumentError {
    constructor(parameterName: string | null = null) {
        super(`Argument ${parameterName} must not be null or empty.`);
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
}

export class ArgumentWhiteSpaceError extends ArgumentError {
    constructor(parameterName: string | null = null) {
        super(
            `Argument ${parameterName} must not be null, empty, or whitespace.`,
        );
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
}

export class ArgumentRangeError extends ArgumentError {
    constructor(parameterName: string | null = null, message?: string) {
        super(message || `Argument ${parameterName} is out of range.`);
        this.parameterName = parameterName;
        this.name = 'ArgumentError';
    }
}

export class NotImplementedError extends SystemError {
    constructor(message?: string) {
        super(message || 'Not implemented');
        this.name = 'NotImplementedError';
    }
}

export class InvalidOperationError extends SystemError {
    constructor(message?: string) {
        super(message || 'Invalid operation');
        this.name = 'InvalidOperationError';
    }
}

export class InvalidCastError extends SystemError {
    constructor(message?: string) {
        super(message || 'Invalid cast');
        this.name = 'InvalidCastError';
    }
}

export class NullReferenceError extends SystemError {
    constructor(message?: string) {
        super(message || 'Null or undefined reference');
        this.name = 'NullReferenceError';
    }
}

export class FormatError extends SystemError {
    constructor(message?: string) {
        super(message || 'Format error');
        this.name = 'FormatError';
    }
}
