export declare class SystemError extends Error {
    #private;
    name: string;
    innerError?: Error;
    data: Map<string, any>;
    link?: string | URL;
    constructor(message: string, innerError?: Error);
    set(props: Partial<this>): this;
    set stack(value: string | undefined);
    get stackTrace(): string[];
    set stackTrace(value: string[]);
}
/**
 * A decorator for hiding a function from the stack trace.
 *
 * @returns {(target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}}
 */
export declare function hideStack(): (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare class ArgumentError extends SystemError {
    parameterName: string | null;
    constructor(parameterName?: string | null, message?: string);
}
export declare class AssertionError extends SystemError {
    constructor(message?: string);
}
export declare class PlatformNotSupportedError extends SystemError {
    constructor(message?: string);
}
export declare class ArgumentNullError extends ArgumentError {
    constructor(parameterName?: string | null);
    static validate(value: unknown, parameterName: string): void;
}
export declare class TimeoutError extends SystemError {
    constructor(message?: string);
}
export declare class NotSupportedError extends SystemError {
    constructor(message?: string);
}
export declare class ObjectDisposedError extends SystemError {
    constructor(message?: string, innerError?: Error);
}
export declare class ArgumentEmptyError extends ArgumentError {
    constructor(parameterName?: string | null);
}
export declare class ArgumentWhiteSpaceError extends ArgumentError {
    constructor(parameterName?: string | null);
}
export declare class ArgumentRangeError extends ArgumentError {
    constructor(parameterName?: string | null, message?: string);
}
export declare class NotImplementedError extends SystemError {
    constructor(message?: string);
}
export declare class InvalidOperationError extends SystemError {
    constructor(message?: string);
}
export declare class InvalidCastError extends SystemError {
    constructor(message?: string);
}
export declare class NullReferenceError extends SystemError {
    constructor(message?: string);
}
export declare class FormatError extends SystemError {
    constructor(message?: string);
}
