import "../_dnt.polyfills.js";
import "../_dnt.polyfills.js";
const es6TemplateRegex = /(\\)?\$\{([^\{\}\\]+)\}/g;
const hasOwnProperty = Object.prototype.hasOwnProperty;

// deno-lint-ignore ban-types
function parse(variable: string): Function {
    const matches = variable.match(/\{(.*)\}/);

    if (!matches || matches.length < 2) {
        return function () {
            return '';
        };
    }

    const exp = matches[1];

    if (variable[0] === '\\') {
        return function () {
            return variable.slice(1);
        };
    }

    return function () {
        let declare = '';

        // @ts-ignore : correct usage
        for (const key in this) {
            // @ts-ignore : correct usage
            if (hasOwnProperty.call(this, key)) {
                declare += 'var ' + key + '= locals[\'' + key + '\'];';
            }
        }

        // @ts-ignore : correct usage
        return Function('locals', declare + ' return ' + exp)(this);
    };
}

export default function expandTemplate(
    str: string,
    // deno-lint-ignore no-explicit-any
    locals: { [key: string]: any },
): string {
    const compile = function (str: string) {
        if (typeof str !== 'string') {
            throw new Error('The argument must be a string type');
        }

        // deno-lint-ignore no-explicit-any
        return function (locals: { [key: string]: any }) {
            return str.replace(es6TemplateRegex, function (matched) {
                return parse(matched).call(locals || {});
            });
        };
    };

    // @ts-ignore : correct usage
    return compile(str).call(this, locals);
}
