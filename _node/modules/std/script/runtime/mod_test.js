"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mod_js_1 = require("../testing/mod.js");
const mod_js_2 = require("./mod.js");
(0, mod_js_1.test)("runtime: runtimeInfo exists", (assert) => {
    assert.hasValue(mod_js_2.runtimeInfo);
    console.log(mod_js_2.runtimeInfo.osVersion);
});
//# sourceMappingURL=mod_test.js.map