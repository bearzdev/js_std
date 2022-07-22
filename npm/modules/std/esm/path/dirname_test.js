// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
import * as dntShim from "../_dnt.test_shims.js";
import { assertEquals } from "../deps.js";
import * as path from "./mod.js";
dntShim.Deno.test("dirname", function () {
    assertEquals(path.posix.dirname("/a/b/"), "/a");
    assertEquals(path.posix.dirname("/a/b"), "/a");
    assertEquals(path.posix.dirname("/a"), "/");
    assertEquals(path.posix.dirname(""), ".");
    assertEquals(path.posix.dirname("/"), "/");
    assertEquals(path.posix.dirname("////"), "/");
    assertEquals(path.posix.dirname("//a"), "//");
    assertEquals(path.posix.dirname("foo"), ".");
});
dntShim.Deno.test("dirnameWin32", function () {
    assertEquals(path.win32.dirname("c:\\"), "c:\\");
    assertEquals(path.win32.dirname("c:\\foo"), "c:\\");
    assertEquals(path.win32.dirname("c:\\foo\\"), "c:\\");
    assertEquals(path.win32.dirname("c:\\foo\\bar"), "c:\\foo");
    assertEquals(path.win32.dirname("c:\\foo\\bar\\"), "c:\\foo");
    assertEquals(path.win32.dirname("c:\\foo\\bar\\baz"), "c:\\foo\\bar");
    assertEquals(path.win32.dirname("\\"), "\\");
    assertEquals(path.win32.dirname("\\foo"), "\\");
    assertEquals(path.win32.dirname("\\foo\\"), "\\");
    assertEquals(path.win32.dirname("\\foo\\bar"), "\\foo");
    assertEquals(path.win32.dirname("\\foo\\bar\\"), "\\foo");
    assertEquals(path.win32.dirname("\\foo\\bar\\baz"), "\\foo\\bar");
    assertEquals(path.win32.dirname("c:"), "c:");
    assertEquals(path.win32.dirname("c:foo"), "c:");
    assertEquals(path.win32.dirname("c:foo\\"), "c:");
    assertEquals(path.win32.dirname("c:foo\\bar"), "c:foo");
    assertEquals(path.win32.dirname("c:foo\\bar\\"), "c:foo");
    assertEquals(path.win32.dirname("c:foo\\bar\\baz"), "c:foo\\bar");
    assertEquals(path.win32.dirname("file:stream"), ".");
    assertEquals(path.win32.dirname("dir\\file:stream"), "dir");
    assertEquals(path.win32.dirname("\\\\unc\\share"), "\\\\unc\\share");
    assertEquals(path.win32.dirname("\\\\unc\\share\\foo"), "\\\\unc\\share\\");
    assertEquals(path.win32.dirname("\\\\unc\\share\\foo\\"), "\\\\unc\\share\\");
    assertEquals(path.win32.dirname("\\\\unc\\share\\foo\\bar"), "\\\\unc\\share\\foo");
    assertEquals(path.win32.dirname("\\\\unc\\share\\foo\\bar\\"), "\\\\unc\\share\\foo");
    assertEquals(path.win32.dirname("\\\\unc\\share\\foo\\bar\\baz"), "\\\\unc\\share\\foo\\bar");
    assertEquals(path.win32.dirname("/a/b/"), "/a");
    assertEquals(path.win32.dirname("/a/b"), "/a");
    assertEquals(path.win32.dirname("/a"), "/");
    assertEquals(path.win32.dirname(""), ".");
    assertEquals(path.win32.dirname("/"), "/");
    assertEquals(path.win32.dirname("////"), "/");
    assertEquals(path.win32.dirname("foo"), ".");
});
//# sourceMappingURL=dirname_test.js.map