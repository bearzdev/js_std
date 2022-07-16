import { AssertContext } from "./asserts.js";
export * from "./asserts.js";
export declare function test(name: string, fn: (assert: AssertContext, t: any) => void | Promise<void>): void;
export declare function testWhen(predicate: boolean | (() => boolean), name: string, fn: (assert: AssertContext, t: any) => void | Promise<void>): void;
