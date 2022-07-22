import { test} from '../testing/mod.js';
import { supportsColor } from './colors.js';

test("supportsColor", (assert) => {
    assert.hasValue(supportsColor);
    assert.false(supportsColor.stdout.off);
})