// deno-lint-ignore-file no-unused-vars
import { NotImplementedError } from '../errors/errors.ts';
import type {
    ICopyOptions,
    ICreateDirectoryOptions,
    IDirectoryInfo,
    IFileInfo,
    IFileSystem,
    IMoveOptions,
    IRemoveOptions,
    IWriteJsonOptions,
    IWriteOptions,
} from './interfaces.ts';

export const fs: IFileSystem = {
    createDirectory(
        path: string | URL,
        options?: ICreateDirectoryOptions,
    ): void {
        throw new NotImplementedError();
    },

    createDirectoryAsync(
        path: string | URL,
        options?: ICreateDirectoryOptions,
    ): Promise<void> {
        throw new NotImplementedError();
    },

    copyDirectory: function (
        src: string,
        dest: string,
        options?: ICopyOptions,
    ): void {
        throw new NotImplementedError();
    },

    copyDirectoryAsync: function (
        src: string,
        dest: string,
        options?: ICopyOptions,
    ): Promise<void> {
        throw new NotImplementedError();
    },

    copyFile: function (src: string | URL, dest: string | URL): void {
        throw new NotImplementedError();
    },

    copyFileAsync: function (src: string, dest: string): Promise<void> {
        throw new NotImplementedError();
    },

    exists: function (path: string): boolean {
        throw new NotImplementedError();
    },

    existsAsync: function (path: string): Promise<boolean> {
        throw new NotImplementedError();
    },

    isFile: function (path: string): boolean {
        throw new NotImplementedError();
    },

    isFileAsync: function (path: string): Promise<boolean> {
        throw new NotImplementedError();
    },

    isDirectory: function (path: string): boolean {
        throw new NotImplementedError();
    },

    isDirectoryAsync: function (path: string): Promise<boolean> {
        throw new NotImplementedError();
    },

    lstat: function (path: string): IFileInfo {
        throw new NotImplementedError();
    },

    lstatAsync: function (path: string): Promise<IFileInfo> {
        throw new NotImplementedError();
    },

    move: function (src: string, dest: string, options?: IMoveOptions): void {
        throw new NotImplementedError();
    },

    moveAsync: function (src: string, dest: string): Promise<void> {
        throw new NotImplementedError();
    },

    readDirectory: function (path: string): Iterable<IDirectoryInfo> {
        throw new NotImplementedError();
    },

    readDirectoryAsync: function (
        path: string,
    ): AsyncIterable<IDirectoryInfo> {
        throw new NotImplementedError();
    },

    readFile: function (path: string): Uint8Array {
        throw new NotImplementedError();
    },

    readFileAsync: function (path: string): Promise<Uint8Array> {
        throw new NotImplementedError();
    },

    readTextFile: function (path: string): string {
        throw new NotImplementedError();
    },

    readTextFileAsync: function (path: string): Promise<string> {
        throw new NotImplementedError();
    },

    // deno-lint-ignore no-explicit-any
    readJsonFile: function (path: string): any {
        throw new NotImplementedError();
    },

    // deno-lint-ignore no-explicit-any
    readJsonFileAsync: function (path: string | URL): Promise<any> {
        throw new NotImplementedError();
    },

    realPath: function (path: string | URL): string {
        throw new NotImplementedError();
    },

    realPathAsync: function (path: string | URL): Promise<string> {
        throw new NotImplementedError();
    },

    removeFile: function (path: string): void {
        throw new NotImplementedError();
    },

    removeFileAsync: function (path: string): Promise<void> {
        throw new NotImplementedError();
    },

    removeDirectory: function (path: string): void {
        throw new NotImplementedError();
    },

    removeDirectoryAsync: function (path: string): Promise<void> {
        throw new NotImplementedError();
    },

    rename: function (src: string | URL, dest: string | URL): void {
        throw new NotImplementedError();
    },

    renameAsync: function (
        src: string | URL,
        dest: string | URL,
    ): Promise<void> {
        throw new NotImplementedError();
    },

    stat: function (path: string): IFileInfo {
        throw new NotImplementedError();
    },

    statAsync: function (path: string): Promise<IFileInfo> {
        throw new NotImplementedError();
    },

    writeFile: function (
        path: string,
        data: Uint8Array,
        options?: IWriteOptions,
    ): void {
        throw new NotImplementedError();
    },

    writeFileAsync: function (
        path: string,
        data: Uint8Array,
        options?: IWriteOptions,
    ): Promise<void> {
        throw new NotImplementedError();
    },

    writeTextFile: function (
        path: string,
        data: string,
        options?: IWriteOptions,
    ): void {
        throw new NotImplementedError();
    },

    writeTextFileAsync: function (
        path: string,
        data: string,
        options?: IWriteOptions,
    ): Promise<void> {
        throw new NotImplementedError();
    },

    writeJsonFile: function (
        path: string | URL,
        // deno-lint-ignore no-explicit-any
        data: any,
        options?: IWriteJsonOptions,
    ): void {
        throw new NotImplementedError();
    },

    writeJsonFileAsync: function (
        path: string | URL,
        // deno-lint-ignore no-explicit-any
        data: any,
        options?: IWriteJsonOptions,
    ): Promise<void> {
        throw new NotImplementedError();
    },
};
