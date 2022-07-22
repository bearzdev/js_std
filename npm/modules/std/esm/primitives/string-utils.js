import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
import { Char } from './char.js';
export const EMPTY = '';
export function trimEnd(str, chars = EMPTY) {
    let size = str.length;
    if (chars === EMPTY) {
        for (let i = str.length - 1; i >= 0; i--) {
            if (Char.isWhiteSpaceAt(str, i)) {
                size--;
            }
            else {
                break;
            }
        }
        if (size === str.length) {
            return str;
        }
        return str.substring(0, size);
    }
    if (chars.length === 1) {
        const c = chars.charCodeAt(0);
        for (let i = str.length - 1; i >= 0; i--) {
            if (chars.charCodeAt(0) === c) {
                size--;
            }
            else {
                break;
            }
        }
        if (size === str.length) {
            return str;
        }
        return str.substring(0, size);
    }
    let j = chars.length;
    const codes = toCharCodeArray(chars);
    for (let i = str.length - 1; i >= 0; i--) {
        j--;
        if (str.charCodeAt(i) === codes[j]) {
            if (j === 0) {
                j = chars.length;
                size = size - j;
            }
            continue;
        }
        else {
            break;
        }
    }
    if (size === str.length) {
        return str;
    }
    return str.substring(0, size);
}
export function toCharacterArray(str) {
    return str.split('');
}
export function toCharArray(str) {
    const set = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.codePointAt(i);
        if (code) {
            set.push(new Char(code));
        }
    }
    return set;
}
export function toCharCodeArray(str) {
    const set = [];
    for (let i = 0; i < str.length; i++) {
        set.push(str.charCodeAt(i));
    }
    return set;
}
export function toCodePointArray(str) {
    const set = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.codePointAt(i);
        if (code) {
            set.push(code);
        }
    }
    return set;
}
export function isNullOrWhiteSpace(str) {
    if (str === null || str === undefined) {
        return true;
    }
    for (let i = 0; i < str.length; i++) {
        if (!Char.isWhiteSpaceAt(str, i)) {
            return false;
        }
    }
    return true;
}
export function isNullOrEmpty(str) {
    if (str === null || str === undefined) {
        return true;
    }
    return str.length === 0;
}
//# sourceMappingURL=string-utils.js.map