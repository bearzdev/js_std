import { test } from '../testing/mod.js';
import { runtimeInfo } from './mod.js';

test('runtime: runtimeInfo exists', (assert) => {
    assert.hasValue(runtimeInfo);
    console.log(runtimeInfo.osVersion);
});
