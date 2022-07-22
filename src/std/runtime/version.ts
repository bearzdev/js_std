import type { IVersion } from './interfaces.ts';

export class Version implements IVersion {
    #major: number;
    #minor: number;
    #build: number;
    #revision: number;

    constructor(
        major: number,
        minor?: number,
        build?: number,
        revision?: number,
    ) {
        this.#major = major;
        this.#minor = minor || 0;
        this.#build = build || 0;
        this.#revision = revision || 0;
    }

    static parse(version: string): Version {
        const [major, minor, build, revision] = version.split('.').map(Number);
        return new Version(major, minor, build, revision);
    }

    equals(other: string): boolean;
    equals(other: Version): boolean;
    equals(): boolean {
        return this.compareTo(arguments[0]) === 0;
    }

    compareTo(other: string): number;
    compareTo(other: Version): number;
    compareTo(): number {
        if (arguments.length === 0) {
            throw new Error('compareTo expects at least 1 argument');
        }

        let other = arguments[0];

        if (Object.is(this, other)) {
            return 0;
        }

        if (typeof other === 'string') {
            try {
                other = Version.parse(other);
            } catch {
                const str = this.toString();
                if (str.length === other.length && str === other) {
                    return 0;
                }

                if (str.length > other.length || str > other) {
                    return 1;
                }

                return -1;
            }
        }

        if (this.#major !== other.#major) {
            return this.#major > other.#major ? 1 : -1;
        }

        if (this.#minor !== other.#minor) {
            return this.#minor > other.#minor ? 1 : -1;
        }

        if (this.#build !== other.#build) {
            return this.#build > other.#build ? 1 : -1;
        }

        if (this.#revision !== other.#revision) {
            return this.#revision > other.#revision ? 1 : -1;
        }

        return 0;
    }

    get major(): number {
        return this.#major;
    }

    get minor(): number {
        return this.#minor;
    }

    get build(): number {
        return this.#build;
    }

    get revision(): number {
        return this.#revision;
    }

    toString() {
        return `${this.#major}.${this.#minor}.${this.#build}.${this.#revision}`;
    }
}
