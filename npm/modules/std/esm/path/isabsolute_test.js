// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
import * as dntShim from "../_dnt.test_shims.js";
import { assertEquals } from '../deps.js';
import * as path from './mod.js';
dntShim.Deno.test('isAbsolute', function () {
    assertEquals(path.posix.isAbsolute('/home/foo'), true);
    assertEquals(path.posix.isAbsolute('/home/foo/..'), true);
    assertEquals(path.posix.isAbsolute('bar/'), false);
    assertEquals(path.posix.isAbsolute('./baz'), false);
});
dntShim.Deno.test('isAbsoluteWin32', function () {
    assertEquals(path.win32.isAbsolute('/'), true);
    assertEquals(path.win32.isAbsolute('//'), true);
    assertEquals(path.win32.isAbsolute('//server'), true);
    assertEquals(path.win32.isAbsolute('//server/file'), true);
    assertEquals(path.win32.isAbsolute('\\\\server\\file'), true);
    assertEquals(path.win32.isAbsolute('\\\\server'), true);
    assertEquals(path.win32.isAbsolute('\\\\'), true);
    assertEquals(path.win32.isAbsolute('c'), false);
    assertEquals(path.win32.isAbsolute('c:'), false);
    assertEquals(path.win32.isAbsolute('c:\\'), true);
    assertEquals(path.win32.isAbsolute('c:/'), true);
    assertEquals(path.win32.isAbsolute('c://'), true);
    assertEquals(path.win32.isAbsolute('C:/Users/'), true);
    assertEquals(path.win32.isAbsolute('C:\\Users\\'), true);
    assertEquals(path.win32.isAbsolute('C:cwd/another'), false);
    assertEquals(path.win32.isAbsolute('C:cwd\\another'), false);
    assertEquals(path.win32.isAbsolute('directory/directory'), false);
    assertEquals(path.win32.isAbsolute('directory\\directory'), false);
});
//# sourceMappingURL=isabsolute_test.js.map