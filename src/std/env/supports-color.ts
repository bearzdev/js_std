// based on chalk
import { isBrowser, globalScope, isDeno, isNode, isWindows, runtimeInfo } from '../runtime/mod.ts';
import { ciMap } from './ci.ts';
import { commandLineArgs } from './process.ts';
import type { IColorSupport, IStreamColorSupport } from './interfaces.ts';
import { envVars } from "./variables.ts";

let streamSupportsColor : IStreamColorSupport = {
    stderr: {
        off: true,
        level: 0,
        has16m: false,
        has256 : false,
        hasBasic: false,
    },
    stdout: {
        off: true,
        level: 0,
        has16m: false,
        has256 : false,
        hasBasic: false,
    },
}

if (isBrowser)
{
    const isBlinkBasedBrowser = globalScope.navigator.userAgentData ? 
        globalScope.navigator.userAgentData.brands.some((next : ({brand: string})) => next.brand === 'Chromium') :
        /\b(Chrome|Chromium)\//.test(navigator.userAgent);

    if(isBlinkBasedBrowser)
    {
        const colorSupport : IColorSupport = {
            off: false,
            level: 1,
            hasBasic: true,
            has256: true,
            has16m: true,
        };

        streamSupportsColor = {
            stderr: colorSupport,
            stdout: colorSupport,
        }
    }
} else if(isDeno || isNode) {
    // not ideal, race condition
    let outRedirected = false;
    let errRedirected = false;
    if(isNode)
    {
        import('https://deno.land/std@$STD_VERSION/node/tty.ts').then(({ isatty }) => { 
            outRedirected = isatty(globalScope.process.stdout.fd);
            errRedirected = isatty(globalScope.process.stderr.fd);
        });
    }

    let quickNo = false;
    if(isDeno && globalScope.Deno.noColors)
        quickNo = true;

    const forceColor = envVars.get('FORCE_COLOR');
    if(!quickNo && forceColor && forceColor.toLowerCase() === 'false')
        quickNo = true;

    const args = commandLineArgs;

    if(!quickNo && args.length > 0)
    {
        const noColorValues = ['--no-color', '-no-color', '--no-colors', '-no-colors', '-color=false', '--color=false', '-color=never', '--color=never'];
        const noColor = args.some(value => noColorValues.includes(value));
        quickNo = noColor;
    }

    console.log('quickNo', quickNo);

    // already set streamSupportsColor values to false, so only focus on the other cases
    if(!quickNo)
    {
        if(isDeno) {
            outRedirected = globalScope.Deno.isatty(globalScope.Deno.stdout.rid);
            errRedirected = globalScope.Deno.isatty(globalScope.Deno.stderr.rid);

            console.log("outRedirected", outRedirected);
            console.log("errRedirected", errRedirected);
        } 

        const getColorLevel = () => {
            const trueColorValues = ['--color=16m', '-color=16m', '--color=full', '-color=full', '--color=truecolor', '-color=truecolor'];
            if(args.some(value => trueColorValues.includes(value))){
                return 3;
            }

            if(args.some(value => value === '--color=256' || value === '-color=256'))
                return 2;
    
            let useForceColor = false;
            if(forceColor && forceColor.toLowerCase() === 'true')
                useForceColor = true;
            
            if(!useForceColor) {
                const someColorValues = ['--color', '-color', '--color=true', '-color=true', '--color=always', '-color=always'];
                useForceColor = args.some(value => someColorValues.includes(value));
            }

            const min = useForceColor ? 1 : 0;

            // if you're using CI, then it will override term defaults
            for(const ci of ciMap.values()) {
                if(typeof ci.supportsColor === 'undefined')
                    continue;

                if((typeof ci.test === 'function' && ci.test())
                    || typeof(ci.test) === 'string' && envVars.has(ci.test))
                {
                    if(typeof ci.supportsColor === 'function') {
                        return ci.supportsColor() ||  min;
                    }
                    if(typeof ci.supportsColor === 'number') {
                        return ci.supportsColor || min;
                    }
                }
            }

            const term = envVars.get('TERM') || '';
            if(term === 'dumb') {
                return min;
            }

            // works on vscode / linux
            const colorTerm = envVars.get('COLORTERM');
            if(colorTerm && colorTerm === 'truecolor')
                return 3;

            if(isWindows) {
                const osRelease = runtimeInfo.osVersion.split('.');
                if (
                    Number(osRelease[0]) >= 10
                    && Number(osRelease[2]) >= 10_586
                ) {
                    return Number(osRelease[2]) >= 14_931 ? 3 : 2;
                }

                return 1;
            }

            if (envVars.has('TERM_PROGRAM')) {
                const termProgram = envVars.get('TERM_PROGRAM');
                const termProgramVersion = envVars.get('TERM_PROGRAM_VERSION') || '';
                const version = Number.parseInt((termProgramVersion).split('.')[0], 10);
        
                switch (termProgram) {
                    case 'iTerm.app':
                        return version >= 3 ? 3 : 2;
                    case 'Apple_Terminal':
                        return 2;
                    // No default
                }
            }

            if (/-256(color)?$/i.test(term)) {
                return 2;
            }
        
            if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(term)) {
                return 1;
            }

            return min;
        }


       
        const level = getColorLevel();
        console.log('level', level);
        if(level !== 0) {
            streamSupportsColor  ={
                stdout: outRedirected ? streamSupportsColor.stdout : {
                    off: false,
                    level: level,
                    hasBasic: true,
                    has256: level >= 2,
                    has16m: level >= 3,
                },
                stderr: errRedirected ? streamSupportsColor.stderr : {
                    off: false,
                    level: level,
                    hasBasic: true,
                    has256: level >= 2,
                    has16m: level >= 3,
                }
            }
        }
    }
}


export const supportsColor = streamSupportsColor;