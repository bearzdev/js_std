import { testWhen } from '../dev_deps.ts';
import { which } from '../deps.ts';
import { dotnet } from './mod.ts';

testWhen(
    () => which('dotnet') !== undefined,
    'dotnet: version',
    (assert) => {
        const result = dotnet('--version', { capture: true });
        assert.equal(0, result.exitCode);
        assert.true(result.standardOut.length > 0);
    },
);
