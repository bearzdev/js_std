# JavaScript Standard Library

JavaScript Standard Library for Deno, Node, and the Browser.  The browser may not be
supported for every API e.g. fs and process.

The std, buildfx libraries are built in a way that you don't have to reference node
or Deno core APIs so that you can build libraries that work in either runtime.

Similar to .NET, the standard library is meant to be multiple modules.  The
std module is meant to function like System.Private.CoreLib

## Getting started

You'll need to install Deno and the Deno Vs Code extension.  If you're on windows, this can be done
with `choco install deno -y`.

- Installing Deno: <https://deno.land/manual/getting_started/installation>
- VS Code: <https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno>
- JetBrains: (rider, webstorm, etc): <https://plugins.jetbrains.com/plugin/14382-deno>

## Deno Tasks

- `deno task fmt` - formats the source code.
- `deno task build:std` - transforms the `src/std` module into the node module `npm/modules/std`.
- `deno task build:buildfx` transforms the `src/buildfx` module into the node module `npm/modules/buildfx`.
- `deno task test` runs all the tests.

## Rationale

Deno:

- runs typescript directly
- has a single executable
- runs tests quickly
- can convert a Deno ES6 module into an npm package using the Deno-To-Node ("DNT") tool. 
- focuses on using web standards APIs where possible like AbortSignal, fetch, etc.
- ES6 enables you to write larger modules.
- Enables test modules to live next to the source modules similar to go.

This pushes the written code to use standards and it is faster to iterate on. The downside
is that Deno doesn't yet have full compatibility with Node Js.

The majority of the std library is a remix of Deno's standard library code to ship it
as a node module without the Deno To Node ("DNT") tool packaging a huge
part of the Deno std into a node module into the source for every module/package that
references it.  If there was a node package for Deno's std or an existing std library,
this most likely wouldn't be necessary.

## Attribution

- src/primitives/char.ts - MIT: dotnet/runtime, microsoft <https://github.com/denoland/deno_std>
- src/env/support-colors - MIT: chalk0 <https://github.com/denoland/deno_std>
- src/std/fmt/colors - MIT: Deno Authors <https://github.com/denoland/deno_std>
- src/std/path - MIT: Deno Authors <https://github.com/denoland/deno_std>
- src/std/dotenv - MIT: Deno Authors <https://github.com/denoland/deno_std>
- src/std/text/encoding/hex - MIT: Deno Authors <https://github.com/denoland/deno_std>
- src/process/ - Apache2-0  Bearz <https://github.com/bearzdev/bearz>
- src/env - Apache2-0  Bearz <https://github.com/bearzdev/bearz>
- src/secrets/generator - Apache2-0  Bearz <https://github.com/bearzdev/bearz>
- src/secrets/masker - Apache2-0  Bearz <https://github.com/bearzdev/bearz>