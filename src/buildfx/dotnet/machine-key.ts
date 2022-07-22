import { randomBytes, toHexString } from '../deps.ts';

export enum DecryptionTypes {
    'AES' = 'AES',
    'DES' = 'DES',
    'TripleDES' = '3DES',
}

export enum ValidationTypes {
    'HMACMD5' = 'HMACMD5',
    'HMACSHA1' = 'HMACSHA1',
    'HMACSHA256' = 'HMACSHA256',
    'HMACSHA384' = 'HMACSHA384',
    'HMACSHA512' = 'HMACSHA512',
}

export function createMachineKey(
    decryptionType: DecryptionTypes = DecryptionTypes.AES,
    validationType: ValidationTypes = ValidationTypes.HMACSHA256,
) {
    let decryptionKeySize = 0;
    let validationKeySize = 0;
    switch (decryptionType) {
        case DecryptionTypes.AES:
            decryptionKeySize = 32;
            break;

        case DecryptionTypes.DES:
            decryptionKeySize = 8;
            break;

        case DecryptionTypes.TripleDES:
            decryptionKeySize = 24;
            break;
    }

    switch (validationType) {
        case ValidationTypes.HMACMD5:
        case ValidationTypes.HMACSHA1:
        case ValidationTypes.HMACSHA256:
            validationKeySize = 64;
            break;

        case ValidationTypes.HMACSHA384:
        case ValidationTypes.HMACSHA512:
            validationKeySize = 128;
            break;
    }

    return {
        decryptionKey: toHexString(randomBytes(decryptionKeySize)),
        validationKey: toHexString(randomBytes(validationKeySize)),
    };
}
