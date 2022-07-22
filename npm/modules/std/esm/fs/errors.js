import { SystemError } from '../errors/errors.js';
export class FileSystemItemNotFoundError extends SystemError {
    constructor(path, message, innerError) {
        super(message || `File or directory not found for ${path}`, innerError);
        Object.defineProperty(this, "path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'FileSystemItemNotFoundError';
        this.path = path;
    }
}
export class DirectoryNotFoundError extends FileSystemItemNotFoundError {
    constructor(path, message, innerError) {
        super(path, message || `Directory not found for ${path}`, innerError);
        this.name = 'DirectoryNotFoundError';
    }
}
export class FileNotFoundError extends FileSystemItemNotFoundError {
    constructor(path, message, innerError) {
        super(path, message || `File not found for ${path}`, innerError);
        this.name = 'FileNotFoundError';
    }
}
//# sourceMappingURL=errors.js.map