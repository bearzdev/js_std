import { SystemError } from "../errors/errors.ts";

export class NotFoundOnPathError extends SystemError {
    executable: string | undefined;
    constructor(executable?: string, message?: string, innerError?: Error) {
        super(message || `Executable ${executable} not found on PATH.`, innerError);
        this.name = "NotFoundOnPathError";
        this.executable = executable;
    }
}