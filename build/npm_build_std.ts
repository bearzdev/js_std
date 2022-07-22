import { resolve, fromFileUrl, dirname, join, } from 'https://deno.land/std@$STD_VERSION/path/mod.ts';
import { build, emptyDir } from "https://deno.land/x/dnt@0.27.0/mod.ts";

const __file = fromFileUrl(import.meta.url);
const __dirname = dirname(__file);
const root = resolve(__dirname, '..');
const moduleDir = resolve(root, 'npm/modules');
const src = resolve(__dirname, "../src");
const std = join(src, 'std');
console.log('src', src);
console.log('std', std);
console.log('moduleDir', moduleDir);

function fromStd(path: string) {
    return join(std, path);
}

const text = await Deno.readTextFile(join(root, 'config', 'std.package.json'));
const packageJson = JSON.parse(text);

await emptyDir(`${moduleDir}/std`);

Deno.chdir(std);


await build({
  mappings: {
    "./runtime/base.deno.ts": "./runtime/base.node.ts",
    "./fs/base.deno.ts": "./fs/base.node.ts",
    "./process/base.deno.ts": "./process/base.node.ts",
  },
  rootTestDir: std,
  scriptModule: false,
  
  entryPoints: [
    fromStd('mod.ts'),
    {
      name: './errors',
      path: fromStd('errors/mod.ts'),
    },
    {
      name: './errors/mod.js',
      path: fromStd('errors/mod.ts'),
    },
    {
      name: './g11n',
      path: fromStd('g11n/mod.ts'),
    },
    {
      name: './g11n/mod.js',
      path: fromStd('g11n/mod.ts'),
    },
    {
      name: './random',
      path: fromStd('random/mod.ts'),
    },
    {
      name: './random/mod.js',
      path: fromStd('random/mod.ts'),
    },
    {
      name: './secrets',
      path: fromStd('secrets/mod.ts'),
    },
    {
      name: './secrets/mod.js',
      path: fromStd('secrets/mod.ts'),
    },
    {
      name: './templating',
      path: fromStd('templating/mod.ts'),
    },
    {
      name: './templating/mod.js',
      path: fromStd('templating/mod.ts'),
    },
    {
       name: './text/string-builder',
        path: fromStd('text/string-builder.ts'),
    },
    {
      name: './text/string-builder.js',
       path: fromStd('text/string-builder.ts'),
    },
    {
      name: './text/encoding/hex',
      path: fromStd('text/encoding/hex.ts'),
    },
    {
      name: './text/encoding/hex.js',
      path: fromStd('text/encoding/hex.ts'),
    },
    {
      name: './primitives/char',
      path: fromStd('primitives/char.ts'),
    },
    {
      name: './primitives/char.js',
      path: fromStd('primitives/char.ts'),
    },
    {
      name: './primitives/uuid',
      path: fromStd('primitives/uuid.ts'),
    },
    {
      name: './primitives/uuid.js',
      path: fromStd('primitives/uuid.ts'),
    },
    {
        name: './primitives/string-utils',
        path: fromStd('primitives/string-utils.ts'),
    },
    {
        name: './primitives/string-utils.js',
        path: fromStd('primitives/string-utils.ts'),
    },
    {
      name: "./runtime",
      path: fromStd('runtime/mod.ts'),
    },
    {
      name: "./runtime/mod.js",
      path: fromStd('runtime/mod.ts'),
    },
    {
      name: "./runtime/version",
      path: fromStd('runtime/version.ts'),
    },
    {
      name: "./runtime/version.js",
      path: fromStd('runtime/version.ts'),
    },
    {
      name: "./runtime/semantic-version",
      path: fromStd('runtime/semantic-version.ts'),
    },
    {
      name: "./runtime/semantic-version.js",
      path: fromStd('runtime/semantic-version.ts'),
    },
    {
      name: "./path",
      path: fromStd('path/mod.ts'),
    },
    {
      name: "./path/mod.js",
      path: fromStd('path/mod.ts'),
    },
    {
      name: './env',
      path: fromStd('env/mod.ts'),
    },
    {
      name: './env/mod.js',
      path: fromStd('env/mod.ts'),
    },
    {
      name: './env/variables',
      path: fromStd('env/variables.ts'),
    },
    {
      name: './env/variables.js',
      path: fromStd('env/variables.ts'),
    },
    {
        name: './env/supports-color',
        path: fromStd('env/supports-color.ts'),
    },
    {
      name: './env/supports-color.js',
      path: fromStd('env/supports-color.ts'),
    },
    {
      name: "./fs",
      path: fromStd('fs/mod.ts'),
    },
    {
      name: "./fs/mod.js",
      path: fromStd('fs/mod.ts'),
    },
    {
      name: "./process",
      path: fromStd('process/mod.ts'),
    },
    {
      name: "./process/mod.js",
      path: fromStd('process/mod.ts'),
    },
    {
      name: "./process/which",
      path: fromStd('process/which.ts'),
    },
    {
      name: "./process/which.js",
      path: fromStd('process/which.ts'),
    }
  ],
  packageManager: 'yarn',
  outDir: `${moduleDir}/std`,
  compilerOptions: {
    target: "ES2021",
    lib: ['dom', 'dom.iterable', 'es2021'],
    sourceMap: true,
  },
  'importMap': `${root}/import_mappings.json`,
  shims: {
    // see JS docs for overview and more options
    deno: {
        test: "dev",
    },
    "weakRef": true,
    blob: true,
  },
  package: Object.assign(packageJson, {

  }),
});



// post build steps
Deno.copyFileSync(fromStd('LICENSE'), `${moduleDir}/std/LICENSE`);
Deno.copyFileSync(fromStd('README.md'), `${moduleDir}/std/README.md`);
Deno.copyFileSync(fromStd('CHANGELOG.md'), `${moduleDir}/std/CHANGELOG.md`);