export interface ISystemError extends Error {
    code: string;
    address?: string;
    dest?: string;
    errno?: number;
}

export interface IDirectoryInfo {
    name: string | null;
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
}

export interface IRemoveOptions {
    recursive?: boolean;
}

export interface ICreateDirectoryOptions {
    recursive?: boolean;
    mode?: number;
}

export interface ICopyOptions {
    overwrite?: boolean;
    preserveTimestamps?: boolean;
}

export interface IMoveOptions {
    overwrite?: boolean;
}

export interface IWriteOptions {
    append?: boolean;
    create?: boolean;
    signal?: AbortSignal;
    mode: number;
}

export interface IFileInfo {
    name: string;
    deviceId: number | null;
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
    size: number;
    createdAt: Date | null;
    modifiedAt: Date | null;
    lastAccessedAt: Date | null;
    changedAt: Date | null;
    userId: number | null;
    groupId: number | null;
    mode: number | null;
}

export interface IWriteJsonOptions extends IWriteOptions {
    spaces: number;
}

export interface IFileSystem {
    createDirectory(
        path: string | URL,
        options?: ICreateDirectoryOptions,
    ): void;

    createDirectoryAsync(
        path: string | URL,
        options?: ICreateDirectoryOptions,
    ): Promise<void>;

    copyDirectory(src: string | URL, dest: string | URL, options?: ICopyOptions): void;

    copyDirectoryAsync(
        src: string | URL,
        dest: string |URL,
        options?: ICopyOptions,
    ): Promise<void>;

    copyFile(src: string | URL, dest: string): void;

    copyFileAsync(src: string | URL, dest: string): Promise<void>;

    exists(path: string | URL): boolean;

    existsAsync(path: string | URL): Promise<boolean>;

    isFile(path: string | URL): boolean;

    isFileAsync(path: string | URL): Promise<boolean>;

    isDirectory(path: string | URL): boolean;

    isDirectoryAsync(path: string | URL): Promise<boolean>;

    lstat(path: string | URL): IFileInfo;

    lstatAsync(path: string | URL): Promise<IFileInfo>;

    move(src: string | URL, dest: string, options?: IMoveOptions): void;

    moveAsync(src: string | URL, dest: string, options?: IMoveOptions): Promise<void>;

    readFile(path: string | URL): Uint8Array;

    readFileAsync(path: string | URL): Promise<Uint8Array>;

    readDirectory(path: string | URL): Iterable<IDirectoryInfo>;

    readDirectoryAsync(path: string | URL): AsyncIterable<IDirectoryInfo>;

    // deno-lint-ignore no-explicit-any
    readJsonFile(path: string | URL): any;

    // deno-lint-ignore no-explicit-any
    readJsonFileAsync(path: string | URL): Promise<any>;

    readTextFile(path: string | URL): string;

    readTextFileAsync(path: string | URL): Promise<string>;

    realPath(path: string | URL) : string;

    realPathAsync(path: string | URL): Promise<string>;

    removeFile(path: string | URL): void;

    removeFileAsync(path: string | URL): Promise<void>;

    removeDirectory(path: string | URL, options?: IRemoveOptions): void;

    removeDirectoryAsync(path: string | URL, options?: IRemoveOptions): Promise<void>;

    rename(src: string | URL, dest: string | URL): void;

    renameAsync(src: string | URL, dest: string | URL): Promise<void>;

    stat(path: string | URL): IFileInfo;

    statAsync(path: string | URL): Promise<IFileInfo>;

    writeFile(
        path: string | URL,
        data: Uint8Array,
        options?: IWriteOptions,
    ): void;

    writeFileAsync(
        path: string | URL,
        data: Uint8Array,
        options?: IWriteOptions,
    ): Promise<void>;

    writeTextFile(
        path: string | URL,
        data: string,
        options?: IWriteOptions,
    ): void;

    writeTextFileAsync(
        path: string | URL,
        data: string,
        options?: IWriteOptions,
    ): Promise<void>;

    writeJsonFile(
        path: string | URL,
        // deno-lint-ignore no-explicit-any
        data: any,
        options?: IWriteJsonOptions,
    ): void;

    writeJsonFileAsync(
        path: string | URL,
        // deno-lint-ignore no-explicit-any
        data: any,
        options?: IWriteJsonOptions,
    ): Promise<void>;
}
