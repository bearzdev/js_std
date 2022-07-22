// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
import * as dntShim from "../_dnt.test_shims.js";
import { assertEquals } from '../deps.js';
import * as path from './mod.js';
import { env } from '../env/mod.js';
const windowsTests = 
// arguments                               result
[
    [['c:/blah\\blah', 'd:/games', 'c:../a'], 'c:\\blah\\a'],
    [['c:/ignore', 'd:\\a/b\\c/d', '\\e.exe'], 'd:\\e.exe'],
    [['c:/ignore', 'c:/some/file'], 'c:\\some\\file'],
    [['d:/ignore', 'd:some/dir//'], 'd:\\ignore\\some\\dir'],
    [['//server/share', '..', 'relative\\'], '\\\\server\\share\\relative'],
    [['c:/', '//'], 'c:\\'],
    [['c:/', '//dir'], 'c:\\dir'],
    [['c:/', '//server/share'], '\\\\server\\share\\'],
    [['c:/', '//server//share'], '\\\\server\\share\\'],
    [['c:/', '///some//dir'], 'c:\\some\\dir'],
    [
        ['C:\\foo\\tmp.3\\', '..\\tmp.3\\cycles\\root.js'],
        'C:\\foo\\tmp.3\\cycles\\root.js',
    ],
];
const posixTests = 
// arguments                    result
[
    [['/var/lib', '../', 'file/'], '/var/file'],
    [['/var/lib', '/../', 'file/'], '/file'],
    [['a/b/c/', '../../..'], env.currentDirectory],
    [['.'], env.currentDirectory],
    [['/some/dir', '.', '/absolute/'], '/absolute'],
    [['/foo/tmp.3/', '../tmp.3/cycles/root.js'], '/foo/tmp.3/cycles/root.js'],
];
dntShim.Deno.test('resolve', function () {
    posixTests.forEach(function (p) {
        const _p = p[0];
        const actual = path.posix.resolve.apply(null, _p);
        assertEquals(actual, p[1]);
    });
});
dntShim.Deno.test('resolveWin32', function () {
    windowsTests.forEach(function (p) {
        const _p = p[0];
        const actual = path.win32.resolve.apply(null, _p);
        assertEquals(actual, p[1]);
    });
});
//# sourceMappingURL=resolve_test.js.map