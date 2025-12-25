/**
 * OpenAPI bundler (SSOT = per-service specs, bundle = artefact).
 *
 * ADR: docs/decisions/adr_0014_openapi_ssot_and_bundling.md
 *
 * Bundling rules (minimal, safe):
 * - Base = docs/openapi/openapi.yaml (global metadata + shared components)
 * - Merge in per-service specs:
 *   - docs/openapi/auth.yaml
 *   - docs/openapi/content.yaml
 *   - docs/openapi/points.yaml
 *   - docs/openapi/referral.yaml
 * - Include only /v1/* and /internal/* paths in bundle (exclude /health and /version to avoid collisions).
 * - Merge components; throw on conflicting definitions (except HealthResponse examples).
 *
 * Output:
 * - docs/openapi/openapi.bundle.yaml
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse, stringify } from 'yaml';

const REPO_ROOT = process.cwd();

const BASE_PATH = path.join(REPO_ROOT, 'docs', 'openapi', 'openapi.yaml');
const OUT_PATH = path.join(REPO_ROOT, 'docs', 'openapi', 'openapi.bundle.yaml');
const SERVICE_SPECS = [
  path.join(REPO_ROOT, 'docs', 'openapi', 'auth.yaml'),
  path.join(REPO_ROOT, 'docs', 'openapi', 'content.yaml'),
  path.join(REPO_ROOT, 'docs', 'openapi', 'points.yaml'),
  path.join(REPO_ROOT, 'docs', 'openapi', 'referral.yaml'),
];

function readYaml(filePath) {
  return parse(fs.readFileSync(filePath, 'utf8'));
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function sortObjectKeys(value) {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (!isPlainObject(value)) return value;

  const out = {};
  for (const key of Object.keys(value).sort()) {
    out[key] = sortObjectKeys(value[key]);
  }
  return out;
}

function mergeMap({ target, source, label, allowExampleDiff = false }) {
  for (const [k, v] of Object.entries(source ?? {})) {
    if (!(k in target)) {
      target[k] = v;
      continue;
    }

    const existing = target[k];
    if (deepEqual(existing, v)) continue;

    // Special-cases: these commonly differ only by examples/descriptions across services.
    // Keep the first one (target) to stay deterministic.
    if (
      allowExampleDiff &&
      (k === 'HealthResponse' ||
        k === 'ErrorResponse' ||
        k === 'GatewayAuth' ||
        k === 'ServiceAuth' ||
        k === 'BearerAuth' ||
        k === 'XGatewayAuth' ||
        k === 'XUserId' ||
        k === 'XRequestId' ||
        k === 'Unauthorized' ||
        k === 'NotFound' ||
        k === 'Conflict' ||
        k === 'InternalError')
    ) {
      // Keep the first one (target) to stay deterministic.
      continue;
    }

    throw new Error(`OpenAPI bundle conflict in ${label}: key=${k}`);
  }
}

function mergeTags(targetTags, sourceTags) {
  const byName = new Map((targetTags ?? []).map((t) => [t?.name, t]));
  for (const t of sourceTags ?? []) {
    if (!t?.name) continue;
    if (!byName.has(t.name)) byName.set(t.name, t);
  }
  return Array.from(byName.values());
}

function filterPaths(pathsObj) {
  const out = {};
  for (const [p, item] of Object.entries(pathsObj ?? {})) {
    if (p === '/health' || p === '/version') continue;
    if (p.startsWith('/v1/') || p.startsWith('/internal/')) out[p] = item;
  }
  return out;
}

function main() {
  const base = readYaml(BASE_PATH);
  base.paths = base.paths && typeof base.paths === 'object' ? base.paths : {};

  const out = structuredClone(base);
  out.paths = {};
  out.tags = out.tags ?? [];
  out.components = out.components ?? {};

  for (const specPath of SERVICE_SPECS) {
    const doc = readYaml(specPath);

    // tags
    out.tags = mergeTags(out.tags, doc.tags);

    // paths (filtered)
    const filtered = filterPaths(doc.paths);
    mergeMap({ target: out.paths, source: filtered, label: `paths from ${path.basename(specPath)}` });

    // components
    if (doc.components) {
      out.components.securitySchemes = out.components.securitySchemes ?? {};
      out.components.schemas = out.components.schemas ?? {};
      out.components.parameters = out.components.parameters ?? {};
      out.components.responses = out.components.responses ?? {};

      mergeMap({
        target: out.components.securitySchemes,
        source: doc.components.securitySchemes,
        label: `components.securitySchemes from ${path.basename(specPath)}`,
        allowExampleDiff: true,
      });
      mergeMap({
        target: out.components.parameters,
        source: doc.components.parameters,
        label: `components.parameters from ${path.basename(specPath)}`,
        allowExampleDiff: true,
      });
      mergeMap({
        target: out.components.responses,
        source: doc.components.responses,
        label: `components.responses from ${path.basename(specPath)}`,
        allowExampleDiff: true,
      });
      mergeMap({
        target: out.components.schemas,
        source: doc.components.schemas,
        label: `components.schemas from ${path.basename(specPath)}`,
        allowExampleDiff: true,
      });
    }
  }

  // Deterministic ordering
  const sorted = sortObjectKeys(out);
  const body = stringify(sorted, { lineWidth: 0 });
  const header = `# GENERATED FILE — DO NOT EDIT\n# Source: ${[
    path.relative(REPO_ROOT, BASE_PATH),
    ...SERVICE_SPECS.map((p) => path.relative(REPO_ROOT, p)),
  ].join(', ')}\n\n`;

  fs.writeFileSync(OUT_PATH, header + body, 'utf8');
  process.stdout.write(`OpenAPI bundle written: ${path.relative(REPO_ROOT, OUT_PATH)}\n`);
}

main();

