import { SystemError } from "../errors/errors.js";

export class FileSystemItemNotFoundError extends SystemError {
    path?: string;
    constructor(path?: string, message?: string, innerError?: Error) {
        super(message || `File or directory not found for ${path}`, innerError);
        this.name = "FileSystemItemNotFoundError";
        this.path = path;
    }
}

export class DirectoryNotFoundError extends FileSystemItemNotFoundError {
    
    constructor(path?: string, message?: string, innerError?: Error) {
        super(path, message || `Directory not found for ${path}`, innerError);
        this.name = "DirectoryNotFoundError";
    }
}

export class FileNotFoundError extends FileSystemItemNotFoundError {
    constructor(path?: string, message?: string, innerError?: Error) {
        super(path, message || `File not found for ${path}`, innerError);
        this.name = "FileNotFoundError";
    }
}