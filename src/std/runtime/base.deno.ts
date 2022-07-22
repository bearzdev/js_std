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

let re: IRuntimeEnvironment;

export type { Browser, Engine, IRuntimeEnvironment, IVersion, OsFamily, Runtime, RuntimeArch };

export { globalScope, Version };
const g = globalScope;
let osVersion = g._osRelease || '';

if (globalScope.Deno && typeof globalScope.Deno.os !== 'undefined') {
    if (osVersion === '') {
        try {
            // osRelease is unstable and may not be available in all Deno versions
            if (g.Deno.osRelease) {
                osVersion = g.Deno.osRelease();
            }
            // NOTE: osVersion is not always available and this isn't not ideal.
            // deno returns the wrong version for windows 10 & above.. however this returns fairly quickly.
            // avg 65 ms on my machine.
            if (g.Deno.build.os === 'windows' && osVersion.startsWith('6.2.9200')) {
                // @ts-ignore - spansync is not showing up
                const r = g.Deno.spawnSync('wmic', { args: ['os', 'get', 'version'] });
                if (r.status.code === 0) {
                    const output = new TextDecoder().decode(r.stdout);
                    osVersion = output.split('\n')[1].trim();
                }
            }
        } catch (e) {
            if (g.Deno.env.get('DEBUG') !== undefined) {
                console.debug(e);
            }
            osVersion = '';
        }
    }

    let debug = false;
    let trace = false;

    if (typeof globalScope['_DEBUG'] !== 'undefined' && globalScope['_DEBUG'] === true) {
        debug = globalScope['_DEBUG'];
    }

    if (typeof globalScope['_TRACE'] !== 'undefined' && globalScope['_TRACE'] === true) {
        trace = globalScope['_TRACE'];
    }

    if (g.Deno.env.get('DEBUG') !== undefined) {
        debug = true;
    }

    if (g.Deno.env.get('TRACE') !== undefined) {
        trace = true;
    }

    re = {
        version: Version.parse(g.Deno.version.deno),
        engine: 'v8',
        runtime: 'deno',
        osFamily: g.Deno.build.os,
        osVersion: osVersion,
        mobile: false,
        arch: g.Deno.build.arch,
        debug: debug,
        trace: trace,
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
} else if (globalScope.navigator && globalScope.navigator.userAgent) {
    re = await getBrowserRuntimeInformation();
} else {
    let debug = false;
    let trace = false;

    if (typeof globalScope['_DEBUG'] !== 'undefined' && globalScope['_DEBUG'] === true) {
        debug = globalScope['_DEBUG'];
    }

    if (typeof globalScope['_TRACE'] !== 'undefined' && globalScope['_TRACE'] === true) {
        trace = globalScope['_TRACE'];
    }

    re = {
        version: Version.parse('0.0.0'),
        engine: 'unknown',
        runtime: 'unknown',
        is64bitProcess: false,
        mobile: false,
        osFamily: 'unknown',
        osVersion: '',
        debug: debug,
        trace: trace,
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
