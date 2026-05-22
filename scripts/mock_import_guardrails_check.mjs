#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readdir, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const baselinePath = path.join(repoRoot, 'scripts', 'guardrails', 'mock_import_baseline.json');
const appRoot = path.join(repoRoot, 'apps', 'go2asia-pwa-shell', 'app');
const componentsRoot = path.join(repoRoot, 'apps', 'go2asia-pwa-shell', 'components');
const args = new Set(process.argv.slice(2));

const ruleHints = {
  APP_ROUTE_MOCK_IMPORT:
    'Keep route/runtime surfaces away from mock corpora. Quarantine or replace in a dedicated Stage 12I-A2/A3 slice, or add a reviewed baseline entry if this is existing debt.',
  PUBLIC_BARREL_MOCK_EXPORT:
    'Do not expose mock corpora through public component barrels. Stage 12I-A2 owns barrel containment.',
};

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function relativePath(filePath) {
  return toPosix(path.relative(repoRoot, filePath));
}

function findingKey(finding) {
  return `${finding.ruleId}|${finding.file}|${finding.source}`;
}

function isCodeFile(filePath) {
  return /\.(ts|tsx|js|jsx)$/.test(filePath) && !/\.(test|spec)\./.test(filePath);
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'coverage', 'test-results'].includes(entry.name)) {
        continue;
      }
      files.push(...(await walkFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && isCodeFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineNumberForIndex(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function appMockOwner(source, file) {
  if (source.includes('quest/mockQuests')) return '12I-A3 / Stage 12.x.3-C';
  if (source.includes('pulse/mockEvents')) return '12I-A2 / Stage 12.x.3-A';
  if (source.includes('guru/mockObjects')) return '12I-A2 / Stage 12.x.3-A';
  if (source.includes('rieltSeedRepo') || source.includes('useRieltSeed')) return '12I-A3 / Rielt seed source-label slice';
  if (source === '@/mocks/repo') return '12I-A3 / Stage 12.x.3-D';
  return '12I-A3';
}

function isDangerousAppMockSource(source) {
  if (source === '@/mocks/dto') {
    return false;
  }

  if (source === '@/mocks/repo') {
    return true;
  }

  if (source.includes('rieltSeedRepo') || source.includes('useRieltSeed')) {
    return true;
  }

  return /(^|\/)(mockData|mockQuests|mockListings|mockEvents|mockObjects|mockPartners|mockVerifications)$/.test(
    source
  );
}

function isMockBarrelSource(source) {
  return /(^|\/)(mockData|mockQuests|mockListings|mockEvents|mockObjects|mockPartners|mockVerifications)$/.test(
    source
  );
}

async function collectAppRouteFindings() {
  const findings = [];
  const files = await walkFiles(appRoot);
  const importRegex = /^\s*import(?:\s+type)?[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/gm;

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8');
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const source = match[1];
      if (!isDangerousAppMockSource(source)) {
        continue;
      }

      findings.push({
        ruleId: 'APP_ROUTE_MOCK_IMPORT',
        file: relativePath(filePath),
        line: lineNumberForIndex(content, match.index),
        source,
        match: match[0].replace(/\s+/g, ' ').trim(),
        ownerSlice: appMockOwner(source, relativePath(filePath)),
        note: 'Existing route/runtime mock exposure; guardrail freezes spread before cleanup.',
      });
    }
  }

  return findings;
}

async function collectBarrelFindings() {
  const findings = [];
  const files = await walkFiles(componentsRoot);
  const barrelFiles = files.filter((filePath) => path.basename(filePath) === 'index.ts');
  const exportRegex = /export\s+(?:\{[\s\S]*?\}|\*)\s+from\s+['"]([^'"]+)['"]/g;

  for (const filePath of barrelFiles) {
    const content = await readFile(filePath, 'utf8');
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      const source = match[1];
      if (!isMockBarrelSource(source)) {
        continue;
      }

      findings.push({
        ruleId: 'PUBLIC_BARREL_MOCK_EXPORT',
        file: relativePath(filePath),
        line: lineNumberForIndex(content, match.index),
        source,
        match: match[0].replace(/\s+/g, ' ').trim(),
        ownerSlice: '12I-A2 / Stage 12.x.3-A',
        note: 'Public barrel mock exposure; allowed as baseline debt until barrel containment slice.',
      });
    }
  }

  return findings;
}

async function collectFindings() {
  const findings = [...(await collectAppRouteFindings()), ...(await collectBarrelFindings())];
  return findings.sort((a, b) => findingKey(a).localeCompare(findingKey(b)));
}

function readBaseline() {
  if (!existsSync(baselinePath)) {
    return { version: 1, scope: 'apps/go2asia-pwa-shell', findings: [] };
  }

  return JSON.parse(readFileSync(baselinePath, 'utf8'));
}

async function writeBaseline(findings) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  const payload = {
    version: 1,
    scope: 'apps/go2asia-pwa-shell',
    policy:
      'Stage 12I-A1 baseline freezes existing mock import/barrel debt. New findings must be fixed or explicitly reviewed.',
    findings: findings.map((finding) => ({
      id: findingKey(finding),
      ruleId: finding.ruleId,
      file: finding.file,
      source: finding.source,
      ownerSlice: finding.ownerSlice,
      note: finding.note,
    })),
  };

  writeFileSync(baselinePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function compareFindings(currentFindings, baseline) {
  const baselineByKey = new Map((baseline.findings ?? []).map((entry) => [entry.id ?? findingKey(entry), entry]));
  const currentByKey = new Map(currentFindings.map((finding) => [findingKey(finding), finding]));

  return {
    newFindings: currentFindings.filter((finding) => !baselineByKey.has(findingKey(finding))),
    staleBaseline: [...baselineByKey.keys()].filter((key) => !currentByKey.has(key)),
    allowedFindings: currentFindings.filter((finding) => baselineByKey.has(findingKey(finding))),
  };
}

function printFinding(finding, prefix = '  ') {
  console.log(`${prefix}[${finding.ruleId}] ${finding.file}:${finding.line}`);
  console.log(`${prefix}  source: ${finding.source}`);
  console.log(`${prefix}  match: ${finding.match}`);
  console.log(`${prefix}  owner: ${finding.ownerSlice}`);
  console.log(`${prefix}  hint: ${ruleHints[finding.ruleId]}`);
}

async function main() {
  const findings = await collectFindings();

  if (args.has('--update-baseline')) {
    await writeBaseline(findings);
    console.log(`Updated mock import guardrail baseline: ${baselinePath}`);
    console.log(`Baseline findings: ${findings.length}`);
    return;
  }

  const baseline = readBaseline();
  const { newFindings, staleBaseline, allowedFindings } = compareFindings(findings, baseline);

  if (args.has('--list-new')) {
    newFindings.forEach((finding) => printFinding(finding));
    return;
  }

  if (newFindings.length === 0 && staleBaseline.length === 0) {
    console.log('Mock import guardrails passed.');
    console.log(`Allowed baseline findings: ${allowedFindings.length}`);
    if (args.has('--verbose')) {
      allowedFindings.forEach((finding) => printFinding(finding));
    }
    return;
  }

  console.error('Mock import guardrails failed.');

  if (newFindings.length > 0) {
    console.error(`\nNew findings (${newFindings.length}) must be fixed or reviewed into baseline:`);
    newFindings.forEach((finding) => printFinding(finding, '  '));
  }

  if (staleBaseline.length > 0) {
    console.error(`\nStale baseline entries (${staleBaseline.length}) should be removed with --update-baseline:`);
    staleBaseline.forEach((key) => console.error(`  ${key}`));
  }

  console.error('\nThis guardrail is containment only: do not delete/move mocks or rename routes in Stage 12I-A1.');
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
