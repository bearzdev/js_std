import { Blob } from "buffer";
export { Blob } from "buffer";
export { WeakRef, type WeakRefConstructor } from "@deno/sham-weakref";
export declare const dntGlobalThis: Omit<typeof globalThis, "Blob" | "WeakRef"> & {
    Blob: typeof Blob;
    WeakRef: import("@deno/sham-weakref").WeakRefConstructor;
};
