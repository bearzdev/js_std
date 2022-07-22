declare type AnyConstructor = new (...args: any[]) => any;
export declare class AssertionError extends Error {
    innerError: Error | undefined;
    data: {
        [key: string]: any;
    };
    helpLink?: string;
    constructor(message?: string, innerError?: Error);
}
export declare function ok(actual: boolean, message?: string): void;
export declare function notOk(actual: boolean, message?: string): void;
export declare function hasValue(actual: unknown, message?: string): void;
export declare function hasNoValue(actual: unknown, message?: string): void;
export declare function truthy(actual: unknown, message?: string): void;
export declare function falsy(actual: unknown, message?: string): void;
export declare function equal<T>(actual: T, expected: T, message?: string): void;
export declare function notEqual<T>(actual: T, expected: T, message?: string): void;
export declare function match(actual: string, expected: RegExp, message?: string): void;
export declare function includes(actual: ArrayLike<unknown>, expected: ArrayLike<unknown>, message?: string): void;
export declare function includes(actual: string, expected: string, message?: string): void;
export declare function notMatch(actual: string, expected: RegExp, message?: string): void;
export declare function is<T>(actual: T, expected: T, message?: string): void;
export declare function not<T>(actual: T, expected: T, message?: string): void;
export declare function instanceOfType(actual: unknown, expected: AnyConstructor, message?: string): void;
export interface ErrorTestOptions {
    message?: string;
    type?: AnyConstructor;
    innerError?: AnyConstructor;
}
export declare function error(e: unknown, options?: ErrorTestOptions, message?: string): void;
export declare function throws(fn: () => void, message?: string): Error;
export declare function throwsAsync(fn: () => Promise<void>, message?: string): Promise<Error>;
/**
 * @param expr {unknown}
 * @param message {(string|undefined)}
 */
export declare function exp(expr: unknown, message?: string): asserts expr;
export declare class AssertContext {
    ok(actual: boolean, message?: string): void;
    true(actual: boolean, message?: string): void;
    false(actual: boolean, message?: string): void;
    /**
     * Asserts the actual value is not undefined or null.
     *
     * @param actual the value to test.
     * @param message the failure message.
     */
    hasValue(actual: unknown, message?: string): void;
    hasNoValue(actual: unknown, message?: string): void;
    truthy(actual: unknown, message?: string): void;
    falsy(actual: unknown, message?: string): void;
    equal<T>(actual: T, expected: T, message?: string): void;
    notEqual<T>(actual: T, expected: T, message?: string): void;
    match(actual: string, expected: RegExp, message?: string): void;
    includes(actual: ArrayLike<unknown>, expected: ArrayLike<unknown>, message?: string): void;
    includes(actual: string, expected: string, message?: string): void;
    notMatch(actual: string, expected: RegExp, message?: string): void;
    is<T>(actual: T, expected: T, message?: string): void;
    not<T>(actual: T, expected: T, message?: string): void;
    instanceOfType(actual: unknown, expected: AnyConstructor, message?: string): void;
    error(e: unknown, options?: ErrorTestOptions, message?: string): void;
    throws(fn: () => void, message?: string): Error;
    throwsAsync(fn: () => Promise<void>, message?: string): Promise<Error>;
}
export {};
