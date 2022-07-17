import { Version } from './version.ts';
import { globalScope } from './global.ts';
export * from './semantic_version.ts';

export { Version, globalScope }

export type Engine = 'v8' | 'spidermonkey' | 'jsc' | 'chromium' | 'rhino' | 'unknown';
export type Runtime = 'deno' | 'node' | 'browser' | 'electron' | 'unknown';
export type Browser = 'chrome' | 'chromium' | 'edge' | 'firefox' | 'ie' | 'opera' | 'safari' | 'brave' | 'unknown';
export type OsFamily = 'unix' | 'linux' | 'darwin' | 'windows' | 'sunos' | 'freebsd' | 'openbsd' | 'netbsd' | 'aix' | 'unknown';
export type RuntimeArch = 'arm' | 'arm64' | 'ia32' | 'mips' | 'mipsel' | 'ppc' | 'ppc64' | 's390' | 's390x' | 'x64' | 'x86_64' | 'x86' | 'aarch' | 'aarch64' | 'unknown';

export interface IRuntimeEnvironment {
    readonly version: Version;
    readonly engine: Engine;
    readonly runtime: Runtime;
    readonly browser?: string;
    readonly osFamily: OsFamily;
    readonly arch: RuntimeArch;
    readonly mobile: boolean;
    readonly is64bitProcess: boolean;
    // deno-lint-ignore no-explicit-any
    readonly data: { [key: string]: any };
}

const g = globalScope;
let re : IRuntimeEnvironment;

// deno-lint-ignore no-explicit-any
const data : { [key: string]: any }= {}

