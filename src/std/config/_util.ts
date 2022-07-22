export const KeyDelimiter = ':';

export function join(iterable: Iterable<string>): string {
    const set = Array.isArray(iterable) ? iterable as Array<string> : Array.from(iterable);
    return set.join(KeyDelimiter);
}
