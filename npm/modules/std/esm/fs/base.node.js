import { fs } from './base.js';
import { basename, join } from '../path/mod.js';
import * as nodeFs from 'fs';
import { isNode } from '../runtime/mod.js';
if (isNode) {
    fs.createDirectory = function (path, options) {
        nodeFs.mkdirSync(path, options);
    };
    fs.createDirectoryAsync = function (path, options) {
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
    fs.copyDirectory = function (src, dest, options) {
        // Check if folder needs to be created or integrated
        const targetFolder = join(dest, basename(src));
        if (!fs.exists(targetFolder)) {
            fs.createDirectory(targetFolder, { recursive: true });
        }
        else if (options?.overwrite) {
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
                }
                else {
                    fs.copyFile(curSource, targetFolder);
                }
            });
        }
    };
    fs.copyDirectoryAsync = function (src, dest, options) {
        const targetFolder = join(dest, basename(src));
        return new Promise(function (resolve, reject) {
            try {
                if (!fs.exists(targetFolder)) {
                    fs.createDirectory(targetFolder, { recursive: true });
                }
                else if (options?.overwrite) {
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
                        }
                        else {
                            fs.copyFile(curSource, targetFolder);
                        }
                    });
                }
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    fs.exists = function (path) {
        try {
            nodeFs.statSync(path);
            return true;
        }
        catch (ex) {
            const se = ex;
            if (se.code === 'ENOENT') {
                return false;
            }
            throw ex;
        }
    };
    fs.existsAsync = function (path) {
        return new Promise(function (resolve, reject) {
            nodeFs.stat(path, function (err) {
                if (!err) {
                    resolve(true);
                    return;
                }
                const se = err;
                if (se.code === 'ENOENT') {
                    resolve(false);
                    return;
                }
                reject(err);
            });
        });
    };
    fs.isFile = function (path) {
        try {
            return nodeFs.lstatSync(path).isFile();
        }
        catch (err) {
            const se = err;
            if (se.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
    };
    fs.isFileAsync = function (path) {
        return new Promise(function (resolve, reject) {
            nodeFs.lstat(path, function (err, stat) {
                if (err) {
                    const se = err;
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
    fs.isDirectory = function (path) {
        try {
            return nodeFs.lstatSync(path).isDirectory();
        }
        catch (err) {
            const se = err;
            if (se.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
    };
    fs.isDirectoryAsync = function (path) {
        return new Promise(function (resolve, reject) {
            nodeFs.lstat(path, function (err, stat) {
                if (err) {
                    const se = err;
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
    fs.lstat = function (path) {
        const stat = nodeFs.lstatSync(path);
        const name = path instanceof URL ? path.toString() : path;
        const fi = {
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
    fs.lstatAsync = function (path) {
        return new Promise(function (resolve, reject) {
            nodeFs.stat(path, function (error, stat) {
                if (error) {
                    reject(error);
                    return;
                }
                const name = path instanceof URL ? path.toString() : path;
                const fi = {
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
    fs.move = function (src, dest, options) {
        if (options?.overwrite) {
            if (this.exists(dest)) {
                this.removeDirectory(dest, { recursive: true });
            }
        }
        nodeFs.renameSync(src, dest);
    };
    fs.moveAsync = function (src, dest, options) {
        if (options?.overwrite) {
            return this.existsAsync(dest).then((o) => {
                if (o) {
                    return this.removeDirectoryAsync(dest, { recursive: true });
                }
                return Promise.resolve();
            }).then(() => {
                return new Promise(function (resolve, reject) {
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
        return new Promise(function (resolve, reject) {
            nodeFs.rename(src, dest, function (error) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };
    fs.readDirectory = function (path) {
        return nodeFs.readdirSync(path, { withFileTypes: true }).map((dirent) => {
            const di = {
                isFile: dirent.isFile(),
                name: dirent.name,
                isDirectory: dirent.isDirectory(),
                isSymlink: dirent.isSymbolicLink(),
            };
            return di;
        });
    };
    fs.readDirectoryAsync = function (path) {
        return new Promise(function (resolve, reject) {
            nodeFs.readdir(path, { withFileTypes: true }, function (error, dirEntries) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(dirEntries.map((dirent) => {
                    const di = {
                        isFile: dirent.isFile(),
                        name: dirent.name,
                        isDirectory: dirent.isDirectory(),
                        isSymlink: dirent.isSymbolicLink(),
                    };
                    return di;
                }));
            });
        });
    };
    fs.readFile = function (path) {
        return nodeFs.readFileSync(path);
    };
    fs.readFileAsync = function (path) {
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
    fs.readJsonFile = function (path) {
        let text = fs.readTextFile(path);
        text = text.replace(/^\ufeff/g, '');
        return JSON.parse(text);
    };
    // deno-lint-ignore no-explicit-any
    fs.readJsonFileAsync = function (path) {
        return fs.readTextFileAsync(path).then((text) => {
            text = text.replace(/^\ufeff/g, '');
            return JSON.parse(text);
        });
    };
    fs.readTextFile = function (path) {
        return nodeFs.readFileSync(path, 'utf8');
    };
    fs.readTextFileAsync = function (path) {
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
    fs.removeDirectory = function (path, options) {
        nodeFs.rmdirSync(path, options);
    };
    fs.removeDirectoryAsync = function (path, options) {
        return new Promise(function (resolve, reject) {
            nodeFs.rmdir(path, { recursive: options?.recursive }, function (error) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };
    fs.removeFile = function (path) {
        nodeFs.unlinkSync(path);
    };
    fs.removeFileAsync = function (path) {
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
    fs.stat = function (path) {
        const stat = nodeFs.statSync(path);
        const name = path instanceof URL ? path.toString() : path;
        const fi = {
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
    fs.statAsync = function (path) {
        return new Promise(function (resolve, reject) {
            nodeFs.stat(path, function (error, stat) {
                if (error) {
                    reject(error);
                    return;
                }
                const name = path instanceof URL ? path.toString() : path;
                const fi = {
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
    fs.writeFile = function (path, data, options) {
        if (!options) {
            nodeFs.writeFileSync(path, data);
            return;
        }
        let flags = 'w';
        if (options.append && options.create) {
            flags = 'a+';
        }
        else if (options.append) {
            flags = 'a';
        }
        else if (options.create === false) {
            flags = 'wx';
        }
        nodeFs.writeFileSync(path, data, {
            mode: options.mode,
            flag: flags,
            signal: options.signal,
        });
    };
    fs.writeFileAsync = function (path, data, options) {
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
            }
            else if (options.append) {
                flags = 'a';
            }
            else if (options.create === false) {
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
    fs.writeTextFile = function (path, data, options) {
        if (!options) {
            nodeFs.writeFileSync(path, data, 'utf8');
            return;
        }
        let flags = 'w';
        if (options.append && options.create) {
            flags = 'a+';
        }
        else if (options.append) {
            flags = 'a';
        }
        else if (options.create === false) {
            flags = 'wx';
        }
        nodeFs.writeFileSync(path, data, {
            mode: options.mode,
            flag: flags,
            signal: options.signal,
            encoding: 'utf8',
        });
    };
    fs.writeTextFileAsync = function (path, data, options) {
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
            }
            else if (options.append) {
                flags = 'a';
            }
            else if (options.create === false) {
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
    fs.writeJsonFile = function (path, 
    // deno-lint-ignore no-explicit-any
    data, options) {
        const json = JSON.stringify(data, null, options ? options.spaces : undefined);
        fs.writeTextFile(path, json, options);
    };
}
export const { createDirectory, createDirectoryAsync, copyDirectory, copyDirectoryAsync, copyFile, copyFileAsync, exists, existsAsync, isDirectory, isDirectoryAsync, isFile, isFileAsync, move, moveAsync, readDirectory, readDirectoryAsync, readFile, readFileAsync, readTextFile, readTextFileAsync, readJsonFile, readJsonFileAsync, removeDirectory, removeDirectoryAsync, removeFile, removeFileAsync, rename, renameAsync, stat, statAsync, writeFile, writeFileAsync, writeTextFile, writeTextFileAsync, writeJsonFile, writeJsonFileAsync, } = fs;
//# sourceMappingURL=base.node.js.map