if (typeof g.Deno !== 'undefined') {

    re =  {
        version: Version.parse(g.Deno.version.deno),
        engine: 'v8',
        runtime: 'deno',
        osFamily: g.Deno.build.os,
        mobile: false,
        arch: g.Deno.build.arch,
        is64bitProcess: ['x64', 'x86_64', 'aarch64', 'arm64', 'ppc64', 's390x'].includes(g.Deno.build.arch),
        data: {
            'build': g.Deno.build,
            'typescript': g.Deno.version.typescript,
            'v8': g.Deno.version.v8,
            'deno': g.Deno.version.deno,
            'platform': g.Deno.platform,
            'arch': g.Deno.arch,
            'version': g.Deno.version.deno,
        },
    };
}
else if (typeof (g.process) !== 'undefined' && typeof (g.process.versions) !== 'undefined' && typeof (g.process.versions.node) !== 'undefined') {
    let platform = g.process.platform;

    switch(platform) {
        case 'win32':
            platform = 'windows';
            break;

        default :
        break;
    }
    
    re = {
        version: Version.parse(g.process.versions.node),
        engine: 'v8',
        runtime: 'node',
        mobile: platform === 'android',
        osFamily: platform,
        arch: g.process.arch,
        is64bitProcess: ['x64', 'x86_64', 'aarch64', 'arm64', 'ppc64', 's390x'].includes(g.process.arch),
        data: Object.assign({
                'platform': g.process.platform,
                'arch': g.process.arch,
                'version': g.process.versions.node,
            }, g.process.versions)
    };
} else if (typeof self !== 'undefined' && typeof (self.navigator) !== 'undefined' && typeof (self.navigator.userAgent) !== 'undefined') {
    // deno-lint-ignore no-explicit-any
    const uaData = (self.navigator as any).userAgentData
    
    let browser: Browser | undefined;
    let versionString : string | undefined = '0.0.0';
    let engine : Engine | undefined = undefined;
    let mobile = false;
    // deno-lint-ignore no-explicit-any
    let platform : any = undefined;
    let is64bit = false;
    let arch : RuntimeArch | undefined = undefined;
    const userAgent = self.navigator.userAgent;
    if(uaData && uaData.brands) {
        platform = uaData.platform;

        uaData.getHighEntropyValues(['bitness', 'architecture']).then((o: { bitness: string; architecture: RuntimeArch|undefined; }) => {
            if(o.bitness === 'x64') {
                is64bit = true;
            }
            if(o.architecture) {
                arch = o.architecture;
                if(is64bit)
                {
                    if(arch === 'arm') {
                        arch = 'arm64';
                    }
                    else if(arch === 'x86') {
                        arch = 'x86_64';
                    }
                }
            }
        });
        data['platform'] = platform;
        switch(platform) {
            case 'Windows':
                platform = 'windows';
                break
            case 'macOS':
                platform = 'darwin';
                break;
            case 'Linux':
                platform = 'linux';
                break;
            case 'Android':
                mobile = true;
                platform = 'linux';
                break;
            case 'iOS':
                mobile = true;
                platform = 'darwin';
                break;

            case 'Unknown':
            default :
                platform = 'unknown';
            break;
        }


        mobile = uaData.mobile === true;
        for(const next of uaData.brands) {
            let chromiumVersion : string | undefined = undefined;

            switch(next.name) {
                case 'Microsoft Edge':
                    browser = 'edge';
                    engine = 'v8';
                    versionString = next.version;
                break;

                case 'Not;A Brand':
                case ' Not;A Brand':
                    continue;

                case 'Google Chrome':
                    engine = 'v8';
                    browser = 'chrome';
                    versionString = next.version;
                    break;

                case 'Brave':
                    engine = 'v8';
                    browser = 'brave';
                    break;

                case 'Chromium':
                    chromiumVersion = next.version;
                    break;
                default :
                    continue;
            }

            if(browser && !versionString && chromiumVersion) {
                versionString = chromiumVersion; 
                browser = 'chromium';
            }
        }

        re = {
            version: Version.parse(uaData.version),
            engine: uaData.engine,
            runtime: uaData.runtime,
            mobile: mobile,
            osFamily: platform || 'unknown',
            arch: arch || 'unknown',
            is64bitProcess: is64bit,
            data: data
        };
    }
    else if(!versionString && !browser) {
        const parts = userAgent.split(' ');
        const browsers = parts.filter(p => p.includes('/'));
        let stop =false;
        for(const next of browsers) {
            const [name, version] = next.split('/');
            
            switch(name) {
                case 'Mozilla':
                    continue;
                case 'Brave':
                    browser = 'brave';
                    engine = 'v8';
                    versionString = version;
                    data['platform'] = name;
                    stop = true;
                    break;
                case 'Chrome':
                    browser = 'chrome';
                    engine = 'v8';
                    versionString = version;
                    data['platform'] = name;
                    stop = true;
                    break;

                case "EdgiOS":
                    browser = 'edge';
                    engine = 'v8';
                    mobile = true;
                    versionString = version;
                    data['platform'] = name;
                    stop = true;
                    break;

                case 'EdgA':
                    browser = 'edge';
                    engine = 'v8';
                    versionString = version;
                    mobile = true;
                    data['platform'] = name;
                    stop = true;
                    break;
               
                case 'Edg':
                case "Edge":
                    browser = 'edge';
                    engine = 'v8';
                    versionString = version;
                    data['platform'] = name;
                    stop = true;
                    break;

                case 'Firefox':
                    browser = 'firefox';
                    engine = 'spidermonkey';
                    versionString = version;
                    data['platform'] = name;
                    stop = true;
                    break;

                case 'OPR':
                    browser = 'opera';
                    data['platform'] = name;
                    stop = true;
                    break;
                case 'Chromium':
                    browser = 'chromium';
                    engine = 'v8';
                    versionString = version;
                    data['platform'] = name;
                    break;
                case 'Safari':
                    browser = 'safari';
                    engine = 'jsc';
                    versionString = version;
                    data['platform'] = name;
                    stop = true;
                    break;
                default:
                    browser = 'unknown';
                    break;
            }

            if(stop) {
                break;
            }
        }
    }

    versionString = (versionString === undefined || versionString === '') ? '0.0.0' : versionString;
    let v = new Version(0, 0, 0, 0);
    try 
    {
        v = Version.parse(versionString);
    }
    catch(e) {
        console.debug(e);
    }
    re = {
        version: v,
        engine: engine || 'unknown',
        runtime: 'browser',
        browser: browser || 'unknown',
        mobile: mobile,
        osFamily: platform || 'unknown',
        arch: arch || 'unknown',
        is64bitProcess: is64bit,
        data: data
    };
} else {
    re = {
        version: Version.parse('0.0.0'),
        engine: 'unknown',
        runtime: 'unknown',
        is64bitProcess: false,
        mobile: false,
        osFamily: 'unknown',
        arch: 'unknown',
        data: {}
    }
}

export const runtimeInfo = re;
export const isDeno = re.runtime === 'deno';
export const isNode = re.runtime === 'node';
export const isBrowser = re.runtime === 'browser';
export const isWindows = re.osFamily === 'windows';
export const isDarwin = re.osFamily === 'darwin';
export const isLinux = re.osFamily === 'linux';
export const isMobile = re.mobile;