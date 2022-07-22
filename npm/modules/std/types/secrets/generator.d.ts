export declare function validate(data: Uint8Array): boolean;
export interface ISecretGenerator {
    setValidator(validator: (value: Uint8Array) => boolean): void;
    add(value: string): ISecretGenerator;
    generate(length: number): string;
    generateAsUint8Array(length: number): Uint8Array;
}
export default class SecretGenerator {
    #private;
    constructor();
    setValidator(validator: (value: Uint8Array) => boolean): void;
    addDefaults(): this;
    add(value: string): this;
    generateAsUint8Array(length: number): Uint8Array;
    generate(length: number): string;
}
export declare function generateSecret(length: number, characters?: string): string;
export declare const secretGenerator: SecretGenerator;
