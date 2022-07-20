"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testWhen = exports.test = void 0;
const dntShim = __importStar(require("../_dnt.test_shims.js"));
const asserts_js_1 = require("./asserts.js");
__exportStar(require("./asserts.js"), exports);
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
function test(name, 
// deno-lint-ignore no-explicit-any
fn) {
    dntShim.Deno.test(name, (t) => {
        const assert = new asserts_js_1.AssertContext();
        fn(assert, t);
    });
}
exports.test = test;
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
function testWhen(predicate, name, fn) {
    if (typeof predicate === 'function') {
        predicate = predicate();
    }
    dntShim.Deno.test({
        ignore: predicate,
        name: name,
        fn: (t) => {
            const assert = new asserts_js_1.AssertContext();
            fn(assert, t);
        }
    });
}
exports.testWhen = testWhen;
//# sourceMappingURL=mod.js.map