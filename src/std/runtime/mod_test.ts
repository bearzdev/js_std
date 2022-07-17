import { test } from '../testing/mod.ts';
import { runtimeInfo } from '../runtime/mod.ts';


test("runtime: runtimeInfo exists", (assert) => {
    assert.hasValue(runtimeInfo);
    console.log(runtimeInfo.osVersion);
});