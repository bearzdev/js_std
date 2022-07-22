import { toHexString, randomBytes } from '../deps.js';
export var DecryptionTypes;
(function (DecryptionTypes) {
    DecryptionTypes["AES"] = "AES";
    DecryptionTypes["DES"] = "DES";
    DecryptionTypes["TripleDES"] = "3DES";
})(DecryptionTypes || (DecryptionTypes = {}));
export var ValidationTypes;
(function (ValidationTypes) {
    ValidationTypes["HMACMD5"] = "HMACMD5";
    ValidationTypes["HMACSHA1"] = "HMACSHA1";
    ValidationTypes["HMACSHA256"] = "HMACSHA256";
    ValidationTypes["HMACSHA384"] = "HMACSHA384";
    ValidationTypes["HMACSHA512"] = "HMACSHA512";
})(ValidationTypes || (ValidationTypes = {}));
export function createMachineKey(decryptionType = DecryptionTypes.AES, validationType = ValidationTypes.HMACSHA256) {
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
        validationKey: toHexString(randomBytes(validationKeySize))
    };
}
//# sourceMappingURL=machine-key.js.map