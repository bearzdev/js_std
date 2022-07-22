// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
/**
 * Utilities for working with OS-specific file paths.
 *
 * This module is browser compatible.
 * @module
 */
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { globalScope, isDarwin, isDeno, isNode, isWindows } from '../runtime/mod.js';
export * from './separator.js';
import * as _win32 from './win32.js';
import * as _posix from './posix.js';
const path2 = isWindows ? _win32 : _posix;
export const win32 = _win32;
export const posix = _posix;
export function tmpDir() {
    if (isDeno) {
        if (isWindows) {
            return globalScope.Deno.env.get('TEMP') || globalScope.Deno.env.get('TMP') ||
                'C:\\ProgramData\\Temp';
        }
        if (isDarwin) {
            return globalScope.Deno.env.get('TMPDIR') || globalScope.Deno.env.get('TMP') ||
                '/private/tmp';
        }
        return globalScope.Deno.env.get('TMPDIR') || '/tmp';
    }
    if (isNode) {
        if (isWindows) {
            return globalScope.process.env['TEMP'] || globalScope.process.env['TMP'] ||
                'C:\\ProgramData\\Temp';
        }
        if (isDarwin) {
            return globalScope.process.env['TMPDIR'] || globalScope.process.env['TMP'] ||
                '/private/tmp';
        }
        return globalScope.process.env['TMPDIR'] || '/tmp';
    }
    return undefined;
}
export function filenameWithoutExtension(path) {
    const ext = path2.extname(path);
    let name = path2.basename(path);
    if (ext && ext.length > 0) {
        name = name.substring(0, name.length - ext.length);
    }
    return name;
}
export const filename = path2.basename;
export const { basename, delimiter, dirname, extname, format, fromFileUrl, isAbsolute, join, normalize, parse, relative, resolve, sep, toFileUrl, toNamespacedPath, } = path2;
export * from './common.js';
export { SEP, SEP_PATTERN } from './separator.js';
export * from './_interface.js';
export * from './glob.js';
//# sourceMappingURL=mod.js.map