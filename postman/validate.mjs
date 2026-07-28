#!/usr/bin/env node
// Validates the Postman collection + environment for incubator-service.
// - JSON syntax
// - every request `url` is a string (not an object)
// - prints a method / auth / url table
// - optional: cross-checks collection routes against the live Swagger doc (/api-json)
//
// Usage:
//   node postman/validate.mjs            # JSON + URL checks, then Swagger cross-check if server is up
//   SKIP_SMOKE=1 node postman/validate.mjs   # skip the Swagger cross-check

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const collectionPath = join(here, 'incubator-service.postman_collection.json');
const envPath = join(here, 'incubator-local.postman_environment.json');

function fail(msg) {
  console.error('FAIL:', msg);
  process.exitCode = 1;
}

// --- 1. JSON syntax ---
console.log('=== JSON syntax ===');
let collection;
let env;
try {
  collection = JSON.parse(readFileSync(collectionPath, 'utf8'));
  env = JSON.parse(readFileSync(envPath, 'utf8'));
  console.log('OK');
} catch (err) {
  fail(`JSON parse error: ${err.message}`);
  process.exit(1);
}

// --- 2. Walk requests: URL must be a string; collect route table ---
console.log('\n=== URL format (must be strings) + route table ===');
const routes = [];
const bad = [];

function authType(request) {
  if (!request.auth || !request.auth.type) return 'inherit';
  return request.auth.type;
}

function walk(items, folder = '') {
  for (const item of items) {
    if (Array.isArray(item.item)) {
      walk(item.item, item.name);
    } else if (item.request) {
      const url = item.request.url;
      const method = item.request.method || 'GET';
      const auth = authType(item.request);
      if (typeof url !== 'string') {
        bad.push(`${folder}/${item.name}: url is ${typeof url}, not string`);
        continue;
      }
      routes.push({ method, auth, url });
      console.log(`  ${method.padEnd(6)} auth=${auth.padEnd(7)} ${url}`);
    }
  }
}
walk(collection.item);

if (bad.length) {
  for (const b of bad) fail(b);
} else {
  console.log('All URLs are strings: OK');
}

// --- 3. Environment base_url ---
console.log('\n=== Environment base_url ===');
const values = Object.fromEntries((env.values || []).map((v) => [v.key, v.value]));
const base = values.base_url || '';
if (base && !base.endsWith('/')) {
  console.log(`  ${env.name}: ${base} OK`);
} else {
  fail(`${env.name}: base_url empty or has trailing slash ("${base}")`);
}

// --- 4. Optional Swagger cross-check ---
async function swaggerCrossCheck() {
  if (process.env.SKIP_SMOKE === '1') {
    console.log('\n=== Swagger cross-check ===\n  skipped (SKIP_SMOKE=1)');
    return;
  }
  console.log('\n=== Swagger cross-check (/api-json) ===');
  const specUrl = `${base}/api-json`;
  let spec;
  try {
    const res = await fetch(specUrl, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) {
      console.log(`  skipped (GET ${specUrl} -> HTTP ${res.status}; is the server running?)`);
      return;
    }
    spec = await res.json();
  } catch (err) {
    console.log(`  skipped (server not reachable at ${base}: ${err.message})`);
    return;
  }

  // Swagger paths -> set of "METHOD /path" using express-style params.
  const swaggerRoutes = new Set();
  for (const [p, methods] of Object.entries(spec.paths || {})) {
    for (const m of Object.keys(methods)) {
      swaggerRoutes.add(`${m.toUpperCase()} ${p}`);
    }
  }

  // Normalize a collection URL into "METHOD /path" with :params -> {param}.
  const normalize = (method, url) => {
    let path = url.replace('{{base_url}}', '').split('?')[0];
    // {{var}} -> {var}
    path = path.replace(/\{\{(\w+)\}\}/g, '{$1}');
    return `${method.toUpperCase()} ${path}`;
  };

  // Swagger uses {id}; collection uses {{blog_id}} etc. Compare by path shape,
  // treating any {…} segment as a wildcard.
  const shape = (route) => route.replace(/\{[^/}]+\}/g, '{*}');
  const swaggerShapes = new Set([...swaggerRoutes].map(shape));

  const missing = [];
  for (const r of routes) {
    const norm = shape(normalize(r.method, r.url));
    if (!swaggerShapes.has(norm)) missing.push(norm);
  }

  if (missing.length) {
    console.log('  Collection routes NOT found in Swagger:');
    for (const m of [...new Set(missing)]) console.log(`    - ${m}`);
    fail('collection has routes missing from Swagger');
  } else {
    console.log(
      `  OK (${routes.length} collection routes matched against ${swaggerRoutes.size} Swagger routes)`,
    );
  }
}

await swaggerCrossCheck();

console.log('\nValidation complete.');
if (process.exitCode) {
  console.error('Validation FAILED.');
} else {
  console.log('All checks passed.');
}
