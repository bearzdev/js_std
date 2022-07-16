export declare class Version {
    #private;
    constructor(major: number, minor?: number, build?: number, revision?: number);
    static parse(version: string): Version;
    get major(): number;
    get minor(): number;
    get build(): number;
    get revision(): number;
    toString(): string;
}
