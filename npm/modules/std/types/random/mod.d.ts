import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
declare let getRandomValues: <T extends ArrayBufferView | null>(array: T) => T;
declare let randomUUID: () => string;
declare const randomBytes: (length: number) => Uint8Array;
declare function randomFileName(): string;
export { randomBytes, getRandomValues, randomFileName, randomUUID, };
