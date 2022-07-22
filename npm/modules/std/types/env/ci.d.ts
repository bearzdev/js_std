export declare const ciMap: Map<string, {
    test: string | (() => boolean);
    name: string;
    supportsColor?: number | (() => number) | undefined;
}>;
export declare function isCi(): boolean;
export declare function getCiColorSupport(): number;
export declare function getCiName(): string | undefined;
