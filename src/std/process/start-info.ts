import { splitArguments } from './split-arguments.ts';
import { StringBuilder } from '../text/string-builder.ts';
import { ArgumentError } from '../errors/errors.ts';

export class ProcessArgs extends Array<string> {
    constructor(...args: string[]) {
        super(...args);
    }

    append(value: string): ProcessArgs;
    append(...args: string[]): ProcessArgs;
    append(value: StringBuilder): ProcessArgs;
    append(value: ProcessArgs): ProcessArgs;
    append() {
        if (arguments.length === 1) {
            const first = arguments[0];
            if (typeof first === 'string') {
                return new ProcessArgs(...splitArguments(first));
            }

            if (first instanceof ProcessArgs) {
                return first;
            }

            if (first instanceof StringBuilder) {
                return new ProcessArgs(...splitArguments(first.toString()));
            }

            if (Array.isArray(first)) {
                const args = new ProcessArgs();
                args.push(...first);
                return args;
            }

            if (Object.prototype.toString.call(first) === '[object Object]') {
                const args = new ProcessArgs();
                Object.keys(first).forEach((key) => {
                    args.push(key);
                    args.push(first[key]);
                });

                return args;
            }

            throw new TypeError(`Cannot convert ${first} to ProcessArgs`);
        }

        throw new ArgumentError(
            `ProcessArgs.from() takes 1 argument, but got ${arguments.length}`,
        );
    }

    override push(...args: string[]) {
        const set: string[] = [];
        args.forEach((arg) => {
            const next = splitArguments(arg);
            set.push(...next);
        });

        return super.push(...set);
    }

    static from(value: string): ProcessArgs;
    static from(...args: string[]): ProcessArgs;
    static from(value: StringBuilder): ProcessArgs;
    static from(value: ProcessArgs): ProcessArgs;
    static from(): ProcessArgs {
        const args = new ProcessArgs();
        args.append(...arguments);
        return args;
    }
}