// deno-lint-ignore-file
import { Dictionary } from "../collections/dictionary.ts";
import { KeyValuePair } from "../collections/interfaces.ts";
import { join } from "./_util.ts";

export interface IConfigurationBuilder {
    readonly sources: IConfigurationSource[];
    readonly properties: Map<string, any>;
    add(source: IConfigurationSource): IConfigurationBuilder;
    build(): IConfigurationRoot;
}

export interface IConfigurationSection extends IConfiguration {
    readonly key: string;
    readonly path: string;
    value?: string;
}

export interface IConfigurationRoot extends IConfiguration {
    readonly providers: Iterable<IConfigurationProvider>;
}

export interface IConfiguration {
    get(path: string) : string | undefined;
    set(path: string, value?: string) : void;
    getSection(path: string) : IConfigurationSection;
    getChildren(path: string) : Iterable<IConfigurationSection>
}

export interface IConfigurationProvider {
    load(): void;
    set(key: string, value?: string): void;
    get(key: string) : string | undefined;
    getChildKeys(earlierKeys: Iterable<string>, parentPath?: string) : Iterable<string>
}

export interface IConfigurationSource {
    build(builder: IConfigurationBuilder): IConfigurationProvider;
}

export class ConfigurationRoot implements IConfigurationRoot {
    #providers: IConfigurationProvider[];

    constructor(providers: IConfigurationProvider[]) {
        this.#providers = providers;
        for(const provider of providers) {
            provider.load();
        }
    }

    get (path: string) : string | undefined {
        return ConfigurationRoot.getConfiguration(this.#providers, path);
    }

    getSection(path: string) : IConfigurationSection {
        return new ConfigurationSection(this, path);
    }

    getChildren(path?: string) : Iterable<IConfigurationSection> {
        return this.#providers.reduceRight<string[]>((acc, provider) => { 
            return Array.from(provider.getChildKeys(acc, path)).filter(key => !acc.includes(key));
        }, [] as string[])
        .map(key => this.getSection(path == null ? key : join([path, key])));


    }

    set(path: string, value?: string) : void {
        ConfigurationRoot.setConfiguration(this.#providers, path, value);
    }
    
    static getConfiguration(providers: IConfigurationProvider[], key: string) : string | undefined {
        for (let i = providers.length - 1; i >= 0; i--)
        {
            const provider = providers[i];

            const value = provider.get(key);
            if (value !== undefined)
            {
                return value;
            }
        }

        return undefined;
    }

    static setConfiguration(providers: IConfigurationProvider[], key: string, value?: string) : void {
        if(providers.length === 0)
            throw new Error('No providers');

        for(const provider of providers) {
            provider.set(key, value);
        }
    }

    get providers() : Iterable<IConfigurationProvider> {
        return this.#providers;
    }
}

export class ConfigurationSection implements IConfigurationSection {
    #root: IConfigurationRoot;
    #path: string;
    #key?: string;

    constructor(root: IConfigurationRoot, path: string) {
        this.#root = root;
        this.#path  = path;
    }
    get(path: string): string|undefined {
        throw new Error("Method not implemented.");
    }
    set(path: string,value?: string|undefined): void {
        throw new Error("Method not implemented.");
    }
    getSection(path: string): IConfigurationSection {
        throw new Error("Method not implemented.");
    } 
    getChildren(path: string): Iterable<IConfigurationSection> {
        throw new Error("Method not implemented.");
    }

    get path() : string {
        return this.#path;
    }

    get key() : string {
        this.#key ||= '';
        return this.#key;
    }

    get value() : string | undefined {
        return this.#root.get(this.#path);
    }

    set value(value: string | undefined) {
        this.#root.set(this.#path, value);
    }
}

export class ConfigurationProvider implements IConfigurationProvider {
    protected Data: Dictionary<string, string | undefined>;

    constructor() {
        this.Data = new Dictionary<string, string | undefined>();
        this.Data.setComparer((a, b) => a.toLowerCase() === b.toLowerCase());
    }

    get(key: string): string | undefined {
        return this.Data.get(key);
    }
    
    load(): void {
        
    }

    set(key: string, value?: string): void {
        this.Data.set(key, value);
    }
    
    getChildKeys(_earlierKeys: Iterable<string>, _parentPath: string): Iterable<string> {
        throw new Error("Method not implemented.");
    }
}

export class MemoryConfigurationSource implements IConfigurationSource {
    initialData?: Iterable<KeyValuePair<string, string>>;
    

    build(_builder: IConfigurationBuilder): IConfigurationProvider {
        return new MemoryConfigurationProvider(this);
    }
}

export class MemoryConfigurationProvider extends ConfigurationProvider {
    constructor(source: MemoryConfigurationSource) {
        super();
        
        if(source.initialData) {
            for(const [key, value] of source.initialData) {
                this.Data.set(key, value);
            }
        }
    }
}

export class ConfigBuilder implements IConfigurationBuilder {
    #sources: IConfigurationSource[];
    // deno-lint-ignore no-explicit-any
    #map : Map<string, any>;

    constructor() {
        this.#sources = [];
        // deno-lint-ignore no-explicit-any
        this.#map = new Map<string, any>();
    }

    get sources() : IConfigurationSource[] {
        return this.#sources;
    }

    // deno-lint-ignore no-explicit-any
    get properties() : Map<string, any> {
        return this.#map;
    }

    add(source: IConfigurationSource) : IConfigurationBuilder {
        this.#sources.push(source);
        return this;
    }

    build(): IConfigurationRoot {
        throw new Error("Method not implemented.");
    }
}