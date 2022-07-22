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
var _Uuid_value;
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { ArgumentError, NotSupportedError } from '../errors/errors.js';
export class Uuid {
    constructor() {
        _Uuid_value.set(this, void 0);
        if (arguments.length) {
            throw new ArgumentError('Uuid constructor does not allow empty arguments.');
        }
        const first = arguments[0];
        if (typeof first === 'string') {
            // TODO handle validation
            __classPrivateFieldSet(this, _Uuid_value, first, "f");
        }
        const type = typeof (first);
        throw new NotSupportedError(`Uuid constructor does not allow arguments of type ${type !== 'object' ? type : first.prototype.constructor.name} .`);
    }
    equals() {
        const first = arguments[0];
        if (typeof first === 'string') {
            return __classPrivateFieldGet(this, _Uuid_value, "f") === first;
        }
        else if (first instanceof Uuid) {
            return __classPrivateFieldGet(this, _Uuid_value, "f") === __classPrivateFieldGet(first, _Uuid_value, "f");
        }
        return false;
    }
    static get empty() {
        return emptyUuid;
    }
    valueOf() {
        return __classPrivateFieldGet(this, _Uuid_value, "f");
    }
    toString() {
        return __classPrivateFieldGet(this, _Uuid_value, "f");
    }
}
_Uuid_value = new WeakMap();
const emptyUuid = new Uuid('00000000-0000-0000-0000-000000000000');
//# sourceMappingURL=uuid.js.map