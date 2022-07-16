import { assert as assert2, assertArrayIncludes, assertEquals, assertFalse, assertInstanceOf, assertMatch, assertNotEquals, assertNotMatch, assertNotStrictEquals, assertStrictEquals, assertStringIncludes, } from '../deps.js';
export class AssertionError extends Error {
    constructor(message, innerError) {
        super(message || 'Assertion failed');
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
        Object.defineProperty(this, "helpLink", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'AssertionError';
        this.data = {};
        this.innerError = innerError;
    }
}
export function ok(actual, message) {
    assert2(actual === true, message);
}
export function notOk(actual, message) {
    assertFalse(actual, message);
}
export function hasValue(actual, message) {
    assert2(actual !== undefined || actual !== null, message ||
        `Actual is ${typeof (actual)} and is expected to be not null or undefined.`);
}
export function hasNoValue(actual, message) {
    assert2(actual === undefined || actual === null, message ||
        `Actual is ${typeof (actual)} and is expected to be null or undefined.`);
}
export function truthy(actual, message) {
    assert2(actual, message);
}
export function falsy(actual, message) {
    assert2(!actual, message);
}
export function equal(actual, expected, message) {
    assertEquals(actual, expected, message);
}
export function notEqual(actual, expected, message) {
    assertNotEquals(actual, expected, message);
}
export function match(actual, expected, message) {
    assertMatch(actual, expected, message);
}
export function includes() {
    if (arguments.length < 2) {
        throw new Error('includes expects at least 2 arguments');
    }
    if (typeof (arguments[0]) === 'string' && typeof (arguments[1]) === 'string') {
        assertStringIncludes(arguments[0], arguments[1], arguments[2]);
        return;
    }
    assertArrayIncludes(arguments[0], arguments[1], arguments[2]);
}
export function notMatch(actual, expected, message) {
    assertNotMatch(actual, expected, message);
}
export function is(actual, expected, message) {
    assertStrictEquals(actual, expected, message);
}
export function not(actual, expected, message) {
    assertNotStrictEquals(actual, expected, message);
}
export function instanceOfType(actual, expected, message) {
    assertInstanceOf(actual, expected, message);
}
export function error(e, options, message) {
    if (!options) {
        options = {};
    }
    assertInstanceOf(e, Error, message);
    if (options.message) {
        assert2(e.message === options.message, message);
    }
    // deno-lint-ignore no-explicit-any
    const innerError = e.innerError;
    if (options.innerError && innerError) {
        assertInstanceOf(innerError, options.innerError, message);
    }
}
export function throws(fn, message) {
    try {
        fn();
        throw new AssertionError(message || 'Expected function to throw, but it didn\'t');
    }
    catch (e) {
        if (!(e instanceof Error)) {
            throw new AssertionError(message ||
                `Expected function to throw an error, but it threw a ${typeof (e) === 'object' ? e.prototype.constructor.name : typeof (e)}`);
        }
        return e;
    }
}
export async function throwsAsync(fn, message) {
    try {
        await fn();
        throw new AssertionError(message || 'Expected function to throw, but it didn\'t');
    }
    catch (e) {
        if (!(e instanceof Error)) {
            throw new AssertionError(message ||
                `Expected function to throw an error, but it threw a ${typeof (e) === 'object' ? e.prototype.constructor.name : typeof (e)}`);
        }
        return e;
    }
}
/**
 * @param expr {unknown}
 * @param message {(string|undefined)}
 */
export function exp(expr, message) {
    assert2(expr, message);
}
export class AssertContext {
    ok(actual, message) {
        assert2(actual === true, message);
    }
    true(actual, message) {
        assert2(actual === true, message);
    }
    false(actual, message) {
        assertFalse(actual, message);
    }
    hasValue(actual, message) {
        assert2(actual !== undefined || actual !== null, message ||
            `Actual is ${typeof (actual)} and is expected to be not null or undefined.`);
    }
    hasNoValue(actual, message) {
        assert2(actual === undefined || actual === null, message ||
            `Actual is ${typeof (actual)} and is expected to be null or undefined.`);
    }
    truthy(actual, message) {
        assert2(actual, message);
    }
    falsy(actual, message) {
        assert2(!actual, message);
    }
    equal(actual, expected, message) {
        assertEquals(actual, expected, message);
    }
    notEqual(actual, expected, message) {
        assertNotEquals(actual, expected, message);
    }
    match(actual, expected, message) {
        assertMatch(actual, expected, message);
    }
    includes() {
        if (arguments.length < 2) {
            throw new Error('includes expects at least 2 arguments');
        }
        if (typeof (arguments[0]) === 'string' && typeof (arguments[1]) === 'string') {
            assertStringIncludes(arguments[0], arguments[1], arguments[2]);
            return;
        }
        assertArrayIncludes(arguments[0], arguments[1], arguments[2]);
    }
    notMatch(actual, expected, message) {
        assertMatch(actual, expected, message);
    }
    is(actual, expected, message) {
        assertStrictEquals(actual, expected, message);
    }
    not(actual, expected, message) {
        assertNotStrictEquals(actual, expected, message);
    }
    instanceOfType(actual, expected, message) {
        assertInstanceOf(actual, expected, message);
    }
    error(e, options, message) {
        if (!options) {
            options = {};
        }
        assertInstanceOf(e, Error, message);
        if (options.message) {
            assert2(e.message === options.message, message);
        }
        // deno-lint-ignore no-explicit-any
        const innerError = e.innerError;
        if (options.innerError && innerError) {
            assertInstanceOf(innerError, options.innerError, message);
        }
    }
    throws(fn, message) {
        try {
            fn();
            throw new AssertionError(message || 'Expected function to throw, but it didn\'t');
        }
        catch (e) {
            if (!(e instanceof Error)) {
                throw new AssertionError(message ||
                    `Expected function to throw an error, but it threw a ${typeof (e) === 'object' ? e.prototype.constructor.name : typeof (e)}`);
            }
            return e;
        }
    }
    async throwsAsync(fn, message) {
        try {
            await fn();
            throw new AssertionError(message || 'Expected function to throw, but it didn\'t');
        }
        catch (e) {
            if (!(e instanceof Error)) {
                throw new AssertionError(message ||
                    `Expected function to throw an error, but it threw a ${typeof (e) === 'object' ? e.prototype.constructor.name : typeof (e)}`);
            }
            return e;
        }
    }
}
//# sourceMappingURL=asserts.js.map