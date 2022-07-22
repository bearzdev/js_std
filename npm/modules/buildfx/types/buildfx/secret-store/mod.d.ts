export interface SecretStoreEntry {
    name: string;
    value: string;
    createdAt: Date;
    expiresAt: Date | undefined;
    tags: {
        [key: string]: string;
    };
}
export declare class SecretStore {
    #private;
    constructor(fileName: string, data?: {
        [key: string]: SecretStoreEntry;
    });
    static loadFromFile(fileName: string): SecretStore;
    keys(): Iterator<string>;
    has(key: string): boolean;
    getOrCreate(key: string, length?: number): string;
    get(key: string): string | undefined;
    getEntry(key: string): SecretStoreEntry | undefined;
    setEntry(key: string, data: Partial<SecretStoreEntry>): void;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): {
        [key: string]: SecretStoreEntry;
    };
    toJson(): string;
    save(): void;
}
