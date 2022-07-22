let cc: CultureInfo;

export class CultureInfo {
    #locale: Intl.Locale;

    constructor(locale: string | Intl.Locale) {
        if (typeof locale === 'string') {
            this.#locale = new Intl.Locale(locale);
            return;
        }

        this.#locale = locale;
    }

    static get current(): CultureInfo {
        return cc;
    }

    static set(culture: CultureInfo) {
        cc = culture;
    }

    static get invariant(): CultureInfo {
        return invariantCulture;
    }

    get displayName(): string {
        return this.#locale.baseName;
    }

    valueOf(): string {
        return this.#locale.toString();
    }

    toLocale(): Intl.Locale {
        return this.#locale;
    }

    toString(): string {
        return this.#locale.toString();
    }
}

if (
    typeof globalThis !== 'undefined' && typeof globalThis.navigator !== 'undefined' &&
    typeof globalThis.navigator.language !== 'undefined'
) {
    cc = new CultureInfo(globalThis.navigator.language);
} else {
    const currentLocale = new Intl.NumberFormat().resolvedOptions().locale;
    cc = new CultureInfo(currentLocale);
}

export const invariantCulture = new CultureInfo('default');
export const currentCulture = CultureInfo.current;
