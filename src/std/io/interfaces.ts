import { Char } from "../primitives/char.ts";
import { IDisposable } from "../primitives/interfaces.ts";
import { SeekMode } from "./enums.ts";

export interface IWriter{
    write(buf: Uint8Array) : number;
}

export interface ITextWriter {
    write(str: string): number;
    writeLine(str: string): number;
}

export interface IAsyncTextWriter {
    writeLineAsync(str: string): Promise<number>;
    writeAsync(str: string): Promise<number>;
}

export interface IAsyncWriter {
    writeAsync(p: Uint8Array): Promise<number>;
}

export interface IAsyncReader {
    readAsync(p: Uint8Array): Promise<number | null>;
}

export interface IReader {
    read(buf: Uint8Array): number | null;
}

export interface ITextReader {
    readLine(): string | null;
    readToEnd(): string;
}

export interface IAsyncTextReader {
    readLineAsync(): Promise<string | null>;
    readToEndAsync(): Promise<string>;
}

export interface IHandle {
    /**
     * Represents the file handle, file descriptor, or socket handle for the current
     * object.
     */
    readonly handle: number;
}


export interface ISeeker {
    seek(offset: number, whence: SeekMode): number;
}

export interface ISeekerAsync {
   
    seekAsync(offset: number, whence: SeekMode): Promise<number>;
}

export interface IStreamWriter extends IWriter, IAsyncWriter, IDisposable {
    readonly supportsSync: boolean;
} 

export interface IStreamReader extends IReader, IAsyncReader, IDisposable {
    readonly supportsSync: boolean;
}

