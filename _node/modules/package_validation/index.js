import { runtimeInfo } from '@bearz/std/runtime';

console.log(runtimeInfo, runtimeInfo.version.toString());
console.log(`${runtimeInfo.name} ${runtimeInfo.version}`);