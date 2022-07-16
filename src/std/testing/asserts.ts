import {
    assert as assert2,
    assertArrayIncludes,
    assertEquals,
    assertFalse,
    assertInstanceOf,
    assertMatch,
    assertNotEquals,
    assertNotMatch,
    assertNotStrictEquals,
    assertStrictEquals,
    assertStringIncludes,
} from '../deps.ts';

// deno-lint-ignore no-explicit-any
type AnyConstructor = new (...args: any[]) => any;

export class AssertionError extends Error {
    innerError: Error | undefined;
    // deno-lint-ignore no-explicit-any
    data: { [key: string]: any };

    helpLink?: string;

    constructor(message?: string, innerError?: Error) {
        super(message || 'Assertion failed');
        this.name = 'AssertionError';
        this.data = {};
        this.innerError = innerError;
    }
}

export function ok(actual: boolean, message?: string): void {
    assert2(actual === true, message);
}

export function notOk(actual: boolean, message?: string): void {
    assertFalse(actual, message);
}

export function hasValue(actual: unknown, message?: string): void {
    assert2(
        actual !== undefined || actual !== null,
        message ||
            `Actual is ${typeof (actual)} and is expected to be not null or undefined.`,
    );
}

export function hasNoValue(actual: unknown, message?: string): void {
    assert2(
        actual === undefined || actual === null,
        message ||
            `Actual is ${typeof (actual)} and is expected to be null or undefined.`,
    );
}

export function truthy(actual: unknown, message?: string): void {
    assert2(actual, message);
}

export function falsy(actual: unknown, message?: string): void {
    assert2(!actual, message);
}

export function equal<T>(actual: T, expected: T, message?: string): void {
    assertEquals(actual, expected, message);
}

export function notEqual<T>(actual: T, expected: T, message?: string): void {
    assertNotEquals(actual, expected, message);
}

export function match(
    actual: string,
    expected: RegExp,
    message?: string,
): void {
    assertMatch(actual, expected, message);
}

export function includes(
    actual: ArrayLike<unknown>,
    expected: ArrayLike<unknown>,
    message?: string,
): void;
export function includes(
    actual: string,
    expected: string,
    message?: string,
): void;
export function includes(): void {
    if (arguments.length < 2) {
        throw new Error('includes expects at least 2 arguments');
    }

    if (
        typeof (arguments[0]) === 'string' && typeof (arguments[1]) === 'string'
    ) {
        assertStringIncludes(arguments[0], arguments[1], arguments[2]);
        return;
    }

    assertArrayIncludes(arguments[0], arguments[1], arguments[2]);
}

export function notMatch(
    actual: string,
    expected: RegExp,
    message?: string,
): void {
    assertNotMatch(actual, expected, message);
}

export function is<T>(actual: T, expected: T, message?: string): void {
    assertStrictEquals(actual, expected, message);
}

export function not<T>(actual: T, expected: T, message?: string): void {
    assertNotStrictEquals(actual, expected, message);
}

export function instanceOfType(
    actual: unknown,
    expected: AnyConstructor,
    message?: string,
): void {
    assertInstanceOf(actual, expected, message);
}

export interface ErrorTestOptions {
    message?: string;
    type?: AnyConstructor;
    innerError?: AnyConstructor;
}

export function error(
    e: unknown,
    options?: ErrorTestOptions,
    message?: string,
): void {
    if (!options) {
        options = {};
    }

    assertInstanceOf(e, Error, message);

    if (options.message) {
        assert2(e.message === options.message, message);
    }

    // deno-lint-ignore no-explicit-any
    const innerError = (e as any).innerError;

    if (options.innerError && innerError) {
        assertInstanceOf(innerError, options.innerError, message);
    }
}

export function throws(fn: () => void, message?: string): Error {
    try {
        fn();
        throw new AssertionError(
            message || 'Expected function to throw, but it didn\'t',
        );
    } catch (e) {
        if (!(e instanceof Error)) {
            throw new AssertionError(
                message ||
                    `Expected function to throw an error, but it threw a ${
                        typeof (e) === 'object' ? e.prototype.constructor.name : typeof (e)
                    }`,
            );
        }

        return e;
    }
}

