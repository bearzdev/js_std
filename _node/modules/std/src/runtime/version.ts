export class Version {
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
