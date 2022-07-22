import { readJsonFile, secretGenerator, writeJsonFile } from '../deps.ts';

export interface SecretStoreEntry {
    name: string;
    value: string;

    createdAt: Date;

    expiresAt: Date | undefined;

    tags: { [key: string]: string };
}

export class SecretStore {
    #store: Map<string, SecretStoreEntry>;
    #fileName: string;

    constructor(fileName: string, data?: { [key: string]: SecretStoreEntry }) {
        this.#store = new Map();
        this.#fileName = fileName;
        if (data) {
            Object.keys(data || {}).forEach((key) => {
                const value = data[key];
                if (value) {
                    this.#store.set(key, value);
                }
            });
        }
    }

    static loadFromFile(fileName: string): SecretStore {
        const data = readJsonFile(fileName);
        if (!data) {
            return new SecretStore(fileName);
        }

        return new SecretStore(fileName, JSON.parse(data));
    }

    keys(): Iterator<string> {
        return this.#store.keys();
    }

    has(key: string): boolean {
        return this.#store.has(key);
    }

    getOrCreate(key: string, length = 16): string {
        key = key.toLowerCase();
        if (this.has(key)) {
            return this.get(key)!;
        }

        const next = secretGenerator.generate(length);
        this.set(key, next);

        return next;
    }

    get(key: string): string | undefined {
        return this.getEntry(key)?.value;
    }

    getEntry(key: string): SecretStoreEntry | undefined {
        // TODO: decrypt entry
        key = key.toLowerCase();
        return this.#store.get(key);
    }

    setEntry(key: string, data: Partial<SecretStoreEntry>): void {
        // TODO: encrypt secure store entry

        key = key.toLowerCase();
        let entry: SecretStoreEntry = this.getEntry(key) || {
            name: key,
            value: '',
            createdAt: new Date(),
            expiresAt: undefined,
            tags: {},
        };
        if (data.createdAt) {
            delete data['createdAt'];
        }

        entry = Object.assign(entry, data);
        this.#store.set(key, entry);
    }

    set(key: string, value: string): void {
        key = key.toLowerCase();
        this.setEntry(key, {
            value: value,
        });
    }

    delete(key: string): void {
        this.#store.delete(key);
    }

    toObject(): { [key: string]: SecretStoreEntry } {
        const obj: { [key: string]: SecretStoreEntry } = {};
        this.#store.forEach((value, key) => {
            obj[key] = value;
        });

        return obj;
    }

    toJson(): string {
        return JSON.stringify(this.toObject(), null, 4);
    }

    save(): void {
        writeJsonFile(this.#fileName, this.toObject());
    }
}
