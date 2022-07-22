export interface ISecretMasker {
    add(value: string): ISecretMasker;
    addGenerator(generator: (secret: string) => string): ISecretMasker;
    mask(value: string | null): string | null;
}
export default class SecretMasker {
    #private;
    constructor();
    add(value: string): ISecretMasker;
    addGenerator(generator: (secret: string) => string): ISecretMasker;
    mask(value: string | null): string | null;
}
export declare const secretMasker: SecretMasker;
