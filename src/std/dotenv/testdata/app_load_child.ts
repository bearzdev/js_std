// test file for https://github.com/denoland/deno_std/issues/1957
// This file is imported from ./app_load_parent.ts
import { env } from '../../env/mod.ts';

console.log(env.get("GREETING"));
