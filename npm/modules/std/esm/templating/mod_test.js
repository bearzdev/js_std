import { test } from '../testing/mod.js';
import expandTemplate from './mod.js';
test('expandTemplate', (assert) => {
    const locals = {
        name: 'Deno',
        invoke: function (arg) {
            return arg + 1;
        },
    };
    let result = expandTemplate('Hello ${name}', locals);
    assert.equal('Hello Deno', result);
    result = expandTemplate('age ${ invoke(29) }', locals);
    assert.equal('age 30', result);
});
//# sourceMappingURL=mod_test.js.map