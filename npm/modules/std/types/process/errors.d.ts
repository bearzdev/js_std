import { SystemError } from '../errors/errors.js';
export declare class NotFoundOnPathError extends SystemError {
    executable: string | undefined;
    constructor(executable?: string, message?: string, innerError?: Error);
}
export declare class ProcessError extends SystemError {
    fileName: string | undefined;
    exitCode: number;
    constructor(fileName?: string, exitCode?: number, message?: string, innerError?: Error);
}
