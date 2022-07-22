var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SecretMasker_secrets, _SecretMasker_generators;
export default class SecretMasker {
    constructor() {
        _SecretMasker_secrets.set(this, void 0);
        _SecretMasker_generators.set(this, void 0);
        __classPrivateFieldSet(this, _SecretMasker_secrets, [], "f");
        __classPrivateFieldSet(this, _SecretMasker_generators, [], "f");
    }
    add(value) {
        if (!__classPrivateFieldGet(this, _SecretMasker_secrets, "f").includes(value)) {
            __classPrivateFieldGet(this, _SecretMasker_secrets, "f").push(value);
        }
        __classPrivateFieldGet(this, _SecretMasker_generators, "f").forEach((generator) => {
            const next = generator(value);
            if (!__classPrivateFieldGet(this, _SecretMasker_secrets, "f").includes(next)) {
                __classPrivateFieldGet(this, _SecretMasker_secrets, "f").push(next);
            }
        });
        return this;
    }
    addGenerator(generator) {
        __classPrivateFieldGet(this, _SecretMasker_generators, "f").push(generator);
        return this;
    }
    mask(value) {
        if (value === null) {
            return value;
        }
        let str = value;
        __classPrivateFieldGet(this, _SecretMasker_secrets, "f").forEach((next) => {
            const regex = new RegExp(`${next}`, 'gi');
            str = str.replace(regex, '*******');
        });
        return str;
    }
}
_SecretMasker_secrets = new WeakMap(), _SecretMasker_generators = new WeakMap();
export const secretMasker = new SecretMasker();
//# sourceMappingURL=masker.js.map