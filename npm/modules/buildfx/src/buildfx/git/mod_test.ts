import { git } from "./mod.js"
import { test} from '../dev_deps.js';

test("git: version", (assert) => {
    const result = git("--version", { capture: true });
    assert.equal(0, result.exitCode);
    assert.hasValue(result.standardOut);
    assert.true(result.standardOut.length > 0);
})
