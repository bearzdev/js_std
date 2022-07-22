import { isWhiteSpaceAt } from '../primitives/char.js';
import { ArgumentEmptyError, ArgumentNullError, ArgumentWhiteSpaceError, InvalidOperationError, NullReferenceError, } from './errors.js';
export function notNull(value, parameterName) {
    if (value === null && value === undefined) {
        throw new ArgumentNullError(parameterName);
    }
}
export function notNullRef(value, expression) {
    if (value === null && value === undefined) {
        throw new NullReferenceError(`${expression} must not be null or undefined.`);
    }
}
export function notEmpty(value, parameterName) {
    if (value === null || value === undefined || value.length === 0) {
        throw new ArgumentEmptyError(parameterName);
    }
}
export function notNullOrWhiteSpace(value, parameterName) {
    if (value === null || value === undefined || value.length === 0) {
        throw new ArgumentEmptyError(parameterName);
    }
    for (let i = 0; i < value.length; i++) {
        if (!isWhiteSpaceAt(value, i)) {
            return;
        }
    }
    throw new ArgumentWhiteSpaceError(parameterName);
}
export function expression(expression, message) {
    if (!expression) {
        throw new InvalidOperationError(message);
    }
}
export const check = {
    expression,
    notNull,
    notEmpty,
    notNullOrWhiteSpace,
};
//# sourceMappingURL=check.js.map