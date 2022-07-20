import { test } from '../testing/mod.ts';
import expandTemplate from './mod.ts';

test('expandTemplate', (assert) => {
    const locals = {
        name: 'Deno',
        invoke: function (arg: number) {
            return arg + 1;
        },
    };

    let result = expandTemplate('Hello ${name}', locals);
    assert.equal('Hello Deno', result);

    result = expandTemplate('age ${ invoke(29) }', locals);
    assert.equal('age 30', result);
});
