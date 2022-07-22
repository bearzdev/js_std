import * as dntShim from "../_dnt.test_shims.js";
import { AssertContext } from './asserts.js';
export * from './asserts.js';

/**
 * Register a test which will be run when `deno test` is used on the command line
 * and the containing module looks like a test module. fn can be async if required.
 *
 * @param {string} name the test name.
 * @param {(assert: AssertContext, t: any) => void | Promise<void>} fn The test case block.
 *
 * @example
 *
 * import { test } from 'https://deno.land/x/bearz_std@$BEARZ_VERSION/testing/mod.ts';
 *
 * test("demo: equals", (assert) => {
 *   assert.equal("hello", "hello");
 * });
 */
export function test(
    name: string,
    // deno-lint-ignore no-explicit-any
    fn: (assert: AssertContext, t: any) => void | Promise<void>,
): void {
    dntShim.Deno.test(name, (t) => {
        const assert = new AssertContext();
        fn(assert, t);
    });
}

/**
 * Registers a skippable test that may run when `deno test` is used on the command line
 * and the containing module looks like a test module. fn can be async if required.
 *
 * @param {string} name the test name.
 * @param {(assert: AssertContext, t: any) => void | Promise<void>} fn The test case block.
 * @remarks
 * This is useful for tests that may fail in some environments.
 * @example
 *
 * import { test } from 'https://deno.land/x/bearz_std@$BEARZ_VERSION/testing/mod.ts';
 *
 * test("demo: equals", (assert) => {
 *   assert.equal("hello", "hello");
 * });
 */
// deno-lint-ignore no-explicit-any
export function testWhen(
    predicate: boolean | (() => boolean),
    name: string,
    fn: (assert: AssertContext, t: any) => void | Promise<void>,
): void {
    if (typeof predicate === 'function') {
        predicate = predicate();
    }

    dntShim.Deno.test({
        ignore: !predicate,
        name: name,
        fn: (t) => {
            const assert = new AssertContext();
            fn(assert, t);
        },
    });
}
