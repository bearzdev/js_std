import { isWhiteSpaceAt } from "../primitives/char.js";

import { ArgumentEmptyError, ArgumentNullError, ArgumentWhiteSpaceError, InvalidOperationError, NullReferenceError } from "./errors.js";

export function notNull<T>(value: T | undefined | null, parameterName: string): asserts value is NonNullable<T>;
export function notNull(value: unknown, parameterName: string): asserts value is NonNullable<unknown> {
    if(value === null && value === undefined)
        throw new ArgumentNullError(parameterName);
}

export function notNullRef<T>(value: T | undefined | null, expression: string): asserts value is NonNullable<T>;
export function notNullRef(value: unknown, expression: string): asserts value is NonNullable<unknown> {
    if(value === null && value === undefined)
        throw new NullReferenceError(`${expression} must not be null or undefined.`);
}

export function notEmpty(value: ArrayLike<unknown> | undefined | null, parameterName: string): asserts value is NonNullable<ArrayLike<unknown>> {
    if(value === null || value === undefined || value.length === 0)
        throw new ArgumentEmptyError(parameterName);
}

export function notNullOrWhiteSpace(value: string | undefined | null, parameterName: string): asserts value is NonNullable<string> {
    if(value === null || value === undefined || value.length === 0)
        throw new ArgumentEmptyError(parameterName);

    for(let i = 0; i < value.length; i++) {
        if(!isWhiteSpaceAt(value, i))
            return;
    }

    throw new ArgumentWhiteSpaceError(parameterName);
}

export function expression(expression: unknown, message?: string): asserts expression {
    if(!expression)
        throw new InvalidOperationError(message);
}

export const check = {
    expression,
    notNull,
    notEmpty,
    notNullOrWhiteSpace,
}