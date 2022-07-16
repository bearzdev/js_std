"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dntGlobalThis = exports.WeakRef = exports.Blob = exports.Deno = void 0;
const shim_deno_test_1 = require("@deno/shim-deno-test");
var shim_deno_test_2 = require("@deno/shim-deno-test");
Object.defineProperty(exports, "Deno", { enumerable: true, get: function () { return shim_deno_test_2.Deno; } });
const buffer_1 = require("buffer");
var buffer_2 = require("buffer");
Object.defineProperty(exports, "Blob", { enumerable: true, get: function () { return buffer_2.Blob; } });
const sham_weakref_1 = require("@deno/sham-weakref");
var sham_weakref_2 = require("@deno/sham-weakref");
Object.defineProperty(exports, "WeakRef", { enumerable: true, get: function () { return sham_weakref_2.WeakRef; } });
const dntGlobals = {
    Deno: shim_deno_test_1.Deno,
    Blob: buffer_1.Blob,
    WeakRef: sham_weakref_1.WeakRef,
};
exports.dntGlobalThis = createMergeProxy(globalThis, dntGlobals);
// deno-lint-ignore ban-types
function createMergeProxy(baseObj, extObj) {
    return new Proxy(baseObj, {
        get(_target, prop, _receiver) {
            if (prop in extObj) {
                return extObj[prop];
            }
            else {
                return baseObj[prop];
            }
        },
        set(_target, prop, value) {
            if (prop in extObj) {
                delete extObj[prop];
            }
            baseObj[prop] = value;
            return true;
        },
        deleteProperty(_target, prop) {
            let success = false;
            if (prop in extObj) {
                delete extObj[prop];
                success = true;
            }
            if (prop in baseObj) {
                delete baseObj[prop];
                success = true;
            }
            return success;
        },
        ownKeys(_target) {
            const baseKeys = Reflect.ownKeys(baseObj);
            const extKeys = Reflect.ownKeys(extObj);
            const extKeysSet = new Set(extKeys);
            return [...baseKeys.filter((k) => !extKeysSet.has(k)), ...extKeys];
        },
        defineProperty(_target, prop, desc) {
            if (prop in extObj) {
                delete extObj[prop];
            }
            Reflect.defineProperty(baseObj, prop, desc);
            return true;
        },
        getOwnPropertyDescriptor(_target, prop) {
            if (prop in extObj) {
                return Reflect.getOwnPropertyDescriptor(extObj, prop);
            }
            else {
                return Reflect.getOwnPropertyDescriptor(baseObj, prop);
            }
        },
        has(_target, prop) {
            return prop in extObj || prop in baseObj;
        },
    });
}
//# sourceMappingURL=_dnt.test_shims.js.map