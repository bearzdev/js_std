import { SystemError } from '../errors/errors.js';

export class NotFoundOnPathError extends SystemError {
    executable: string | undefined;
    constructor(executable?: string, message?: string, innerError?: Error) {
        super(message || `Executable ${executable} not found on PATH.`, innerError);
        this.name = 'NotFoundOnPathError';
        this.executable = executable;
    }
}

export class ProcessError extends SystemError {
    fileName: string | undefined;

    exitCode: number;

    constructor(fileName?: string, exitCode?: number, message?: string, innerError?: Error) {
        super(message || `An error with a child process ${fileName} occurred. exitCode: ${exitCode}`, innerError);
        this.name = 'ProcessError';
        this.exitCode = exitCode || 0;
        this.fileName = fileName;
    }
}
