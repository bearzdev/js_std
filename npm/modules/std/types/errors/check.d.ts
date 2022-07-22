export declare function notNull<T>(value: T | undefined | null, parameterName: string): asserts value is NonNullable<T>;
export declare function notNullRef<T>(value: T | undefined | null, expression: string): asserts value is NonNullable<T>;
export declare function notEmpty(value: ArrayLike<unknown> | undefined | null, parameterName: string): asserts value is NonNullable<ArrayLike<unknown>>;
export declare function notNullOrWhiteSpace(value: string | undefined | null, parameterName: string): asserts value is NonNullable<string>;
export declare function expression(expression: unknown, message?: string): asserts expression;
export declare const check: {
    expression: typeof expression;
    notNull: typeof notNull;
    notEmpty: typeof notEmpty;
    notNullOrWhiteSpace: typeof notNullOrWhiteSpace;
};
