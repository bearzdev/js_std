import type { CompareResult } from '../primitives/interfaces.ts';
export type CompareDelegate = (a: unknown, b: unknown) => number;
export type CompareDelegateOf<T> = (a: T, b: T) => number;
export type EqualityDelegate = (a: unknown, b: unknown) => boolean;
export type EqualityDelegateOf<T> = (a: T, b: T) => boolean;
export type KeyValuePair<TKey, TValue> = [TKey, TValue];

export interface IComparerOf<in T> {
    compare(a: T, b: T): CompareResult;
}

export interface IComparer {
    compare(a: unknown, b: unknown): CompareResult;
}

export interface IEqualityComparerOf<in T> {
    equals(a: T, b: T): boolean;
}

export interface IEqualityComparer {
    equals(a: unknown, b: unknown): boolean;
}

export interface IReadOnlyCollectionOf<T> extends Iterable<T> {
    readonly size: number;
}

export interface IReadOnlyListOf<T> extends IReadOnlyCollectionOf<T> {
    readonly item: { [index: number]: T };
}

export interface IReadOnlyDictionaryOf<TKey, TValue> extends IReadOnlyCollectionOf<KeyValuePair<TKey, TValue>> {
    keys() : Iterator<TKey>
    values() : Iterator<TValue>
    has(key: TKey): boolean;
    get(key: TKey): TValue | undefined;
    getOrThrow(key: TKey): TValue;
}

export interface ICollectionOf<T> extends Iterable<T> {
    readonly size: number;
    clear(): void;
    includes(item: T): boolean;
    add(item: T): void;
    delete(item: T): boolean;
    copyTo(array: T[], arrayIndex: number): void;
    toArray(): T[];
}

export interface IListOf<T> extends ICollectionOf<T> {
    item: { [index: number]: T };
    at(index: number) : T;
    insert(index: number, value: T) : void;
    deleteAt(index: number, value: T) : void;
    indexOf(item: T): number;
    lastIndexOf(item: T): number;
}

export interface IDictionary<TKey, TValue> extends ICollectionOf<KeyValuePair<TKey, TValue>> {
    keys() : Iterator<TKey>
    values() : Iterator<TValue>
    add(key: TKey, value: TValue): void;
    add(item: KeyValuePair<TKey, TValue>): void;
    tryAdd(key: TKey, value: TValue): boolean;
    has(key: TKey): boolean;
    delete(key: TKey): boolean;
    delete(item: KeyValuePair<TKey, TValue>): boolean;
    get(key: TKey): TValue | undefined;
    getOrThrow(key: TKey): TValue;
    set(key: TKey, value: TValue): this;
    set(item: KeyValuePair<TKey, TValue>): this;
    toArray(): KeyValuePair<TKey, TValue>[];
}