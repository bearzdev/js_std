# Design Notes

initial design notes.

## Modules

All source code shall use es6 modules to enable support for Deno.

### Names

- Module names for Deno will use underscores due to the limitations of deno.land/x module naming and Deno's affinity
for rust/go naming conventions.
- All internal code shall be prefixed with an underscore for a file name and shall not be exported in mod.ts
- All utility methods shall go into a `util.ts` or `_util.ts` file.

### exports

Module exports shall use only named exports to enable tree shaking and allow a consistent expectation for importing
modules.

### interfaces

- All shared interfaces for module shall go into an interfaces.ts file.  

### errors

- All errors for a module shall go into an errors.ts file.
