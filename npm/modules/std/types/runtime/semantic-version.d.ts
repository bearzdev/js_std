import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
export declare class SemanticVersion {
    #private;
    constructor(major: number, minor?: number, patch?: number, prerelease?: string, build?: string);
    get major(): number;
    get minor(): number;
    get patch(): number;
    get prerelease(): string;
    get build(): string;
}
