import { ISecretMasker } from '../secrets/masker.js';
export declare const writeCommandOptions: {
    enabled: boolean;
    masker: ISecretMasker;
};
export declare function writeCommand(fileName: string, args: string[]): void;
