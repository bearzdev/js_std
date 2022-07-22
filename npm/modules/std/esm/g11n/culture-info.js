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
var _CultureInfo_locale;
import * as dntShim from "../_dnt.shims.js";
let cc;
export class CultureInfo {
    constructor(locale) {
        _CultureInfo_locale.set(this, void 0);
        if (typeof locale === 'string') {
            __classPrivateFieldSet(this, _CultureInfo_locale, new Intl.Locale(locale), "f");
            return;
        }
        __classPrivateFieldSet(this, _CultureInfo_locale, locale, "f");
    }
    static get current() {
        return cc;
    }
    static set(culture) {
        cc = culture;
    }
    static get invariant() {
        return invariantCulture;
    }
    get displayName() {
        return __classPrivateFieldGet(this, _CultureInfo_locale, "f").baseName;
    }
    valueOf() {
        return __classPrivateFieldGet(this, _CultureInfo_locale, "f").toString();
    }
    toLocale() {
        return __classPrivateFieldGet(this, _CultureInfo_locale, "f");
    }
    toString() {
        return __classPrivateFieldGet(this, _CultureInfo_locale, "f").toString();
    }
}
_CultureInfo_locale = new WeakMap();
if (typeof dntShim.dntGlobalThis !== 'undefined' && typeof globalThis.navigator !== 'undefined' &&
    typeof globalThis.navigator.language !== 'undefined') {
    cc = new CultureInfo(globalThis.navigator.language);
}
else {
    const currentLocale = new Intl.NumberFormat().resolvedOptions().locale;
    cc = new CultureInfo(currentLocale);
}
export const invariantCulture = new CultureInfo('default');
export const currentCulture = CultureInfo.current;
//# sourceMappingURL=culture-info.js.map