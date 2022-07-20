"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobile = exports.isLinux = exports.isDarwin = exports.isWindows = exports.isBrowser = exports.isNode = exports.isDeno = exports.runtimeInfo = exports.globalScope = exports.Version = void 0;
require("../_dnt.polyfills.js");
const version_js_1 = require("./version.js");
Object.defineProperty(exports, "Version", { enumerable: true, get: function () { return version_js_1.Version; } });
const global_js_1 = require("./global.js");
Object.defineProperty(exports, "globalScope", { enumerable: true, get: function () { return global_js_1.globalScope; } });
__exportStar(require("./semantic-version.js"), exports);
__exportStar(require("./interfaces.js"), exports);
const g = global_js_1.globalScope;
let re;
// deno-lint-ignore no-explicit-any
const data = {};
// allow the ability to short circuit querying the os release version
let osVersion = g._osRelease || '';
if (typeof g.Deno !== 'undefined') {
    if (osVersion === '') {
        try {
            osVersion = g.Deno.osRelease();
            // NOTE: osVersion is not always available and this isn't not ideal.
            // deno returns the wrong version for windows 10 & above.. however this returns fairly quickly.
            // avg 65 ms on my machine.
            if (g.Deno.build.os === 'windows' && osVersion.startsWith('6.2.9200')) {
                const start = new Date();
                // @ts-ignore - spansync is not showing up
                const r = g.Deno.spawnSync("wmic", { args: ["os", "get", "version"] });
                if (r.status.code === 0) {
                    const output = new TextDecoder().decode(r.stdout);
                    osVersion = output.split("\n")[1].trim();
                }
                const end = new Date();
                const diff = end.getTime() - start.getTime();
                console.log('diff ms:', diff);
            }
        }
        catch (e) {
            if (g.Deno.env.get("DEBUG") !== undefined)
                console.debug(e);
            osVersion = '';
        }
    }
    re = {
        version: version_js_1.Version.parse(g.Deno.version.deno),
        engine: 'v8',
        runtime: 'deno',
        osFamily: g.Deno.build.os,
        osVersion: osVersion,
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
    switch (platform) {
        case 'win32':
            platform = 'windows';
            break;
        default:
            break;
    }
    const nOs = g.os;
    if (osVersion === '' && nOs !== undefined) {
        osVersion = nOs.release();
    }
    re = {
        version: version_js_1.Version.parse(g.process.versions.node),
        engine: 'v8',
        runtime: 'node',
        mobile: platform === 'android',
        osVersion: osVersion,
        osFamily: platform,
        arch: g.process.arch,
        is64bitProcess: ['x64', 'x86_64', 'aarch64', 'arm64', 'ppc64', 's390x'].includes(g.process.arch),
        data: Object.assign({
            'platform': g.process.platform,
            'arch': g.process.arch,
            'version': g.process.versions.node,
        }, g.process.versions)
    };
}
else if (typeof self !== 'undefined' && typeof (self.navigator) !== 'undefined' && typeof (self.navigator.userAgent) !== 'undefined') {
    // deno-lint-ignore no-explicit-any
    const uaData = self.navigator.userAgentData;
    let browser;
    let versionString = '0.0.0';
    let engine = undefined;
    let mobile = false;
    // deno-lint-ignore no-explicit-any
    let platform = undefined;
    let is64bit = false;
    let arch = undefined;
    const { userAgent } = self.navigator;
    if (uaData?.brands) {
        platform = uaData.platform;
        uaData.getHighEntropyValues(['bitness', 'architecture']).then((o) => {
            if (o.bitness === 'x64') {
                is64bit = true;
            }
            if (o.architecture) {
                arch = o.architecture;
                if (is64bit) {
                    if (arch === 'arm') {
                        arch = 'arm64';
                    }
                    else if (arch === 'x86') {
                        arch = 'x86_64';
                    }
                }
            }
        });
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
            let chromiumVersion = undefined;
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
            if (browser && !versionString && chromiumVersion) {
                versionString = chromiumVersion;
                browser = 'chromium';
            }
        }
        re = {
            version: version_js_1.Version.parse(uaData.version),
            engine: uaData.engine,
            runtime: uaData.runtime,
            mobile: mobile,
            osFamily: platform || 'unknown',
            osVersion: '',
            arch: arch || 'unknown',
            is64bitProcess: is64bit,
            data: data
        };
    }
    else if (!versionString && !browser) {
        const parts = userAgent.split(' ');
        const browsers = parts.filter(p => p.includes('/'));
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
            if (stop) {
                break;
            }
        }
    }
    versionString = (versionString === undefined || versionString === '') ? '0.0.0' : versionString;
    let v = new version_js_1.Version(0, 0, 0, 0);
    try {
        v = version_js_1.Version.parse(versionString);
    }
    catch (e) {
        console.debug(e);
    }
    re = {
        version: v,
        engine: engine || 'unknown',
        runtime: 'browser',
        browser: browser || 'unknown',
        mobile: mobile,
        osFamily: platform || 'unknown',
        osVersion: osVersion,
        arch: arch || 'unknown',
        is64bitProcess: is64bit,
        data: data
    };
}
else {
    re = {
        version: version_js_1.Version.parse('0.0.0'),
        engine: 'unknown',
        runtime: 'unknown',
        is64bitProcess: false,
        mobile: false,
        osFamily: 'unknown',
        osVersion: osVersion,
        arch: 'unknown',
        data: {}
    };
}
exports.runtimeInfo = re;
exports.isDeno = re.runtime === 'deno';
exports.isNode = re.runtime === 'node';
exports.isBrowser = re.runtime === 'browser';
exports.isWindows = re.osFamily === 'windows';
exports.isDarwin = re.osFamily === 'darwin';
exports.isLinux = re.osFamily === 'linux';
exports.isMobile = re.mobile;
//# sourceMappingURL=mod.js.map