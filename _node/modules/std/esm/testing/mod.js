import * as dntShim from "../_dnt.test_shims.js";
import { AssertContext } from "./asserts.js";
export * from "./asserts.js";
// deno-lint-ignore no-explicit-any
export function test(name, fn) {
    dntShim.Deno.test(name, (t) => {
        const assert = new AssertContext();
        fn(assert, t);
    });
}
export function testWhen(predicate, name, fn) {
    if (typeof predicate === 'function') {
        predicate = predicate();
    }
    dntShim.Deno.test({
        ignore: predicate,
        name: name,
        fn: (t) => {
            const assert = new AssertContext();
            fn(assert, t);
        }
    });
}
//# sourceMappingURL=mod.js.map