/// <reference types="node" />
import { Deno } from "@deno/shim-deno-test";
export { Deno } from "@deno/shim-deno-test";
import { Blob } from "buffer";
export { Blob } from "buffer";
export { WeakRef, type WeakRefConstructor } from "@deno/sham-weakref";
export declare const dntGlobalThis: Omit<typeof globalThis, "Blob" | "WeakRef" | "Deno"> & {
    Deno: typeof Deno;
    Blob: typeof Blob;
    WeakRef: import("@deno/sham-weakref").WeakRefConstructor;
};
