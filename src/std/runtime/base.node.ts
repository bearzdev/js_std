import {
    Browser,
    Engine,
    getBrowserRuntimeInformation,
    globalScope,
    IRuntimeEnvironment,
    IVersion,
    OsFamily,
    Runtime,
    RuntimeArch,
    Version,
} from './base.browser.ts';

export type { Browser, Engine, IRuntimeEnvironment, IVersion, OsFamily, Runtime, RuntimeArch };

export { globalScope, Version };
const g = globalScope;
let re: IRuntimeEnvironment;
// allow the ability to short circuit querying the os release version
let osVersion = g._osRelease || '';

if (
    typeof (g.process) !== 'undefined' && typeof (g.process.versions) !== 'undefined' &&
    typeof (g.process.versions.node) !== 'undefined'
) {
    let platform = g.process.platform;

    switch (platform) {
        case 'win32':
            platform = 'windows';
            break;

        default:
            break;
    }

    const nOs = g.os;
    if (osVersion === '' && nOs !== undefined) {
        const os = await import(`os`);
        osVersion = os.release();
    }

    let debug = false;
    let trace = false;

    if (typeof globalScope['_DEBUG'] !== 'undefined' && globalScope['_DEBUG'] === true) {
        debug = globalScope['_DEBUG'];
    }

    if (typeof globalScope['_TRACE'] !== 'undefined' && globalScope['_TRACE'] === true) {
        trace = globalScope['_TRACE'];
    }

    if (g.process.env['DEBUG'] !== undefined) {
        debug = true;
    }

    if (g.process.env['TRACE'] !== undefined) {
        trace = true;
    }

    re = {
        version: Version.parse(g.process.versions.node),
        engine: 'v8',
        runtime: 'node',
        mobile: platform === 'android',
        osVersion: osVersion,
        osFamily: platform,
        arch: g.process.arch,
        debug: debug,
        trace: trace,
        is64bitProcess: ['x64', 'x86_64', 'aarch64', 'arm64', 'ppc64', 's390x'].includes(g.process.arch),
        data: Object.assign({
            'platform': g.process.platform,
            'arch': g.process.arch,
            'version': g.process.versions.node,
        }, g.process.versions),
    };
} else if (globalScope.navigator && globalScope.navigator.userAgent) {
    re = await getBrowserRuntimeInformation();
} else {
    let debug = false;
    let trace = false;

    if (typeof globalScope['_DEBUG'] !== 'undefined') {
        debug = true;
    }

    if (typeof globalScope['_TRACE'] !== 'undefined') {
        trace = true;
    }

    re = {
        version: Version.parse('0.0.0'),
        engine: 'unknown',
        runtime: 'unknown',
        is64bitProcess: false,
        mobile: false,
        debug: debug,
        trace: trace,
        osFamily: 'unknown',
        osVersion: '',
        arch: 'unknown',
        data: {},
    };
}

export const DEBUG = re.debug;

export const TRACE = re.trace;

export const runtimeInfo = re;
export const isDeno = re.runtime === 'deno';
export const isNode = re.runtime === 'node';
export const isBrowser = re.runtime === 'browser';
export const isWindows = re.osFamily === 'windows';
export const isDarwin = re.osFamily === 'darwin';
export const isLinux = re.osFamily === 'linux';
export const isMobile = re.mobile;
