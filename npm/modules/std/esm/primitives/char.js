// TODO: implement unicode tables / unicode categories
import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
export var UnicodeCategory;
(function (UnicodeCategory) {
    UnicodeCategory[UnicodeCategory["UppercaseLetter"] = 0] = "UppercaseLetter";
    UnicodeCategory[UnicodeCategory["LowercaseLetter"] = 1] = "LowercaseLetter";
    UnicodeCategory[UnicodeCategory["TitlecaseLetter"] = 2] = "TitlecaseLetter";
    UnicodeCategory[UnicodeCategory["ModifierLetter"] = 3] = "ModifierLetter";
    UnicodeCategory[UnicodeCategory["OtherLetter"] = 4] = "OtherLetter";
    UnicodeCategory[UnicodeCategory["NonSpacingMark"] = 5] = "NonSpacingMark";
    UnicodeCategory[UnicodeCategory["SpacingCombiningMark"] = 6] = "SpacingCombiningMark";
    UnicodeCategory[UnicodeCategory["EnclosingMark"] = 7] = "EnclosingMark";
    UnicodeCategory[UnicodeCategory["DecimalDigitNumber"] = 8] = "DecimalDigitNumber";
    UnicodeCategory[UnicodeCategory["LetterNumber"] = 9] = "LetterNumber";
    UnicodeCategory[UnicodeCategory["OtherNumber"] = 10] = "OtherNumber";
    UnicodeCategory[UnicodeCategory["SpaceSeparator"] = 11] = "SpaceSeparator";
    UnicodeCategory[UnicodeCategory["LineSeparator"] = 12] = "LineSeparator";
    UnicodeCategory[UnicodeCategory["ParagraphSeparator"] = 13] = "ParagraphSeparator";
    UnicodeCategory[UnicodeCategory["Control"] = 14] = "Control";
    UnicodeCategory[UnicodeCategory["Format"] = 15] = "Format";
    UnicodeCategory[UnicodeCategory["Surrogate"] = 16] = "Surrogate";
    UnicodeCategory[UnicodeCategory["PrivateUse"] = 17] = "PrivateUse";
    UnicodeCategory[UnicodeCategory["ConnectorPunctuation"] = 18] = "ConnectorPunctuation";
    UnicodeCategory[UnicodeCategory["DashPunctuation"] = 19] = "DashPunctuation";
    UnicodeCategory[UnicodeCategory["OpenPunctuation"] = 20] = "OpenPunctuation";
    UnicodeCategory[UnicodeCategory["ClosePunctuation"] = 21] = "ClosePunctuation";
    UnicodeCategory[UnicodeCategory["InitialQuotePunctuation"] = 22] = "InitialQuotePunctuation";
    UnicodeCategory[UnicodeCategory["FinalQuotePunctuation"] = 23] = "FinalQuotePunctuation";
    UnicodeCategory[UnicodeCategory["OtherPunctuation"] = 24] = "OtherPunctuation";
    UnicodeCategory[UnicodeCategory["MathSymbol"] = 25] = "MathSymbol";
    UnicodeCategory[UnicodeCategory["CurrencySymbol"] = 26] = "CurrencySymbol";
    UnicodeCategory[UnicodeCategory["ModifierSymbol"] = 27] = "ModifierSymbol";
    UnicodeCategory[UnicodeCategory["OtherSymbol"] = 28] = "OtherSymbol";
    UnicodeCategory[UnicodeCategory["OtherNotAssigned"] = 29] = "OtherNotAssigned";
})(UnicodeCategory || (UnicodeCategory = {}));
// deno-fmt-ignore
const latin = [0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x8E, 0x8E, 0x8E, 0x8E, 0x8E, 0x0E, 0x0E,
    0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E,
    0x8B, 0x18, 0x18, 0x18, 0x1A, 0x18, 0x18, 0x18, 0x14, 0x15, 0x18, 0x19, 0x18, 0x13, 0x18, 0x18,
    0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x18, 0x18, 0x19, 0x19, 0x19, 0x18,
    0x18, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40,
    0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x14, 0x18, 0x15, 0x1B, 0x12,
    0x1B, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21,
    0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x14, 0x19, 0x15, 0x19, 0x0E,
    0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x8E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E,
    0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E,
    0x8B, 0x18, 0x1A, 0x1A, 0x1A, 0x1A, 0x1C, 0x18, 0x1B, 0x1C, 0x04, 0x16, 0x19, 0x0F, 0x1C, 0x1B,
    0x1C, 0x19, 0x0A, 0x0A, 0x1B, 0x21, 0x18, 0x18, 0x1B, 0x0A, 0x04, 0x17, 0x0A, 0x0A, 0x0A, 0x18,
    0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40,
    0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x19, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x21,
    0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21,
    0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x19, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21,]; // U+00F0..U+00FF]
const char = 'a'.codePointAt(0);
const latinLowerMask = 0x20;
const latinUpperMask = 0x40;
const whitespaceFlag = 0x80;
const latinZero = 48;
const latinNine = 57;
const latinMax = '\u00ff'.codePointAt(0);
const asciiMax = '\u007f'.codePointAt(0);
/**
 * Represents a unicode character (code point). NOTE:
 * most of the static methods only support Latin1.
 */
