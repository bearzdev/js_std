export declare enum DecryptionTypes {
    "AES" = "AES",
    "DES" = "DES",
    "TripleDES" = "3DES"
}
export declare enum ValidationTypes {
    "HMACMD5" = "HMACMD5",
    "HMACSHA1" = "HMACSHA1",
    "HMACSHA256" = "HMACSHA256",
    "HMACSHA384" = "HMACSHA384",
    "HMACSHA512" = "HMACSHA512"
}
export declare function createMachineKey(decryptionType?: DecryptionTypes, validationType?: ValidationTypes): {
    decryptionKey: any;
    validationKey: any;
};
