import { test } from '../testing/mod.ts';
import StringBuilder from './string-builder.ts';

test('ctor creates a new object', (assert) => {
    const sb = new StringBuilder();
    console.log(assert);
    assert.not(null, sb);
});

test('append can strings', (assert) => {
    const sb = new StringBuilder();
    sb.append('i').append('Haz').append('Cheeze');

    assert.equal(10, sb.length);
    assert.equal('iHaZCheese'.length, sb.toString().length);
    assert.equal('iHazCheeze', sb.toString());
});
