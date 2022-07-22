import { fs } from './base.ts';
import { isDeno } from '../runtime/mod.ts';
import {
    ICopyOptions,
    ICreateDirectoryOptions,
    IDirectoryInfo,
    IFileInfo,
    IMoveOptions,
    IRemoveOptions,
    IWriteJsonOptions,
    IWriteOptions,
} from './interfaces.ts';
import * as denoFs from 'https://deno.land/std@$STD_VERSION/fs/mod.ts';

if (isDeno) {
    fs.copyDirectory = function (
        src: string,
        dest: string,
        options?: ICopyOptions,
    ): void {
        denoFs.copySync(src, dest, options);
    };

    fs.copyDirectoryAsync = function (
        src: string,
        dest: string,
        options?: ICopyOptions,
    ): Promise<void> {
        return denoFs.copy(src, dest, options);
    };

    fs.copyFile = function (src: string, dest: string): void {
        Deno.copyFileSync(src, dest);
    };

    fs.copyFileAsync = function (src: string, dest: string): Promise<void> {
        return Deno.copyFile(src, dest);
    };

    fs.createDirectory = function (
        path: string | URL,
        options?: ICreateDirectoryOptions,
    ): void {
        Deno.mkdirSync(path, options);
    };

    fs.createDirectoryAsync = function (
        path: string | URL,
        options?: ICreateDirectoryOptions,
    ): Promise<void> {
        return Deno.mkdir(path, options);
    };

    fs.exists = function (path: string | URL): boolean {
        try {
            Deno.statSync(path);
            // successful, file or directory must exist
            return true;
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                // file or directory does not exist
                return false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
    };

    fs.existsAsync = function (path: string | URL): Promise<boolean> {
        return Deno.stat(path).then(() => true).catch((error) => {
            if (error instanceof Deno.errors.NotFound) {
                // file or directory does not exist
                return false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        });
    };

    fs.isFile = function (path: string | URL): boolean {
        try {
            const stat = Deno.lstatSync(path);
            return stat.isFile;
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                // file or directory does not exist
                return false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
    };

    fs.isFileAsync = async function (path: string | URL): Promise<boolean> {
        try {
            const stat = await Deno.lstat(path);
            return stat.isDirectory;
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                // file or directory does not exist
                return false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
    };

    fs.isDirectory = function (path: string | URL): boolean {
        try {
            const stat = Deno.lstatSync(path);
            return stat.isDirectory;
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                // file or directory does not exist
                return false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
    };

    fs.isDirectoryAsync = async function (
        path: string | URL,
    ): Promise<boolean> {
        try {
            const stat = await Deno.lstat(path);
            return stat.isDirectory;
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                // file or directory does not exist
                return false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
    };

    fs.lstat = function (path: string | URL): IFileInfo {
        const stat = Deno.statSync(path);
        const name = path instanceof URL ? path.toString() : path;

        const fi: IFileInfo = {
            isFile: stat.isFile,
            isDirectory: stat.isDirectory,
            isSymlink: stat.isSymlink,
            size: stat.size,
            createdAt: stat.atime,
            changedAt: null,
            modifiedAt: stat.mtime,
            lastAccessedAt: stat.atime,
            mode: stat.mode,
            name: name,
            userId: stat.uid,
            groupId: stat.gid,
            deviceId: stat.dev,
        };

        return fi;
    };

    fs.lstatAsync = function (path: string | URL): Promise<IFileInfo> {
        return Deno.stat(path).then((stat) => {
            const name = path instanceof URL ? path.toString() : path;
            const fi: IFileInfo = {
                isFile: stat.isFile,
                isDirectory: stat.isDirectory,
                isSymlink: stat.isSymlink,
                size: stat.size,
                createdAt: stat.atime,
                changedAt: null,
                modifiedAt: stat.mtime,
                lastAccessedAt: stat.atime,
                mode: stat.mode,
                name: name,
                userId: stat.uid,
                groupId: stat.gid,
                deviceId: stat.dev,
            };

            return fi;
        });
    };

    fs.move = function (
        src: string,
        dest: string,
        options?: IMoveOptions,
    ): void {
        denoFs.moveSync(src, dest, options);
    };

    fs.moveAsync = function (
        src: string,
        dest: string,
        options?: IMoveOptions,
    ): Promise<void> {
        return denoFs.move(src, dest, options);
    };

    fs.readFile = function (path: string | URL): Uint8Array {
        return Deno.readFileSync(path);
    };

    fs.readFileAsync = function (path: string | URL): Promise<Uint8Array> {
        return Deno.readFile(path);
    };

    fs.readTextFile = function (path: string | URL): string {
        return Deno.readTextFileSync(path);
    };

    fs.readTextFileAsync = function (path: string | URL): Promise<string> {
        return Deno.readTextFile(path);
    };

    // deno-lint-ignore no-explicit-any
    fs.readJsonFile = function (path: string | URL): any {
        let text = Deno.readTextFileSync(path);
        text = text.replace(/^\ufeff/g, '');
        return JSON.parse(text);
    };

    // deno-lint-ignore no-explicit-any
    fs.readJsonFileAsync = function (path: string | URL): Promise<any> {
        return Deno.readTextFile(path).then((text) => {
            text = text.replace(/^\ufeff/g, '');
            return JSON.parse(text);
        });
    };

    fs.realPath = function (path: string | URL): string {
        return Deno.realPathSync(path);
    };

    fs.realPathAsync = function (path: string | URL): Promise<string> {
        return Deno.realPath(path);
    };

    fs.removeFile = function (path: string | URL): void {
        Deno.removeSync(path);
    };

    fs.removeFileAsync = function (path: string | URL): Promise<void> {
        return Deno.remove(path);
    };

    fs.removeDirectory = function (
        path: string | URL,
        options: IRemoveOptions,
    ): void {
        Deno.removeSync(path, options);
    };

    fs.removeDirectoryAsync = function (
        path: string | URL,
        options: IRemoveOptions,
    ): Promise<void> {
        return Deno.remove(path, options);
    };

    fs.readDirectory = function (path: string | URL): Iterable<IDirectoryInfo> {
         return Deno.readDirSync(path);
    };

    fs.readDirectoryAsync = function (
        path: string | URL,
    ): AsyncIterable<IDirectoryInfo> {
        return Deno.readDir(path);
    };

    fs.rename = function (src: string | URL, dest: string | URL): void {
        Deno.renameSync(src, dest);
    };

    fs.renameAsync = function (
        src: string | URL,
        dest: string | URL,
    ): Promise<void> {
        return Deno.rename(src, dest);
    };

    fs.stat = function (path: string | URL): IFileInfo {
        const stat = Deno.statSync(path);
        const name = path instanceof URL ? path.toString() : path;

        const fi: IFileInfo = {
            isFile: stat.isFile,
            isDirectory: stat.isDirectory,
            isSymlink: stat.isSymlink,
            size: stat.size,
            createdAt: stat.atime,
            changedAt: null,
            modifiedAt: stat.mtime,
            lastAccessedAt: stat.atime,
            mode: stat.mode,
            name: name,
            userId: stat.uid,
            groupId: stat.gid,
            deviceId: stat.dev,
        };

        return fi;
    };

    fs.statAsync = function (path: string | URL): Promise<IFileInfo> {
        return Deno.stat(path).then((stat) => {
            const name = path instanceof URL ? path.toString() : path;
            const fi: IFileInfo = {
                isFile: stat.isFile,
                isDirectory: stat.isDirectory,
                isSymlink: stat.isSymlink,
                size: stat.size,
                createdAt: stat.atime,
                changedAt: null,
                modifiedAt: stat.mtime,
                lastAccessedAt: stat.atime,
                mode: stat.mode,
                name: name,
                userId: stat.uid,
                groupId: stat.gid,
                deviceId: stat.dev,
            };

            return fi;
        });
    };

    fs.writeFile = function (
        path: string | URL,
        data: Uint8Array,
        options?: IWriteOptions,
    ): void {
        Deno.writeFileSync(path, data, options);
    };

    fs.writeFileAsync = function (
        path: string | URL,
        data: Uint8Array,
        options?: IWriteOptions,
    ): Promise<void> {
        return Deno.writeFile(path, data, options);
    };

    fs.writeTextFile = function (
        path: string | URL,
        data: string,
        options?: IWriteOptions,
    ): void {
        Deno.writeTextFileSync(path, data, options);
    };

    fs.writeTextFileAsync = function (
        path: string | URL,
        data: string,
        options?: IWriteOptions,
    ): Promise<void> {
        return Deno.writeTextFile(path, data, options);
    };

    fs.writeJsonFile = function (
        path: string | URL,
        // deno-lint-ignore no-explicit-any
        data: any,
        options?: IWriteJsonOptions,
    ): void {
        const text = JSON.stringify(data, null, options?.spaces ?? 4);
        Deno.writeTextFileSync(path, text, options);
    };
    fs.writeJsonFileAsync = function (
        path: string | URL,
        // deno-lint-ignore no-explicit-any
        data: any,
        options?: IWriteJsonOptions,
    ): Promise<void> {
        const text = JSON.stringify(data, null, options?.spaces ?? 4);
        return Deno.writeTextFile(path, text, options);
    };
}

export const {
    createDirectory,
    createDirectoryAsync,
    copyDirectory,
    copyDirectoryAsync,
    copyFile,
    copyFileAsync,
    exists,
    existsAsync,
    isDirectory,
    isDirectoryAsync,
    isFile,
    isFileAsync,

    lstat,
    lstatAsync,
    move,
    moveAsync,
    readDirectory,
    readDirectoryAsync,
    readFile,
    readFileAsync,
    readTextFile,
    readTextFileAsync,
    readJsonFile,
    readJsonFileAsync,
    realPath,
    realPathAsync,
    removeDirectory,
    removeDirectoryAsync,
    removeFile,
    removeFileAsync,
    rename,
    renameAsync,
    stat,
    statAsync,
    writeFile,
    writeFileAsync,
    writeTextFile,
    writeTextFileAsync,
    writeJsonFile,
    writeJsonFileAsync,
} = fs;
