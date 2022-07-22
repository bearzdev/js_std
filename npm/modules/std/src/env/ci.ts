import { envVars } from './variables.js';


export const ciMap = new Map<string, { test: string | (() => boolean), name: string, supportsColor?: number | (() => number) }>();

const set = [{
    test: 'TRAVIS',
    name: 'travisci',
    supportsColor: 1
}, {
    test: 'CIRCLECI',
    name: 'circleci',
    supportsColor: 1
}, {
    test: 'APPVEYOR',
    name: 'appveyor',
    supportsColor: 1
}, {
    test: 'JENKINS_URL',
    name: 'jenkins'
}, {
    test: 'BITBUCKET_BUILD_ID',
    name: 'bitbucket'
}, {
    test: 'BAMBOO_BUILD_ID',
    name: 'bamboo'
}, {
    test: 'TEAMCITY_VERSION',
    name: 'teamcity',
    supportsColor: () => {
        const version = envVars.get('TEAMCITY_VERSION');
        if (!version) 
            return 0;

        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(version) ? 1 : 0;
    }
}, {
    test: 'HARNESS_ACTIVE',
    name: 'harness'
}, {
    test: 'GITHUB_ACTIONS',
    name: 'github',
    supportsColor: 1
}, {
    test: 'GITLAB_CI',
    name: 'gitlab',
    supportsColor: 1
}, {
    test: () => envVars.has("TF_BUILD") && envVars.has("AGENT_NAME"),
    name: 'azure',
    supportsColor: 1,
}, {
    name: 'BUILDKITE',
    test: 'BUILDKITE',
    supportsColor: 1
}, {
    name: 'DRONE',
    test: 'DRONE',
    supportsColor: 1
}]

set.forEach(item => {
    ciMap.set(item.name, item);
});

export function isCi() {
    if(envVars.has('CI'))
        return true;

    for (const [_, item] of ciMap) {
        if(typeof item.test === 'string' && envVars.has(item.test))
            return true;

        if(typeof item.test === 'function' && item.test())
            return true;
    }

    return false;
}

export function getCiColorSupport() {
    for (const [_, item] of ciMap) {
        if(typeof item.test === 'string' && !envVars.has(item.test))
            continue;

        if(typeof item.test === 'function' && !item.test())
            continue;

        if(typeof item.supportsColor === 'function')
            return item.supportsColor();

        if(typeof item.supportsColor === 'number')
            return item.supportsColor;
    }

    return 0;
}

export function getCiName() {
    for (const [name, item] of ciMap) {
        if(typeof item.test === 'string' && envVars.has(item.test))
            return name;

        if(typeof item.test === 'function' && item.test())
            return name;
    }

    return undefined;
}