export class Char {
    constructor(value) {
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (!Number.isInteger(value)) {
            throw new Error('Invalid character value, value must be an integer');
        }
        this.value = value;
    }
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case 'string':
                return String.fromCharCode(this.value);
            case 'number':
                return this.value;
            case 'boolean':
                return this.value > Char.MinValue && this.value < Char.MaxValue;
            case 'bigint':
                return BigInt(this.value);
            default:
                return null;
        }
    }
    static isLatin1CharAt(value, index) {
        return value.codePointAt(index) < latinMax;
    }
    static isLatin1CodePoint(value) {
        return value < latinMax;
    }
    static isLatin1(value) {
        return value.value < latinMax;
    }
    static isAsciiCharAt(value, index) {
        return value.codePointAt(index) < asciiMax;
    }
    static isAsciiCharCode(value) {
        return value < asciiMax;
    }
    static isAsciiCodePoint(value) {
        return value < asciiMax;
    }
    static isAscii(value) {
        return value.value < asciiMax;
    }
    static charAt(value, index) {
        return new Char(value.codePointAt(index));
    }
    static isLowerAt(value, index) {
        const code = value.charCodeAt(index);
        return (code & latinLowerMask) != 0;
    }
    static isLowerCharAt(value, index) {
        const code = value.codePointAt(index);
        if (this.isLatin1CodePoint(code)) {
            return (code & latinLowerMask) != 0;
        }
        return value[index].toLowerCase() === value[index];
    }
    static isLetterOrDigitCharAt(value, index) {
        return Char.isLetterOrDigitCodePoint(value.codePointAt(index));
    }
    static isLetterOrDigitCodePoint(value) {
        return isLetterCodePoint(value) ||
            Char.isDigitCodePoint(value);
    }
    static isLetterOrDigit(value) {
        return Char.isLetterOrDigitCodePoint(value.value);
    }
    static isLetterCharAt(value, index) {
        return Char.isLetterCodePoint(value.codePointAt(index));
    }
    static isLetterCharCode(value) {
        if (isAsciiCharCode(value)) {
            return (latin[value] & (latinUpperMask | latinLowerMask)) !== 0;
        }
        return false;
    }
    static isLetterCodePoint(value) {
        if (isAsciiCodePoint(value)) {
            // For the version of the Unicode standard the Char type is locked to, the
            // ASCII range doesn't include letters in categories other than "upper" and "lower".
            return (latin[value] & (latinUpperMask | latinLowerMask)) != 0;
        }
        return false;
    }
    static isLetter(value) {
        if (isAscii(value)) {
            // For the version of the Unicode standard the Char type is locked to, the
            // ASCII range doesn't include letters in categories other than "upper" and "lower".
            return (latin[value.value] & (latinUpperMask | latinLowerMask)) !=
                0;
        }
        return false;
    }
    static isBetweenCodePoint(value, start, end) {
        return value >= start && value <= end;
    }
    static isBetween(value, start, end) {
        return value.value >= start.value && value.value <= end.value;
    }
    static isDigitCharAt(value, index) {
        return this.isDigitCodePoint(value.codePointAt(index));
    }
    static isDigitCodePoint(value) {
        return value >= latinZero && value <= latinNine;
    }
    static isDigit(value) {
        return value.value > latinZero && value.value <= latinNine;
    }
    static isLowerCodePoint(value) {
        if (this.isLatin1CodePoint(value)) {
            const code = latin[char];
            return (code & latinLowerMask) != 0;
        }
        const str = String.fromCodePoint(value);
        return str === str.toLowerCase();
    }
    static isLower(value) {
        const char = value.value;
        if (this.isLatin1(value)) {
            const code = latin[char];
            return (code & latinLowerMask) != 0;
        }
        return String.fromCodePoint(char).toLowerCase() === value.toString();
    }
    static isUpperCharAt(value, index) {
        const code = value.codePointAt(index);
        if (this.isLatin1CodePoint(code)) {
            return (code & latinUpperMask) != 0;
        }
        return value[index].toLowerCase() === value[index];
    }
    static isUpperCodePoint(value) {
        if (this.isLatin1CodePoint(value)) {
            const code = latin[value];
            return (code & latinUpperMask) != 0;
        }
        const str = String.fromCodePoint(value);
        return str === str.toUpperCase();
    }
    static isUpper(value) {
        const char = value.value;
        if (this.isLatin1(value)) {
            const code = latin[char];
            return (code & latinUpperMask) != 0;
        }
        return String.fromCodePoint(char).toUpperCase() === value.toString();
    }
    static isWhiteSpaceAt(value, index) {
        return (latin[value.codePointAt(index)] & whitespaceFlag) !=
            0;
    }
    static isWhiteSpaceCodePoint(value) {
        return (latin[value] & whitespaceFlag) != 0;
    }
    static isWhiteSpace(value) {
        return (latin[value.value] & whitespaceFlag) != 0;
    }
    valueOf() {
        this.value;
    }
    toString() {
        return String.fromCharCode(this.value);
    }
}
// deno-lint-ignore no-inferrable-types
Object.defineProperty(Char, "MaxValue", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0xffff
});
// deno-lint-ignore no-inferrable-types
Object.defineProperty(Char, "MinValue", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0
});
export const { isAscii, isAsciiCharAt, isAsciiCharCode, isAsciiCodePoint, isWhiteSpace, isWhiteSpaceCodePoint, isWhiteSpaceAt, isLetter, isLetterCharAt, isLetterCharCode, isLetterCodePoint, } = Char;
//# sourceMappingURL=char.js.map