import { testWhen } from "../dev_deps.js";
import { which } from "../deps.js";
import { dotnet } from "./mod.js";

testWhen(
    () => which("dotnet") !== undefined,  
    "dotnet: version", 
    (assert) => {
       
    const result = dotnet("--version", { capture: true});
    assert.equal(0, result.exitCode);
    assert.true(result.standardOut.length > 0);
})