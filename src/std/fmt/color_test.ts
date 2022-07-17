import { test} from '../testing/mod.ts';
import { supportsColor } from './color.ts';

test("supportsColor", (assert) => {
    assert.hasValue(supportsColor);
    assert.false(supportsColor.stdout.off);
})