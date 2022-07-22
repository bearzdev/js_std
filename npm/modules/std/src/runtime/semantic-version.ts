import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
export class SemanticVersion {
    #major: number;
    #minor: number;
    #patch: number;
    #prerelease: string;
    #build: string;

    constructor(
        major: number,
        minor?: number,
        patch?: number,
        prerelease?: string,
        build?: string,
    ) {
        this.#major = major;
        this.#minor = minor || 0;
        this.#patch = patch || 0;
        this.#prerelease = prerelease || '';
        this.#build = build || '';
    }

    get major(): number {
        return this.#major;
    }

    get minor(): number {
        return this.#minor;
    }

    get patch(): number {
        return this.#patch;
    }

    get prerelease(): string {
        return this.#prerelease;
    }

    get build(): string {
        return this.#build;
    }
}
