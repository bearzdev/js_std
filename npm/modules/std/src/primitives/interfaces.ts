
// deno-lint-ignore no-explicit-any
export type AnyConstructor = new (...args: any[]) => any;
export type FormatDelegate= (format?: string, arg?: unknown, formatProvider?: unknown) => string;
export type FormatProviderDelegate = (type?: string | AnyConstructor) => FormatDelegate;
export type CloneDelegate = () => unknown;
export type CloneDelegateOf<out T> = <T>() => T;
export type EquatableDelegate = (other: unknown) => boolean;
export type EquatableDelegateOf<out T> = <T>(other: T) => boolean;
export type CompareResult = -1 | 0 | 1;

export interface ICloneable {
    clone(): unknown;
}

export interface IDisposable {
    dispose(): void;
}

export interface ICloneableOf<T> {
    clone(): T;
}

export interface IEquatable {
    equals(other: unknown): boolean;
}

export interface IEquatableOf<T> {
    equals(other: T): boolean
}

export interface IFormatProvider {
    getFormat (formatType: string | AnyConstructor) : unknown;
}

export interface ICustomFormatter {
    // deno-lint-ignore no-explicit-any
    format(format?: string, arg?: any, formatProvider?: unknown): string;
}

export interface IFormattable {
    format(format?: string, formatProvider?: IFormatProvider): string;
}

export interface IServiceProvider {
    getService(serviceType: string | AnyConstructor) : unknown | undefined;
}

export interface IProgressOf<T> {
    report(value: T): void;
}


