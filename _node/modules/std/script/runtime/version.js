"use strict";
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
var _Version_major, _Version_minor, _Version_build, _Version_revision;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
class Version {
    constructor(major, minor, build, revision) {
        _Version_major.set(this, void 0);
        _Version_minor.set(this, void 0);
        _Version_build.set(this, void 0);
        _Version_revision.set(this, void 0);
        __classPrivateFieldSet(this, _Version_major, major, "f");
        __classPrivateFieldSet(this, _Version_minor, minor || 0, "f");
        __classPrivateFieldSet(this, _Version_build, build || 0, "f");
        __classPrivateFieldSet(this, _Version_revision, revision || 0, "f");
    }
    static parse(version) {
        const [major, minor, build, revision] = version.split('.').map(Number);
        return new Version(major, minor, build, revision);
    }
    equals() {
        return this.compareTo(arguments[0]) === 0;
    }
    compareTo() {
        if (arguments.length === 0)
            throw new Error('compareTo expects at least 1 argument');
        let other = arguments[0];
        if (Object.is(this, other)) {
            return 0;
        }
        if (typeof other === 'string') {
            try {
                other = Version.parse(other);
            }
            catch {
                const str = this.toString();
                if (str.length === other.length && str === other) {
                    return 0;
                }
                if (str.length > other.length || str > other)
                    return 1;
                return -1;
            }
        }
        if (__classPrivateFieldGet(this, _Version_major, "f") !== __classPrivateFieldGet(other, _Version_major, "f"))
            return __classPrivateFieldGet(this, _Version_major, "f") > __classPrivateFieldGet(other, _Version_major, "f") ? 1 : -1;
        if (__classPrivateFieldGet(this, _Version_minor, "f") !== __classPrivateFieldGet(other, _Version_minor, "f"))
            return __classPrivateFieldGet(this, _Version_minor, "f") > __classPrivateFieldGet(other, _Version_minor, "f") ? 1 : -1;
        if (__classPrivateFieldGet(this, _Version_build, "f") !== __classPrivateFieldGet(other, _Version_build, "f"))
            return __classPrivateFieldGet(this, _Version_build, "f") > __classPrivateFieldGet(other, _Version_build, "f") ? 1 : -1;
        if (__classPrivateFieldGet(this, _Version_revision, "f") !== __classPrivateFieldGet(other, _Version_revision, "f"))
            return __classPrivateFieldGet(this, _Version_revision, "f") > __classPrivateFieldGet(other, _Version_revision, "f") ? 1 : -1;
        return 0;
    }
    get major() {
        return __classPrivateFieldGet(this, _Version_major, "f");
    }
    get minor() {
        return __classPrivateFieldGet(this, _Version_minor, "f");
    }
    get build() {
        return __classPrivateFieldGet(this, _Version_build, "f");
    }
    get revision() {
        return __classPrivateFieldGet(this, _Version_revision, "f");
    }
    toString() {
        return `${__classPrivateFieldGet(this, _Version_major, "f")}.${__classPrivateFieldGet(this, _Version_minor, "f")}.${__classPrivateFieldGet(this, _Version_build, "f")}.${__classPrivateFieldGet(this, _Version_revision, "f")}`;
    }
}
exports.Version = Version;
_Version_major = new WeakMap(), _Version_minor = new WeakMap(), _Version_build = new WeakMap(), _Version_revision = new WeakMap();
//# sourceMappingURL=version.js.map