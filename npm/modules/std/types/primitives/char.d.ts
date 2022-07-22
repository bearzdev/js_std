import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
export declare enum UnicodeCategory {
    UppercaseLetter = 0,
    LowercaseLetter = 1,
    TitlecaseLetter = 2,
    ModifierLetter = 3,
    OtherLetter = 4,
    NonSpacingMark = 5,
    SpacingCombiningMark = 6,
    EnclosingMark = 7,
    DecimalDigitNumber = 8,
    LetterNumber = 9,
    OtherNumber = 10,
    SpaceSeparator = 11,
    LineSeparator = 12,
    ParagraphSeparator = 13,
    Control = 14,
    Format = 15,
    Surrogate = 16,
    PrivateUse = 17,
    ConnectorPunctuation = 18,
    DashPunctuation = 19,
    OpenPunctuation = 20,
    ClosePunctuation = 21,
    InitialQuotePunctuation = 22,
    FinalQuotePunctuation = 23,
    OtherPunctuation = 24,
    MathSymbol = 25,
    CurrencySymbol = 26,
    ModifierSymbol = 27,
    OtherSymbol = 28,
    OtherNotAssigned = 29
}
/**
 * Represents a unicode character (code point). NOTE:
 * most of the static methods only support Latin1.
 */
export declare class Char {
    value: number;
    constructor(value: number);
    static MaxValue: number;
    static MinValue: number;
    [Symbol.toPrimitive](hint: string): string | number | bigint | boolean | null;
    static isLatin1CharAt(value: string, index: number): boolean;
    static isLatin1CodePoint(value: number): boolean;
    static isLatin1(value: Char): boolean;
    static isAsciiCharAt(value: string, index: number): boolean;
    static isAsciiCharCode(value: number): boolean;
    static isAsciiCodePoint(value: number): boolean;
    static isAscii(value: Char): boolean;
    static charAt(value: string, index: number): Char;
    static isLowerAt(value: string, index: number): boolean;
    static isLowerCharAt(value: string, index: number): boolean;
    static isLetterOrDigitCharAt(value: string, index: number): boolean;
    static isLetterOrDigitCodePoint(value: number): boolean;
    static isLetterOrDigit(value: Char): boolean;
    static isLetterCharAt(value: string, index: number): boolean;
    static isLetterCharCode(value: number): boolean;
    static isLetterCodePoint(value: number): boolean;
    static isLetter(value: Char): boolean;
    static isBetweenCodePoint(value: number, start: number, end: number): boolean;
    static isBetween(value: Char, start: Char, end: Char): boolean;
    static isDigitCharAt(value: string, index: number): boolean;
    static isDigitCodePoint(value: number): boolean;
    static isDigit(value: Char): boolean;
    static isLowerCodePoint(value: number): boolean;
    static isLower(value: Char): boolean;
    static isUpperCharAt(value: string, index: number): boolean;
    static isUpperCodePoint(value: number): boolean;
    static isUpper(value: Char): boolean;
    static isWhiteSpaceAt(value: string, index: number): boolean;
    static isWhiteSpaceCodePoint(value: number): boolean;
    static isWhiteSpace(value: Char): boolean;
    valueOf(): void;
    toString(): string;
}
export declare const isAscii: typeof Char.isAscii, isAsciiCharAt: typeof Char.isAsciiCharAt, isAsciiCharCode: typeof Char.isAsciiCharCode, isAsciiCodePoint: typeof Char.isAsciiCodePoint, isWhiteSpace: typeof Char.isWhiteSpace, isWhiteSpaceCodePoint: typeof Char.isWhiteSpaceCodePoint, isWhiteSpaceAt: typeof Char.isWhiteSpaceAt, isLetter: typeof Char.isLetter, isLetterCharAt: typeof Char.isLetterCharAt, isLetterCharCode: typeof Char.isLetterCharCode, isLetterCodePoint: typeof Char.isLetterCodePoint;
