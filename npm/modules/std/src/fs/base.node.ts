import {
    ICopyOptions,
    ICreateDirectoryOptions,
    IDirectoryInfo,
    IFileInfo,
    IMoveOptions,
    IRemoveOptions,
    ISystemError,
    IWriteJsonOptions,
    IWriteOptions,
} from './interfaces.js';
import { fs } from './base.js';
import { basename, join } from '../path/mod.js';
import * as nodeFs from 'fs';
import { isNode } from '../runtime/mod.js';

if (isNode) {
    fs.createDirectory = function (
        path: string | URL,
        options?: ICreateDirectoryOptions,
    ): void {
        nodeFs.mkdirSync(path, options);
    };

    fs.createDirectoryAsync = function (
        path: string | URL,
        options?: ICreateDirectoryOptions,
    ): Promise<void> {
        return new Promise(function (resolve, reject) {
            nodeFs.mkdir(path, options, function (error) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };

    fs.copyDirectory = function (
        src: string,
        dest: string,
        options?: ICopyOptions,
    ): void {
        // Check if folder needs to be created or integrated
        const targetFolder = join(dest, basename(src));
        if (!fs.exists(targetFolder)) {
            fs.createDirectory(targetFolder, { recursive: true });
        } else if (options?.overwrite) {
            fs.removeDirectory(targetFolder, { recursive: true });
            fs.createDirectory(targetFolder, { recursive: true });
        }

        // Copy
        if (fs.lstat(src).isDirectory) {
            const files = fs.readDirectory(src);
            files.forEach(function (file) {
                const n = file.name;
                if (n === null) {
                    throw Error('File name is null');
                }

                const curSource = join(src, n);
                if (fs.lstat(curSource).isDirectory) {
                    fs.copyDirectory(curSource, targetFolder, options);
                } else {
                    fs.copyFile(curSource, targetFolder);
                }
            });
        }
    };

    fs.copyDirectoryAsync = function (
        src: string,
        dest: string,
        options?: ICopyOptions,
    ): Promise<void> {
        const targetFolder = join(dest, basename(src));

        return new Promise(function (resolve, reject) {
            try {
                if (!fs.exists(targetFolder)) {
                    fs.createDirectory(targetFolder, { recursive: true });
                } else if (options?.overwrite) {
                    fs.removeDirectory(targetFolder, { recursive: true });
                    fs.createDirectory(targetFolder, { recursive: true });
                }

                // Copy
                if (fs.lstat(src).isDirectory) {
                    const files = fs.readDirectory(src);
                    files.forEach(function (file) {
                        const n = file.name;
                        if (n === null) {
                            throw Error('File name is null');
                        }

                        const curSource = join(src, n);
                        if (fs.lstat(curSource).isDirectory) {
                            fs.copyDirectory(curSource, targetFolder, options);
                        } else {
                            fs.copyFile(curSource, targetFolder);
                        }
                    });
                }
                resolve();
            } catch (ex) {
                reject(ex);
            }
        });
    };

    fs.exists = function (path: string | URL): boolean {
        try {
            nodeFs.statSync(path);
            return true;
        } catch (ex) {
            const se = ex as ISystemError;
            if (se.code === 'ENOENT') {
                return false;
            }

            throw ex;
        }
    };

    fs.existsAsync = function (path: string | URL): Promise<boolean> {
        return new Promise(function (resolve, reject) {
            nodeFs.stat(path, function (err) {
                if (!err) {
                    resolve(true);
                    return;
                }

                const se = err as ISystemError;
                if (se.code === 'ENOENT') {
                    resolve(false);
                    return;
                }

                reject(err);
            });
        });
    };

    fs.isFile = function (path: string | URL): boolean {
        try {
            return nodeFs.lstatSync(path).isFile();
        } catch (err) {
            const se = err as ISystemError;
            if (se.code === 'ENOENT') {
                return false;
            }

            throw err;
        }
    };

    fs.isFileAsync = function (path: string | URL): Promise<boolean> {
        return new Promise(function (resolve, reject) {
            nodeFs.lstat(path, function (err, stat) {
                if (err) {
                    const se = err as ISystemError;
                    if (se.code === 'ENOENT') {
                        resolve(false);
                    }

                    reject(err);
                    return;
                }

                resolve(stat.isFile());
            });
        });
    };

    fs.isDirectory = function (path: string | URL): boolean {
        try {
            return nodeFs.lstatSync(path).isDirectory();
        } catch (err) {
            const se = err as ISystemError;
            if (se.code === 'ENOENT') {
                return false;
            }

            throw err;
        }
    };

    fs.isDirectoryAsync = function (path: string | URL): Promise<boolean> {
        return new Promise(function (resolve, reject) {
            nodeFs.lstat(path, function (err, stat) {
                if (err) {
                    const se = err as ISystemError;
                    if (se.code === 'ENOENT') {
                        resolve(false);
                    }

                    reject(err);
                    return;
                }

                resolve(stat.isDirectory());
            });
        });
    };

    fs.lstat = function (path: string | URL): IFileInfo {
        const stat = nodeFs.lstatSync(path);
        const name = path instanceof URL ? path.toString() : path;

        const fi: IFileInfo = {
            isFile: stat.isFile(),
            isDirectory: stat.isDirectory(),
            isSymlink: stat.isSymbolicLink(),
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
        return new Promise(function (resolve, reject) {
            nodeFs.stat(path, function (error, stat) {
                if (error) {
                    reject(error);
                    return;
                }
                const name = path instanceof URL ? path.toString() : path;

                const fi: IFileInfo = {
                    isFile: stat.isFile(),
                    isDirectory: stat.isDirectory(),
                    isSymlink: stat.isSymbolicLink(),
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

                resolve(fi);
            });
        });
    };

    fs.move = function (
        src: string,
        dest: string,
        options?: IMoveOptions,
    ): void {
        if (options?.overwrite) {
            if (this.exists(dest)) {
                this.removeDirectory(dest, { recursive: true });
            }
        }
        nodeFs.renameSync(src, dest);
    };

    fs.moveAsync = function (
        src: string,
        dest: string,
        options?: IMoveOptions,
    ): Promise<void> {
        if (options?.overwrite) {
            return this.existsAsync(dest).then((o) => {
                if (o) {
                    return this.removeDirectoryAsync(dest, { recursive: true });
                }

                return Promise.resolve();
            }).then(() => {
                return new Promise<void>(function (resolve, reject) {
                    nodeFs.rename(src, dest, function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve();
                    });
                });
            });
        }

        return new Promise<void>(function (resolve, reject) {
            nodeFs.rename(src, dest, function (error) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };

    fs.readDirectory = function (path: string | URL): IDirectoryInfo[] {
        return nodeFs.readdirSync(path, { withFileTypes: true }).map(
            (dirent) => {
                const di: IDirectoryInfo = {
                    isFile: dirent.isFile(),
                    name: dirent.name,
                    isDirectory: dirent.isDirectory(),
                    isSymlink: dirent.isSymbolicLink(),
                };

                return di;
            },
        );
    };

    fs.readDirectoryAsync = function (
        path: string | URL,
    ): Promise<IDirectoryInfo[]> {
        return new Promise(function (resolve, reject) {
            nodeFs.readdir(
                path,
                { withFileTypes: true },
                function (error, dirEntries) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(dirEntries.map((dirent) => {
                        const di: IDirectoryInfo = {
                            isFile: dirent.isFile(),
                            name: dirent.name,
                            isDirectory: dirent.isDirectory(),
                            isSymlink: dirent.isSymbolicLink(),
                        };

                        return di;
                    }));
                },
            );
        });
    };

    fs.readFile = function (path: string | URL): Uint8Array {
        return nodeFs.readFileSync(path);
    };

    fs.readFileAsync = function (path: string | URL): Promise<Uint8Array> {
        return new Promise(function (resolve, reject) {
            nodeFs.readFile(path, function (error, data) {
                if (error || !data) {
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });
    };

    // deno-lint-ignore no-explicit-any
    fs.readJsonFile = function (path: string | URL): any {
        let text = fs.readTextFile(path);
        text = text.replace(/^\ufeff/g, '');
        return JSON.parse(text);
    };

    // deno-lint-ignore no-explicit-any
    fs.readJsonFileAsync = function (path: string | URL): Promise<any> {
        return fs.readTextFileAsync(path).then((text) => {
            text = text.replace(/^\ufeff/g, '');
            return JSON.parse(text);
        });
    };

    fs.readTextFile = function (path: string | URL): string {
        return nodeFs.readFileSync(path, 'utf8');
    };

    fs.readTextFileAsync = function (path: string | URL): Promise<string> {
        return new Promise(function (resolve, reject) {
            nodeFs.readFile(path, 'utf8', function (error, data) {
                if (error || !data) {
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });
    };

    fs.removeDirectory = function (
        path: string | URL,
        options?: IRemoveOptions,
    ): void {
        nodeFs.rmdirSync(path, options);
    };

    fs.removeDirectoryAsync = function (
        path: string | URL,
        options?: IRemoveOptions,
    ): Promise<void> {
        return new Promise(function (resolve, reject) {
            nodeFs.rmdir(
                path,
                { recursive: options?.recursive },
                function (error) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                },
            );
        });
    };

    fs.removeFile = function (path: string | URL): void {
        nodeFs.unlinkSync(path);
    };

    fs.removeFileAsync = function (path: string | URL): Promise<void> {
        return new Promise(function (resolve, reject) {
            nodeFs.unlink(path, function (error) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };

    fs.rename = fs.move;
    fs.renameAsync = fs.moveAsync;

    fs.stat = function (path: string | URL): IFileInfo {
        const stat = nodeFs.statSync(path);
        const name = path instanceof URL ? path.toString() : path;

        const fi: IFileInfo = {
            isFile: stat.isFile(),
            isDirectory: stat.isDirectory(),
            isSymlink: stat.isSymbolicLink(),
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
        return new Promise(function (resolve, reject) {
            nodeFs.stat(path, function (error, stat) {
                if (error) {
                    reject(error);
                    return;
                }
                const name = path instanceof URL ? path.toString() : path;

                const fi: IFileInfo = {
                    isFile: stat.isFile(),
                    isDirectory: stat.isDirectory(),
                    isSymlink: stat.isSymbolicLink(),
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

                resolve(fi);
            });
        });
    };

    fs.writeFile = function (
        path: string | URL,
        data: Uint8Array,
        options?: IWriteOptions,
    ): void {
        if (!options) {
            nodeFs.writeFileSync(path, data);
            return;
        }
        let flags = 'w';
        if (options.append && options.create) {
            flags = 'a+';
        } else if (options.append) {
            flags = 'a';
        } else if (options.create === false) {
            flags = 'wx';
        }

        nodeFs.writeFileSync(path, data, {
            mode: options.mode,
            flag: flags,
            signal: options.signal,
        });
    };

    fs.writeFileAsync = function (
        path: string | URL,
        data: Uint8Array,
        options?: IWriteOptions,
    ): Promise<void> {
        return new Promise(function (resolve, reject) {
            if (!options) {
                nodeFs.writeFile(path, data, function (error) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
                return;
            }

            let flags = 'w';
            if (options.append && options.create) {
                flags = 'a+';
            } else if (options.append) {
                flags = 'a';
            } else if (options.create === false) {
                flags = 'wx';
            }

            nodeFs.writeFile(path, data, {
                mode: options.mode,
                flag: flags,
                signal: options.signal,
            }, function (error) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };

    fs.writeTextFile = function (
        path: string | URL,
        data: string,
        options?: IWriteOptions,
    ): void {
        if (!options) {
            nodeFs.writeFileSync(path, data, 'utf8');
            return;
        }
        let flags = 'w';
        if (options.append && options.create) {
            flags = 'a+';
        } else if (options.append) {
            flags = 'a';
        } else if (options.create === false) {
            flags = 'wx';
        }

        nodeFs.writeFileSync(path, data, {
            mode: options.mode,
            flag: flags,
            signal: options.signal,
            encoding: 'utf8',
        });
    };

    fs.writeTextFileAsync = function (
        path: string | URL,
        data: string,
        options?: IWriteOptions,
    ): Promise<void> {
        return new Promise(function (resolve, reject) {
            if (!options) {
                nodeFs.writeFile(path, data, function (error) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
                return;
            }

            let flags = 'w';
            if (options.append && options.create) {
                flags = 'a+';
            } else if (options.append) {
                flags = 'a';
            } else if (options.create === false) {
                flags = 'wx';
            }

            nodeFs.writeFile(path, data, {
                mode: options.mode,
                flag: flags,
                signal: options.signal,
                encoding: 'utf8',
            }, function (error) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };

    fs.writeJsonFile = function (
        path: string | URL,
        // deno-lint-ignore no-explicit-any
        data: any,
        options?: IWriteJsonOptions,
    ): void {
        const json = JSON.stringify(
            data,
            null,
            options ? options.spaces : undefined,
        );
        fs.writeTextFile(path, json, options);
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
