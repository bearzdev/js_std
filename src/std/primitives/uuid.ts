import { ArgumentError, NotSupportedError } from "../errors/errors.ts";
import { IEquatableOf } from "./interfaces.ts";


export class Uuid implements IEquatableOf<Uuid>{
    readonly #value : string;

    constructor(value: string) 
    constructor() {
        if(arguments.length)
            throw new ArgumentError('Uuid constructor does not allow empty arguments.');

        const first = arguments[0];
        if(typeof first === 'string') {
            // TODO handle validation
            this.#value = first;
        }

        const type = typeof(first);
        throw new NotSupportedError(`Uuid constructor does not allow arguments of type ${type !== 'object' ? type : first.prototype.constructor.name  } .`);
    }

    equals(other: string) : boolean 
    equals(other: Uuid): boolean 
    equals(other: unknown) : boolean
    equals(): boolean {
        const first = arguments[0];
        if(typeof first === 'string') {
            return this.#value === first;
        } else if(first instanceof Uuid) {
            return this.#value === first.#value;
        }

        return false;
    }

    static get empty(): Uuid {
        return emptyUuid;
    }

    valueOf(): string {
        return this.#value;
    }

    public toString(): string {
        return this.#value;
    }
}

const emptyUuid = new Uuid('00000000-0000-0000-0000-000000000000')