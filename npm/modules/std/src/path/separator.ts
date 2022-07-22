// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isWindows } from '../runtime/mod.js';

export const DIRECTORY_SEPARATOR = isWindows ? '\\' : '/';
export const DIRECTORY_ALT_SEPARATOR = '/';
export const VOLUME_SEPARATOR = isWindows ? ':' : '/';
export const PATH_SEPARATOR = isWindows ? ';' : ':';
export const SEP = isWindows ? '\\' : '/';
export const SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;
