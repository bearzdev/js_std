import type { Browser, Engine, IRuntimeEnvironment, IVersion, OsFamily, Runtime, RuntimeArch } from './interfaces.js';
import { Version } from './version.js';
import { globalScope } from './global.js';

export { Browser, Engine, globalScope, IRuntimeEnvironment, IVersion, OsFamily, Runtime, RuntimeArch, Version };

let re: IRuntimeEnvironment;

// deno-lint-ignore no-explicit-any
const data: { [key: string]: any } = {};

export async function getBrowserRuntimeInformation() {
    // deno-lint-ignore no-explicit-any
    const uaData = (self.navigator as any).userAgentData;

    let browser: Browser | undefined;
    let versionString: string | undefined = '0.0.0';
    let engine: Engine | undefined = undefined;
    let mobile = false;
    // deno-lint-ignore no-explicit-any
    let platform: any = undefined;
    let is64bit = false;
    let arch: RuntimeArch | undefined = undefined;
    const { userAgent } = self.navigator;
    let debug = false;
    let trace = false;

    // not supported in firefox
    if (uaData?.brands) {
        platform = uaData.platform;

        await uaData.getHighEntropyValues(['bitness', 'architecture']).then(
            (o: { bitness: string; architecture: RuntimeArch | undefined }) => {
                if (o.bitness === 'x64') {
                    is64bit = true;
                }
                if (o.architecture) {
                    arch = o.architecture;
                    if (is64bit) {
                        if (arch === 'arm') {
                            arch = 'arm64';
                        } else if (arch === 'x86') {
                            arch = 'x86_64';
                        }
                    }
                }
            },
        );
        data['platform'] = platform;
        switch (platform) {
            case 'Windows':
                platform = 'windows';
                break;
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
            default:
                platform = 'unknown';
                break;
        }

        mobile = uaData.mobile === true;
        for (const next of uaData.brands) {
            let chromiumVersion: string | undefined = undefined;

            switch (next.name) {
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
                default:
                    continue;
            }

            // in case we found chromium, but not another major browser, default to chromium
            if (browser && !versionString && chromiumVersion) {
                versionString = chromiumVersion;
                browser = 'chromium';
            }
        }

        if (typeof globalScope['_DEBUG'] !== 'undefined' && globalScope['_DEBUG'] === true) {
            debug = globalScope['_DEBUG'];
        }

        if (typeof globalScope['_TRACE'] !== 'undefined' && globalScope['_TRACE'] === true) {
            trace = globalScope['_TRACE'];
        }

        const re: IRuntimeEnvironment = {
            version: Version.parse(uaData.version),
            engine: uaData.engine,
            runtime: uaData.runtime,
            mobile: mobile,
            osFamily: platform || 'unknown',
            osVersion: '',
            arch: arch || 'unknown',
            is64bitProcess: is64bit,
            debug: debug,
            trace: trace,
            data: data,
        };

        return re;
    } else if (!versionString && !browser) {
        const parts = userAgent.split(' ');
        const browsers = parts.filter((p) => p.includes('/'));
        let stop = false;
        for (const next of browsers) {
            const [name, version] = next.split('/');

            switch (name) {
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

                case 'EdgiOS':
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
                case 'Edge':
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

            if (stop) {
                break;
            }
        }
    }

    versionString = (versionString === undefined || versionString === '') ? '0.0.0' : versionString;
    let v = new Version(0, 0, 0, 0);
    try {
        v = Version.parse(versionString);
    } catch (e) {
        console.debug(e);
    }

    if (typeof globalScope['_DEBUG'] !== 'undefined' && globalScope['_DEBUG'] === true) {
        debug = globalScope['_DEBUG'];
    }

    if (typeof globalScope['_TRACE'] !== 'undefined' && globalScope['_TRACE'] === true) {
        trace = globalScope['_TRACE'];
    }

    re = {
        version: v,
        engine: engine || 'unknown',
        runtime: 'browser',
        browser: browser || 'unknown',
        mobile: mobile,
        osFamily: platform || 'unknown',
        osVersion: '',
        arch: arch || 'unknown',
        is64bitProcess: is64bit,
        debug: debug,
        trace: trace,
        data: data,
    };

    return re;
}