export async function throwsAsync(
    fn: () => Promise<void>,
    message?: string,
): Promise<Error> {
    try {
        await fn();
        throw new AssertionError(
            message || 'Expected function to throw, but it didn\'t',
        );
    } catch (e) {
        if (!(e instanceof Error)) {
            throw new AssertionError(
                message ||
                    `Expected function to throw an error, but it threw a ${
                        typeof (e) === 'object' ? e.prototype.constructor.name : typeof (e)
                    }`,
            );
        }

        return e;
    }
}

/**
 * @param expr {unknown}
 * @param message {(string|undefined)}
 */
export function exp(expr: unknown, message?: string): asserts expr {
    assert2(expr, message);
}

export class AssertContext {
    ok(actual: boolean, message?: string): void {
        assert2(actual === true, message);
    }

    true(actual: boolean, message?: string): void {
        assert2(actual === true, message);
    }

    false(actual: boolean, message?: string): void {
        assertFalse(actual, message);
    }
    
    /**
     * Asserts the actual value is not undefined or null.
     * @param actual 
     * @param message 
     */
    hasValue(actual: unknown, message?: string): void {
        assert2(
            actual !== undefined || actual !== null,
            message ||
                `Actual is ${typeof (actual)} and is expected to be not null or undefined.`,
        );
    }

    hasNoValue(actual: unknown, message?: string): void {
        assert2(
            actual === undefined || actual === null,
            message ||
                `Actual is ${typeof (actual)} and is expected to be null or undefined.`,
        );
    }

    truthy(actual: unknown, message?: string): void {
        assert2(actual, message);
    }

    falsy(actual: unknown, message?: string): void {
        assert2(!actual, message);
    }

    equal<T>(actual: T, expected: T, message?: string): void {
        assertEquals(actual, expected, message);
    }

    notEqual<T>(actual: T, expected: T, message?: string): void {
        assertNotEquals(actual, expected, message);
    }

    match(actual: string, expected: RegExp, message?: string): void {
        assertMatch(actual, expected, message);
    }

    includes(
        actual: ArrayLike<unknown>,
        expected: ArrayLike<unknown>,
        message?: string,
    ): void;
    includes(actual: string, expected: string, message?: string): void;
    includes(): void {
        if (arguments.length < 2) {
            throw new Error('includes expects at least 2 arguments');
        }

        if (
            typeof (arguments[0]) === 'string' && typeof (arguments[1]) === 'string'
        ) {
            assertStringIncludes(arguments[0], arguments[1], arguments[2]);
            return;
        }

        assertArrayIncludes(arguments[0], arguments[1], arguments[2]);
    }

    notMatch(actual: string, expected: RegExp, message?: string): void {
        assertMatch(actual, expected, message);
    }

    is<T>(actual: T, expected: T, message?: string): void {
        assertStrictEquals(actual, expected, message);
    }

    not<T>(actual: T, expected: T, message?: string): void {
        assertNotStrictEquals(actual, expected, message);
    }

    instanceOfType(
        actual: unknown,
        expected: AnyConstructor,
        message?: string,
    ): void {
        assertInstanceOf(actual, expected, message);
    }

    error(e: unknown, options?: ErrorTestOptions, message?: string): void {
        if (!options) {
            options = {};
        }

        assertInstanceOf(e, Error, message);

        if (options.message) {
            assert2(e.message === options.message, message);
        }

        // deno-lint-ignore no-explicit-any
        const innerError = (e as any).innerError;

        if (options.innerError && innerError) {
            assertInstanceOf(innerError, options.innerError, message);
        }
    }

    throws(fn: () => void, message?: string): Error {
        try {
            fn();
            throw new AssertionError(
                message || 'Expected function to throw, but it didn\'t',
            );
        } catch (e) {
            if (!(e instanceof Error)) {
                throw new AssertionError(
                    message ||
                        `Expected function to throw an error, but it threw a ${
                            typeof (e) === 'object' ? e.prototype.constructor.name : typeof (e)
                        }`,
                );
            }

            return e;
        }
    }

    async throwsAsync(fn: () => Promise<void>, message?: string): Promise<Error> {
        try {
            await fn();
            throw new AssertionError(
                message || 'Expected function to throw, but it didn\'t',
            );
        } catch (e) {
            if (!(e instanceof Error)) {
                throw new AssertionError(
                    message ||
                        `Expected function to throw an error, but it threw a ${
                            typeof (e) === 'object' ? e.prototype.constructor.name : typeof (e)
                        }`,
                );
            }

            return e;
        }
    }
}
