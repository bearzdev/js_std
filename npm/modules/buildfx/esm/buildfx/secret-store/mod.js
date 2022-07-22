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
var _SecretStore_store, _SecretStore_fileName;
import { secretGenerator, readJsonFile, writeJsonFile } from '../deps.js';
export class SecretStore {
    constructor(fileName, data) {
        _SecretStore_store.set(this, void 0);
        _SecretStore_fileName.set(this, void 0);
        __classPrivateFieldSet(this, _SecretStore_store, new Map(), "f");
        __classPrivateFieldSet(this, _SecretStore_fileName, fileName, "f");
        if (data) {
            Object.keys(data || {}).forEach(key => {
                const value = data[key];
                if (value)
                    __classPrivateFieldGet(this, _SecretStore_store, "f").set(key, value);
            });
        }
    }
    static loadFromFile(fileName) {
        const data = readJsonFile(fileName);
        if (!data) {
            return new SecretStore(fileName);
        }
        return new SecretStore(fileName, JSON.parse(data));
    }
    keys() {
        return __classPrivateFieldGet(this, _SecretStore_store, "f").keys();
    }
    has(key) {
        return __classPrivateFieldGet(this, _SecretStore_store, "f").has(key);
    }
    getOrCreate(key, length = 16) {
        key = key.toLowerCase();
        if (this.has(key)) {
            return this.get(key);
        }
        const next = secretGenerator.generate(length);
        this.set(key, next);
        return next;
    }
    get(key) {
        return this.getEntry(key)?.value;
    }
    getEntry(key) {
        // TODO: decrypt entry 
        key = key.toLowerCase();
        return __classPrivateFieldGet(this, _SecretStore_store, "f").get(key);
    }
    setEntry(key, data) {
        // TODO: encrypt secure store entry
        key = key.toLowerCase();
        let entry = this.getEntry(key) || {
            name: key,
            value: '',
            createdAt: new Date(),
            expiresAt: undefined,
            tags: {},
        };
        if (data.createdAt) {
            delete data['createdAt'];
        }
        entry = Object.assign(entry, data);
        __classPrivateFieldGet(this, _SecretStore_store, "f").set(key, entry);
    }
    set(key, value) {
        key = key.toLowerCase();
        this.setEntry(key, {
            value: value
        });
    }
    delete(key) {
        __classPrivateFieldGet(this, _SecretStore_store, "f").delete(key);
    }
    toObject() {
        const obj = {};
        __classPrivateFieldGet(this, _SecretStore_store, "f").forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
    toJson() {
        return JSON.stringify(this.toObject(), null, 4);
    }
    save() {
        writeJsonFile(__classPrivateFieldGet(this, _SecretStore_fileName, "f"), this.toObject());
    }
}
_SecretStore_store = new WeakMap(), _SecretStore_fileName = new WeakMap();
//# sourceMappingURL=mod.js.map