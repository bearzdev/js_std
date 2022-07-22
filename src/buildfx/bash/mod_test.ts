import { bash, bashScript } from './mod.ts';
import { test } from '../dev_deps.ts';

test('bash: invoke', (assert) => {
    const result = bash(['-c', 'echo "hello"']);
    assert.equal(0, result.exitCode);
    assert.hasValue(result.standardOut);
    assert.equal(0, result.standardOut.length);
});

test('bash: invoke capture', (assert) => {
    const result = bash(`-c  'echo "Hello"'`, { capture: true });
    assert.equal(0, result.exitCode);
    assert.equal('Hello', result.standardOut.join(''));
});

test('baseScript: capture', (assert) => {
    const result = bashScript(`echo "Hello World"`, { capture: true });
    assert.equal(0, result.exitCode);
    assert.equal('Hello World', result.standardOut.join(''));
});
