import { resolve, fromFileUrl, dirname, join, } from 'https://deno.land/std@$STD_VERSION/path/mod.ts';
import { build, emptyDir } from "https://deno.land/x/dnt@0.27.0/mod.ts";

const __file = fromFileUrl(import.meta.url);
const __dirname = dirname(__file);
const root = resolve(__dirname, '..');
const moduleDir = resolve(root, 'npm/modules');
const src = resolve(__dirname, "../src");
const std = join(src, 'buildfx');

function fromStd(path: string) {
    return join(std, path);
}

Deno.copyFileSync(`${root}/LICENSE`, `${std}/LICENSE`);

let text = await Deno.readTextFile(join(root, 'config', 'buildfx.package.json'));
const packageJson = JSON.parse(text);

text = await Deno.readTextFile(join(root, 'config', 'std.package.json')); 
const stdPackageJson = JSON.parse(text);

const stdName = stdPackageJson.name;
const stdVersion = stdPackageJson.version;

await emptyDir(`${moduleDir}/buildfx`);

const deps : { [key: string]: string } = {};
deps[stdName] = stdVersion;

Deno.chdir(std);

await build({
  mappings: {
    "../std/errors/mod.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'errors/mod.js',
    },
    "../std/path/mod.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'path/mod.js',
    },
    "../std/fs/mod.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'fs/mod.js',
    },
    "../std/random/mod.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'random/mod.js',
    },
    "../std/env/mod.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'env/mod.js',
    },
    "../std/secrets/mod.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'secrets/mod.js',
    },
    "../std/runtime/mod.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'runtime/mod.js',
    },
    "../std/process/mod.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'process/mod.js',
    },
    "../std/text/string-builder.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'text/string-builder.js',
    },
    "../std/text/encoding/hex.ts": {
        name: stdName,
        version: stdVersion,
        subPath: 'text/encoding/hex.js',
    },
  },
  rootTestDir: std,
  scriptModule: false,
  typeCheck: false,
  entryPoints: [
    fromStd('mod.ts'),
    {
        name: './apt',
        path: fromStd('bash/mod.ts'),
    },
    {
        name: './apt/mod.js',
        path: fromStd('bash/mod.ts'),
    },
    {
        name: './bash',
        path: fromStd('bash/mod.ts'),
    },
    {
        name: './bash/mod.js',
        path: fromStd('bash/mod.ts'),
    },
    {
        name: './util',
        path: fromStd('util/mod.ts'),
    },
    {
        name: './util/mod.js',
        path: fromStd('util/mod.ts'),
    },
    {
        name: './choco',
        path: fromStd('choco/mod.ts'),
    },
    {
        name: './choco/mod.js',
        path: fromStd('choco/mod.ts'),
    },
    {
        name: './docker',
        path: fromStd('docker/mod.ts'),
    },
    {
        name: './docker/mod.js',
        path: fromStd('docker/mod.ts'),
    },
    {
        name: './docker-compose',
        path: fromStd('docker/mod.ts'),
    },
    {
        name: './docker-compose/mod.js',
        path: fromStd('docker/mod.ts'),
    },
    {
        name: './dotnet',
        path: fromStd('dotnet/mod.ts'),
    },
    {
        name: './dotnet/mod.js',
        path: fromStd('dotnet/mod.ts'),
    },
    {
        name: './git',
        path: fromStd('git/mod.ts'),
    },
    {
        name: './git/mod.js',
        path: fromStd('git/mod.ts'),
    },
    {
        name: './node',
        path: fromStd('node/mod.ts'),
    },
    {
        name: './node/mod.js',
        path: fromStd('node/mod.ts'),
    },
    {
        name: './nvs',
        path: fromStd('nvs/mod.ts'),
    },
    {
        name: './nvs/mod.js',
        path: fromStd('nvs/mod.ts'),
    },
    {
        name: './pipelines',
        path: fromStd('pipelines/mod.ts'),
    },
    {
        name: './pipelines/mod.js',
        path: fromStd('pipelines/mod.ts'),
    },
    {
        name: './powershell',
        path: fromStd('powershell/mod.ts'),
    },
    {
        name: './powershell/mod.js',
        path: fromStd('powershell/mod.ts'),
    },
    {
        name: './pwsh',
        path: fromStd('pwsh/mod.ts'),
    },
    {
        name: './pwsh/mod.js',
        path: fromStd('pwsh/mod.ts'),
    },
    {
        name: './scoop',
        path: fromStd('scoop/mod.ts'),
    },
    {
        name: './scoop/mod.js',
        path: fromStd('scoop/mod.ts'),
    },
    {
        name: './scripting',
        path: fromStd('scripting/mod.ts'),
    },
    {
        name: './scripting/mod.js',
        path: fromStd('scripting/mod.ts'),
    },
    {
        name: './secret-store',
        path: fromStd('secret-store/mod.ts'),
    },
    {
        name: './secret-store/mod.js',
        path: fromStd('secret-store/mod.ts'),
    },
    {
        name: './terraform',
        path: fromStd('terraform/mod.ts'),
    },
    {
        name: './terraform/mod.js',
        path: fromStd('terraform/mod.ts'),
    },
    {
        name: './usql',
        path: fromStd('usql/mod.ts'),
    },
    {
        name: './usql/mod.js',
        path: fromStd('usql/mod.ts'),
    },
    {
        name: './winget',
        path: fromStd('winget/mod.ts'),
    },
    {
        name: './winget/mod.js',
        path: fromStd('winget/mod.ts'),
    },
  ],
  packageManager: 'yarn',
  outDir: `${moduleDir}/buildfx`,
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
  package: Object.assign(packageJson, deps, {
    
  })
});



// post build steps
Deno.copyFileSync(fromStd('LICENSE'), `${moduleDir}/buildfx/LICENSE`);
Deno.copyFileSync(fromStd('README.md'), `${moduleDir}/buildfx/README.md`);
Deno.copyFileSync(fromStd('CHANGELOG.md'), `${moduleDir}/buildfx/CHANGELOG.md`);