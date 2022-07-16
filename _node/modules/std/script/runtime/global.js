"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobal = exports.isDefined = exports.globalScope = void 0;
// deno-lint-ignore no-explicit-any
const dntShim = __importStar(require("../_dnt.shims.js"));
let g;
if (typeof dntShim.dntGlobalThis !== 'undefined') {
    g = dntShim.dntGlobalThis;
    // @ts-ignore - global may exist and typeof won't throw if undefined
}
else if (typeof global !== 'undefined') {
    // @ts-ignore - global may exist and typeof won't throw if undefined
    g = global;
}
else if (typeof self !== 'undefined') {
    // @ts-ignore - self may exist and typeof won't throw if undefined
    g = self;
}
else {
    g = new Function('return this')();
}
exports.globalScope = g;
function isDefined(...args) {
    const target = getGlobal(...args);
    return target !== undefined;
}
exports.isDefined = isDefined;
// deno-lint-ignore no-explicit-any
function getGlobal(...args) {
    let target = g;
    for (const arg of args) {
        if (typeof target[arg] === 'undefined' || target[arg] === 'null') {
            return undefined;
        }
        target = target[arg];
    }
    return target;
}
exports.getGlobal = getGlobal;
//# sourceMappingURL=global.js.map