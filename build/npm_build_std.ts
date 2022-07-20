import { resolve, fromFileUrl, dirname, join, } from 'https://deno.land/std@$STD_VERSION/path/mod.ts';
import { build, emptyDir } from "https://deno.land/x/dnt@0.27.0/mod.ts";
import { VERSION as stdVersion } from '../src/std/mod.ts';



const __file = fromFileUrl(import.meta.url);
const __dirname = dirname(__file);
const root = resolve(__dirname, '..');
const moduleDir = resolve(root, '_node/modules');
const src = resolve(__dirname, "../src");
const std = join(src, 'std');
console.log('src', src);
console.log('std', std);
console.log('moduleDir', moduleDir);

function fromStd(path: string) {
    return join(std, path);
}

await emptyDir(`${moduleDir}/std`);

Deno.chdir(std);


await build({
  mappings: {},
  rootTestDir: std,

  entryPoints: [
    fromStd('mod.ts'),
    {
      name: './errors',
      path: fromStd('errors/mod.ts'),
    },
    {
      name: './g11n',
      path: fromStd('g11n/mod.ts'),
    },
    {
      name: './random',
      path: fromStd('random/mod.ts'),
    },
    {
      name: './secrets',
      path: fromStd('secrets/mod.ts'),
    },
    {
      name: './templating',
      path: fromStd('templating/mod.ts'),
    },
    {
       name: './text/string-builder',
        path: fromStd('text/string-builder.ts'),
    },
    {
      name: './text/encoding/hex',
      path: fromStd('text/encoding/hex.ts'),
    },
    {
      name: './primitives/char',
      path: fromStd('primitives/char.ts'),
    },
    {
      name: './primitives/uuid',
      path: fromStd('primitives/uuid.ts'),
    },
    {
        name: './primitives/string-utils',
        path: fromStd('primitives/string-utils.ts'),
    },
    {
      name: "./runtime",
      path: fromStd('runtime/mod.ts'),
    },
    {
      name: "./path",
      path: fromStd('path/mod.ts'),
    },
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
  package: {
    // package.json properties
    name: "@bearz/std",
    version: stdVersion,
    description: "Standard Library for Deno, Node, and the Browser",
    license: "APACHE-2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/username/repo.git",
    },
    bugs: {
      url: "https://github.com/username/repo/issues",
    },
  },
});



// post build steps
Deno.copyFileSync(fromStd('LICENSE'), `${moduleDir}/std/LICENSE`);
Deno.copyFileSync(fromStd('README.md'), `${moduleDir}/std/README.md`);
Deno.copyFileSync(fromStd('CHANGELOG.md'), `${moduleDir}/std/CHANGELOG.md`);