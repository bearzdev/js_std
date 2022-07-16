import { Version } from './version.js';
import { globalScope } from './global.js';
const g = globalScope;
let re;
if (typeof g.Deno !== 'undefined') {
    re = {
        version: Version.parse(g.Deno.version.deno),
        engine: 'v8',
        runtime: 'deno',
    };
}
else if (typeof (g.process) !== 'undefined' && typeof (g.process.versions) !== 'undefined' && typeof (g.process.versions.node) !== 'undefined') {
    re = {
        version: Version.parse(g.process.versions.node),
        engine: 'v8',
        runtime: 'node',
    };
}
else if (typeof self !== 'undefined' && typeof (self.navigator) !== 'undefined' && typeof (self.navigator.userAgent) !== 'undefined') {
    // deno-lint-ignore no-explicit-any
    const uaData = self.navigator.userAgentData;
    let browser;
    let versionString = '0.0.0';
    let engine = undefined;
    if (uaData && uaData.brands) {
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
            version: Version.parse(uaData.version),
            engine: uaData.engine,
            runtime: uaData.runtime,
        };
    }
    else if (!versionString && !browser) {
        const userAgent = self.navigator.userAgent;
        const parts = userAgent.split(' ');
        const browsers = parts.filter(p => p.includes('/'));
        for (const next of browsers) {
            const [name, version] = next.split('/');
            switch (name) {
                case 'Mozilla':
                    continue;
                case 'Brave':
                    browser = 'brave';
                    engine = 'v8';
                    versionString = version;
                    break;
                case 'Chrome':
                    browser = 'chrome';
                    engine = 'v8';
                    versionString = version;
                    break;
                case 'Edg':
                    browser = 'edge';
                    engine = 'jsc';
                    versionString = version;
                    break;
                case 'Firefox':
                    browser = 'firefox';
                    engine = 'spidermonkey';
                    versionString = version;
                    break;
                case 'OPR':
                    browser = 'opera';
                    break;
                case 'Chromium':
                    browser = 'chromium';
                    engine = 'v8';
                    versionString = version;
                    break;
                case 'Safari':
                    browser = 'safari';
                    engine = 'jsc';
                    versionString = version;
                    break;
                default:
                    browser = 'unknown';
                    break;
            }
        }
    }
    versionString = (versionString === undefined || versionString === '') ? '0.0.0' : versionString;
    let v = new Version(0, 0, 0, 0);
    try {
        v = Version.parse(versionString);
    }
    catch (e) {
        console.debug(e);
    }
    re = {
        version: v,
        engine: engine || 'unknown',
        runtime: 'browser',
        browser: browser || 'unknown',
    };
}
else {
    re = {
        version: Version.parse('0.0.0'),
        engine: 'unknown',
        runtime: 'unknown',
    };
}
export const runtimeInfo = re;
export const isDeno = re.runtime === 'deno';
export const isNode = re.runtime === 'node';
export const isBrowser = re.runtime === 'browser';
//# sourceMappingURL=mod.js.map