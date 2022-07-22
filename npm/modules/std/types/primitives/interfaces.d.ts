export declare type AnyConstructor = new (...args: any[]) => any;
export declare type FormatDelegate = (format?: string, arg?: unknown, formatProvider?: unknown) => string;
export declare type FormatProviderDelegate = (type?: string | AnyConstructor) => FormatDelegate;
export declare type CloneDelegate = () => unknown;
export declare type CloneDelegateOf<out T> = <T>() => T;
export declare type EquatableDelegate = (other: unknown) => boolean;
export declare type EquatableDelegateOf<out T> = <T>(other: T) => boolean;
export declare type CompareResult = -1 | 0 | 1;
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
    equals(other: T): boolean;
}
export interface IFormatProvider {
    getFormat(formatType: string | AnyConstructor): unknown;
}
export interface ICustomFormatter {
    format(format?: string, arg?: any, formatProvider?: unknown): string;
}
export interface IFormattable {
    format(format?: string, formatProvider?: IFormatProvider): string;
}
export interface IServiceProvider {
    getService(serviceType: string | AnyConstructor): unknown | undefined;
}
export interface IProgressOf<T> {
    report(value: T): void;
}
