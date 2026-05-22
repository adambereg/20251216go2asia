#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
]);

const scannableExtensions = new Set([
  '.env',
  '.example',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.ps1',
  '.sh',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);

const explicitWarningMarkers = [
  'dev/demo',
  'dev-only',
  'demo only',
  'demo-only',
  'excluded from smoke',
  'excluded from proof',
  'invalidates smoke',
  'invalid for smoke',
  'local demo',
  'mock mode = dev',
  'mock mode != smoke',
  'not evidence',
  'not proof',
  'not valid for smoke',
  'только dev',
  'только demo',
  'не является proof',
  'не является evidence',
  'не подходит для smoke',
];

const mockEnvPatterns = [
  /NEXT_PUBLIC_DATA_SOURCE\s*[:=]\s*['"]?mock\b/gi,
  /\bDATA_SOURCE\s*=\s*['"]?mock\b/gi,
];

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function relativePath(filePath) {
  return toPosix(path.relative(repoRoot, filePath));
}

function isScannableFile(filePath) {
  const basename = path.basename(filePath);
  if (basename.startsWith('.env')) return true;
  return scannableExtensions.has(path.extname(filePath));
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }
      files.push(...(await walkFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && isScannableFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineNumberForIndex(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function lineAt(content, lineNumber) {
  return content.split(/\r?\n/)[lineNumber - 1] ?? '';
}

function contextAround(content, lineNumber, radius = 5) {
  const lines = content.split(/\r?\n/);
  const start = Math.max(0, lineNumber - 1 - radius);
  const end = Math.min(lines.length, lineNumber + radius);
  return lines.slice(start, end).join('\n').toLowerCase();
}

function isCommentOnlyLine(line) {
  return /^\s*(#|\/\/|\*)/.test(line);
}

function hasExplicitWarning(content, lineNumber) {
  const context = contextAround(content, lineNumber);
  return explicitWarningMarkers.some((marker) => context.includes(marker));
}

function pathHasEvidenceContext(file) {
  return /(^|\/)(deploy|scripts|test-results|docs\/ops|docs\/runbooks|docs\/runtime)(\/|$)/.test(file);
}

function pathHasSmokeOrReleaseContext(file) {
  return /(smoke|staging|prod|production|evidence|runbook|deploy)/i.test(file);
}

function isLocalEnvFile(file) {
  return /(^|\/)\.env(\..*)?\.local$/.test(file) || /(^|\/)\.env\.local$/.test(file);
}

function isEnvExample(file) {
  return /(^|\/)\.env(\..*)?$/.test(file) && !isLocalEnvFile(file);
}

function classifyFinding({ file, content, lineNumber }) {
  const line = lineAt(content, lineNumber);
  const hasWarning = hasExplicitWarning(content, lineNumber);

  if (file.startsWith('.github/workflows/')) {
    return {
      level: 'error',
      ruleId: 'MOCK_ENV_IN_WORKFLOW',
      note: 'GitHub workflows must not set mock data source for CI, staging, production or smoke evidence.',
    };
  }

  if (file.startsWith('test-results/')) {
    return {
      level: 'error',
      ruleId: 'MOCK_ENV_IN_EVIDENCE_ARTIFACT',
      note: 'Smoke/staging/production evidence artifacts must not terminate at mock data source.',
    };
  }

  if (isEnvExample(file) && !isCommentOnlyLine(line)) {
    return {
      level: 'error',
      ruleId: 'MOCK_ENV_AS_ENV_DEFAULT',
      note: 'Shared env examples must not set mock as an active default. Keep mock mode documented as local dev/demo only.',
    };
  }

  if (pathHasEvidenceContext(file) && pathHasSmokeOrReleaseContext(file)) {
    if (hasWarning) {
      return {
        level: 'warn',
        ruleId: 'MOCK_ENV_POLICY_REFERENCE',
        note: 'Allowed policy reference with explicit not-smoke/not-proof warning.',
      };
    }

    return {
      level: 'error',
      ruleId: 'MOCK_ENV_IN_EVIDENCE_CONTEXT',
      note: 'Mock data source cannot appear in smoke/staging/production evidence context without an explicit invalid-for-evidence warning.',
    };
  }

  if (file.startsWith('apps/go2asia-pwa-shell/mocks/') || hasWarning || isCommentOnlyLine(line)) {
    return {
      level: 'warn',
      ruleId: 'MOCK_ENV_DEV_DEMO_REFERENCE',
      note: 'Allowed dev/demo or policy reference. Mock mode remains invalid for smoke/prod evidence.',
    };
  }

  return {
    level: 'warn',
    ruleId: 'MOCK_ENV_REFERENCE_REVIEW',
    note: 'Mock env reference found outside forbidden paths; review wording if this becomes evidence-related.',
  };
}

function collectMatches(file, content) {
  const findings = [];

  for (const pattern of mockEnvPatterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lineNumber = lineNumberForIndex(content, match.index);
      const classification = classifyFinding({ file, content, lineNumber });
      findings.push({
        ...classification,
        file,
        line: lineNumber,
        match: lineAt(content, lineNumber).trim(),
      });
    }
  }

  return findings;
}

function printFinding(finding, prefix = '  ') {
  console.log(`${prefix}[${finding.level.toUpperCase()}][${finding.ruleId}] ${finding.file}:${finding.line}`);
  console.log(`${prefix}  match: ${finding.match}`);
  console.log(`${prefix}  note: ${finding.note}`);
  console.log(`${prefix}  remediation: Use API/runtime mode for smoke/staging/prod evidence. Keep mock mode local dev/demo only.`);
}

async function main() {
  const files = await walkFiles(repoRoot);
  const findings = [];

  for (const filePath of files) {
    const file = relativePath(filePath);
    const content = await readFile(filePath, 'utf8');
    findings.push(...collectMatches(file, content));
  }

  const errors = findings.filter((finding) => finding.level === 'error');
  const warnings = findings.filter((finding) => finding.level === 'warn');

  if (errors.length === 0) {
    console.log('Mock env guardrails passed.');
    console.log(`Warnings / allowed references: ${warnings.length}`);
    return;
  }

  console.error('Mock env guardrails failed.');
  console.error('\nForbidden mock env findings:');
  errors.forEach((finding) => printFinding(finding));

  if (warnings.length > 0) {
    console.error('\nAllowed references / warnings:');
    warnings.forEach((finding) => printFinding(finding));
  }

  console.error('\nThis guardrail is env/evidence containment only: do not change runtime data-source behavior in Stage 12I-A3.');
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
