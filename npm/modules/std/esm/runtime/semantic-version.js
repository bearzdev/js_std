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
var _SemanticVersion_major, _SemanticVersion_minor, _SemanticVersion_patch, _SemanticVersion_prerelease, _SemanticVersion_build;
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
export class SemanticVersion {
    constructor(major, minor, patch, prerelease, build) {
        _SemanticVersion_major.set(this, void 0);
        _SemanticVersion_minor.set(this, void 0);
        _SemanticVersion_patch.set(this, void 0);
        _SemanticVersion_prerelease.set(this, void 0);
        _SemanticVersion_build.set(this, void 0);
        __classPrivateFieldSet(this, _SemanticVersion_major, major, "f");
        __classPrivateFieldSet(this, _SemanticVersion_minor, minor || 0, "f");
        __classPrivateFieldSet(this, _SemanticVersion_patch, patch || 0, "f");
        __classPrivateFieldSet(this, _SemanticVersion_prerelease, prerelease || '', "f");
        __classPrivateFieldSet(this, _SemanticVersion_build, build || '', "f");
    }
    get major() {
        return __classPrivateFieldGet(this, _SemanticVersion_major, "f");
    }
    get minor() {
        return __classPrivateFieldGet(this, _SemanticVersion_minor, "f");
    }
    get patch() {
        return __classPrivateFieldGet(this, _SemanticVersion_patch, "f");
    }
    get prerelease() {
        return __classPrivateFieldGet(this, _SemanticVersion_prerelease, "f");
    }
    get build() {
        return __classPrivateFieldGet(this, _SemanticVersion_build, "f");
    }
}
_SemanticVersion_major = new WeakMap(), _SemanticVersion_minor = new WeakMap(), _SemanticVersion_patch = new WeakMap(), _SemanticVersion_prerelease = new WeakMap(), _SemanticVersion_build = new WeakMap();
//# sourceMappingURL=semantic-version.js.map