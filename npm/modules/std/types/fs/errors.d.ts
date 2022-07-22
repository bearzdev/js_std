import { SystemError } from "../errors/errors.js";
export declare class FileSystemItemNotFoundError extends SystemError {
    path?: string;
    constructor(path?: string, message?: string, innerError?: Error);
}
export declare class DirectoryNotFoundError extends FileSystemItemNotFoundError {
    constructor(path?: string, message?: string, innerError?: Error);
}
export declare class FileNotFoundError extends FileSystemItemNotFoundError {
    constructor(path?: string, message?: string, innerError?: Error);
}
