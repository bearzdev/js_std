import { InvalidOperationError, NullReferenceError } from "../errors/errors.ts";
import { EqualityDelegateOf, IDictionary, KeyValuePair } from './interfaces.ts'


export class Dictionary<TKey, TValue> extends Map<TKey, TValue> implements IDictionary<TKey, TValue> 
{
    #comparer?: EqualityDelegateOf<TKey>

    constructor()
    {
        super(arguments);
    }


    setComparer(comparer: EqualityDelegateOf<TKey>): void {
        if(this.#comparer)
            throw new InvalidOperationError('Comparer already set');

        this.#comparer = comparer;
    }

    add(key: TKey,value: TValue): void;
    add(item: KeyValuePair<TKey,TValue>): void;
    add(): void {
        switch(arguments.length)
        {
            case 2:
                if(super.has(arguments[0]))
                    throw new Error('Key already exists');

                super.set(arguments[0],arguments[1]);
            break;

            case 1:
                {
                    const key = arguments[0].key;
                    if (super.has(key))
                        throw new Error('Key already exists');

                    super.set(key, arguments[0].value);
                }
            break;

            default:
                throw new Error('Invalid arguments');
        }
    }

    tryAdd(key: TKey,value: TValue): boolean {
        if(super.has(key))
            return false;

        super.set(key,value);
        return true;
    }


    delete(key: TKey): boolean;
    delete(item: KeyValuePair<TKey,TValue>): boolean;
    delete(): boolean {
        if(arguments.length === 1) {
            const key = arguments[0];
            if(typeof(key.name) !== 'undefined')
                return super.delete(key.name);

            return super.delete(key);
        }

        throw new Error('arguments length must be 1');
    }

    override get(key: TKey): TValue | undefined {
        if(this.#comparer) {
            // not ideal, but needed for now to enable case insensitive lookup
            for(const k of this.keys()) {
                if(this.#comparer(key, k))
                    return super.get(k);
            }

            return undefined;
        }

        super.get(key);
    }

    getOrThrow(key: TKey): TValue {
        const value = super.get(key);
        if(value ===  undefined)
            throw new NullReferenceError(`Key ${key} does not exist`);

        return value;
    }

    toArray(): KeyValuePair<TKey,TValue>[] {
        return Array.from(this.entries());
    }

    includes(item: KeyValuePair<TKey,TValue>): boolean {
        const [key, value] = item;
        const next = this.get(key);
        return next !== undefined && next === value;
    }

    copyTo(array: KeyValuePair<TKey,TValue>[],arrayIndex: number): void {
        array.splice(arrayIndex,0,...this.toArray());
    }

    set(key: TKey, value: TValue): this;
    set(item: KeyValuePair<TKey, TValue>): this;
    set(): this {
        switch(arguments.length)
        {
            case 2:
                return super.set(arguments[0],arguments[1]);

            case 1:
                {
                    const key = arguments[0].key;
                    const value = arguments[0].value;
                    if(key === undefined || value === undefined)
                            throw new Error('KeyValuePair must have key and value');

                    return super.set(key,value);
                }

            default:
                throw new Error(`arguments length must be 1 or 2`);
        }
    }
}