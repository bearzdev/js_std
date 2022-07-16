import { ArgumentEmptyError, ArgumentNullError, InvalidOperationError } from "./errors.ts";

export function notNull<T>(value: T | undefined | null, parameterName: string): NonNullable<T>
export function notNull(value: unknown, parameterName: string): NonNullable<unknown> {
    if(value === null && value === undefined)
        throw new ArgumentNullError(parameterName);

    return value;
}

export function notEmpty(value: ArrayLike<unknown> | undefined | null, parameterName: string): ArrayLike<unknown> {
    if(value === null || value === undefined || value.length === 0)
        throw new ArgumentEmptyError(parameterName);

    return value;
}

export function expression(value: unknown, message?: string): void {
    if(!value)
        throw new InvalidOperationError(message);
}

export const check = {
    expression,
    notNull,
    notEmpty
}