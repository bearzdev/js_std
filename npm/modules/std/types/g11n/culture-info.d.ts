export declare class CultureInfo {
    #private;
    constructor(locale: string | Intl.Locale);
    static get current(): CultureInfo;
    static set(culture: CultureInfo): void;
    static get invariant(): CultureInfo;
    get displayName(): string;
    valueOf(): string;
    toLocale(): Intl.Locale;
    toString(): string;
}
export declare const invariantCulture: CultureInfo;
export declare const currentCulture: CultureInfo;
