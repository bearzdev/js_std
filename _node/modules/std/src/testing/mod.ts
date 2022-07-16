import * as dntShim from "../_dnt.test_shims.js";
import { AssertContext } from "./asserts.js";
export * from "./asserts.js";

// deno-lint-ignore no-explicit-any
export function test(name: string, fn: (assert: AssertContext, t: any) => void | Promise<void>): void {
  dntShim.Deno.test(name, (t) => {
    const assert = new AssertContext();
    fn(assert, t);
  });
}

export function testWhen(predicate: boolean | (() => boolean), name: string, fn: (assert: AssertContext, t: any) => void | Promise<void>): void {

    if(typeof predicate === 'function') {
        predicate = predicate();
    }

    dntShim.Deno.test({
        ignore: predicate,
        name: name,
        fn: (t) => {
            const assert = new AssertContext();
            fn(assert, t);
        }
    })
}