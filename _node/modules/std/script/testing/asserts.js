"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertContext = exports.exp = exports.throwsAsync = exports.throws = exports.error = exports.instanceOfType = exports.not = exports.is = exports.notMatch = exports.includes = exports.match = exports.notEqual = exports.equal = exports.falsy = exports.truthy = exports.hasNoValue = exports.hasValue = exports.notOk = exports.ok = exports.AssertionError = void 0;
const deps_js_1 = require("../deps.js");
class AssertionError extends Error {
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
exports.AssertionError = AssertionError;
function ok(actual, message) {
    (0, deps_js_1.assert)(actual === true, message);
}
exports.ok = ok;
function notOk(actual, message) {
    (0, deps_js_1.assertFalse)(actual, message);
}
exports.notOk = notOk;
function hasValue(actual, message) {
    (0, deps_js_1.assert)(actual !== undefined || actual !== null, message ||
        `Actual is ${typeof (actual)} and is expected to be not null or undefined.`);
}
exports.hasValue = hasValue;
function hasNoValue(actual, message) {
    (0, deps_js_1.assert)(actual === undefined || actual === null, message ||
        `Actual is ${typeof (actual)} and is expected to be null or undefined.`);
}
exports.hasNoValue = hasNoValue;
function truthy(actual, message) {
    (0, deps_js_1.assert)(actual, message);
}
exports.truthy = truthy;
function falsy(actual, message) {
    (0, deps_js_1.assert)(!actual, message);
}
exports.falsy = falsy;
function equal(actual, expected, message) {
    (0, deps_js_1.assertEquals)(actual, expected, message);
}
exports.equal = equal;
function notEqual(actual, expected, message) {
    (0, deps_js_1.assertNotEquals)(actual, expected, message);
}
exports.notEqual = notEqual;
function match(actual, expected, message) {
    (0, deps_js_1.assertMatch)(actual, expected, message);
}
exports.match = match;
function includes() {
    if (arguments.length < 2) {
        throw new Error('includes expects at least 2 arguments');
    }
    if (typeof (arguments[0]) === 'string' && typeof (arguments[1]) === 'string') {
        (0, deps_js_1.assertStringIncludes)(arguments[0], arguments[1], arguments[2]);
        return;
    }
    (0, deps_js_1.assertArrayIncludes)(arguments[0], arguments[1], arguments[2]);
}
exports.includes = includes;
function notMatch(actual, expected, message) {
    (0, deps_js_1.assertNotMatch)(actual, expected, message);
}
exports.notMatch = notMatch;
function is(actual, expected, message) {
    (0, deps_js_1.assertStrictEquals)(actual, expected, message);
}
exports.is = is;
function not(actual, expected, message) {
    (0, deps_js_1.assertNotStrictEquals)(actual, expected, message);
}
exports.not = not;
function instanceOfType(actual, expected, message) {
    (0, deps_js_1.assertInstanceOf)(actual, expected, message);
}
exports.instanceOfType = instanceOfType;
function error(e, options, message) {
    if (!options) {
        options = {};
    }
    (0, deps_js_1.assertInstanceOf)(e, Error, message);
    if (options.message) {
        (0, deps_js_1.assert)(e.message === options.message, message);
    }
    // deno-lint-ignore no-explicit-any
    const innerError = e.innerError;
    if (options.innerError && innerError) {
        (0, deps_js_1.assertInstanceOf)(innerError, options.innerError, message);
    }
}
exports.error = error;
function throws(fn, message) {
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
exports.throws = throws;
async function throwsAsync(fn, message) {
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
exports.throwsAsync = throwsAsync;
/**
 * @param expr {unknown}
 * @param message {(string|undefined)}
 */
function exp(expr, message) {
    (0, deps_js_1.assert)(expr, message);
}
exports.exp = exp;
class AssertContext {
    ok(actual, message) {
        (0, deps_js_1.assert)(actual === true, message);
    }
    true(actual, message) {
        (0, deps_js_1.assert)(actual === true, message);
    }
    false(actual, message) {
        (0, deps_js_1.assertFalse)(actual, message);
    }
    /**
     * Asserts the actual value is not undefined or null.
     *
     * @param actual the value to test.
     * @param message the failure message.
     */
    hasValue(actual, message) {
        (0, deps_js_1.assert)(actual !== undefined || actual !== null, message ||
            `Actual is ${typeof (actual)} and is expected to be not null or undefined.`);
    }
    hasNoValue(actual, message) {
        (0, deps_js_1.assert)(actual === undefined || actual === null, message ||
            `Actual is ${typeof (actual)} and is expected to be null or undefined.`);
    }
    truthy(actual, message) {
        (0, deps_js_1.assert)(actual, message);
    }
    falsy(actual, message) {
        (0, deps_js_1.assert)(!actual, message);
    }
    equal(actual, expected, message) {
        (0, deps_js_1.assertEquals)(actual, expected, message);
    }
    notEqual(actual, expected, message) {
        (0, deps_js_1.assertNotEquals)(actual, expected, message);
    }
    match(actual, expected, message) {
        (0, deps_js_1.assertMatch)(actual, expected, message);
    }
    includes() {
        if (arguments.length < 2) {
            throw new Error('includes expects at least 2 arguments');
        }
        if (typeof (arguments[0]) === 'string' && typeof (arguments[1]) === 'string') {
            (0, deps_js_1.assertStringIncludes)(arguments[0], arguments[1], arguments[2]);
            return;
        }
        (0, deps_js_1.assertArrayIncludes)(arguments[0], arguments[1], arguments[2]);
    }
    notMatch(actual, expected, message) {
        (0, deps_js_1.assertMatch)(actual, expected, message);
    }
    is(actual, expected, message) {
        (0, deps_js_1.assertStrictEquals)(actual, expected, message);
    }
    not(actual, expected, message) {
        (0, deps_js_1.assertNotStrictEquals)(actual, expected, message);
    }
    instanceOfType(actual, expected, message) {
        (0, deps_js_1.assertInstanceOf)(actual, expected, message);
    }
    error(e, options, message) {
        if (!options) {
            options = {};
        }
        (0, deps_js_1.assertInstanceOf)(e, Error, message);
        if (options.message) {
            (0, deps_js_1.assert)(e.message === options.message, message);
        }
        // deno-lint-ignore no-explicit-any
        const innerError = e.innerError;
        if (options.innerError && innerError) {
            (0, deps_js_1.assertInstanceOf)(innerError, options.innerError, message);
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
exports.AssertContext = AssertContext;
//# sourceMappingURL=asserts.js.map