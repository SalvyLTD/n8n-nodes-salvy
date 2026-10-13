#!/usr/bin/env node
// Refreshes openapi/salvy-v3.json from the public Salvy docs. No auth needed.
// Usage: node scripts/refresh-spec.mjs [url]   (then: npm run generate)

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_URL = 'https://docs.salvy.com.br/api-reference/v3/openapi.json';
const url = process.argv[2] ?? DEFAULT_URL;
const out = join(dirname(fileURLToPath(import.meta.url)), '../openapi/salvy-v3.json');

const res = await fetch(url);
if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
const spec = await res.json();
if (!spec.openapi || !spec.paths) throw new Error(`${url} is not an OpenAPI document`);
writeFileSync(out, `${JSON.stringify(spec, null, 2)}\n`);
console.log(`Wrote ${out} (${Object.keys(spec.paths).length} paths, OpenAPI ${spec.openapi})`);
