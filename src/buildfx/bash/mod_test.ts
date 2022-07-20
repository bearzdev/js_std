import { bash } from './mod.ts';
import { test} from '../dev_deps.ts';
import { ProcessArgs } from "../../std/process/start-info.ts";


test("bash: invoke", (assert) => {
    const result = bash(['-c', "echo \"hello\""]);
    assert.equal(0, result.exitCode);
    assert.hasValue(result.standardOut);
    assert.equal(0, result.standardOut.length);
})

test("bash: invoke capture", (assert) => {
    const args = ProcessArgs.from("-c echo \"hello\"");
    console.log(args, args.length);
    const result = bash(['-c', "echo \"hello\""], { capture: true });
    assert.equal(0, result.exitCode);
    assert.equal("hello", result.standardOut.join(''));
})