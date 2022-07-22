import "../../_dnt.polyfills.js";
import "../../_dnt.polyfills.js";
/** Encodes `src` into `src.length * 2` bytes. */
export declare function encode(src: Uint8Array): Uint8Array;
export declare function encodeToString(src: Uint8Array): string;
/**
 * Decodes `src` into `src.length / 2` bytes.
 * If the input is malformed, an error will be thrown.
 */
export declare function decode(src: Uint8Array): Uint8Array;
