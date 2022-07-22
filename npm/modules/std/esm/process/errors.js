import { SystemError } from '../errors/errors.js';
export class NotFoundOnPathError extends SystemError {
    constructor(executable, message, innerError) {
        super(message || `Executable ${executable} not found on PATH.`, innerError);
        Object.defineProperty(this, "executable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'NotFoundOnPathError';
        this.executable = executable;
    }
}
export class ProcessError extends SystemError {
    constructor(fileName, exitCode, message, innerError) {
        super(message || `An error with a child process ${fileName} occurred. exitCode: ${exitCode}`, innerError);
        Object.defineProperty(this, "fileName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exitCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'ProcessError';
        this.exitCode = exitCode || 0;
        this.fileName = fileName;
    }
}
//# sourceMappingURL=errors.js.map