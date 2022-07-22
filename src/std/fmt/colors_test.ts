import { test } from '../testing/mod.ts';
import { supportsColor } from './colors.ts';

test('supportsColor', (assert) => {
    assert.hasValue(supportsColor);
    assert.false(supportsColor.stdout.off);
});
