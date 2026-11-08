#!/usr/bin/env node
// Builds _site/: editor + one page, passport.json and qr.svg per passport and serial number,
// a printable label sheet per model and passports.json as an index of everything.
// BASE_URL is where _site/ will be served (GitHub Actions sets it from configure-pages).
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { passportPath, renderLabels, renderPassport, validate } from './site/lib/passport.mjs';
import { qrSvg } from './site/lib/qr.mjs';

const BASE = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
const OUT = '_site';

// Git is the version history: last commit date per passport file and a link to its log.
const git = (...args) => { try { return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };
const repoWeb = process.env.GITHUB_REPOSITORY
  ? `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY}`
  : git('remote', 'get-url', 'origin').replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
const branch = process.env.GITHUB_REF_NAME || git('rev-parse', '--abbrev-ref', 'HEAD') || 'main';

rmSync(OUT, { recursive: true, force: true });
cpSync('site', OUT, { recursive: true });
// The editor's "Beispiel laden" button reads this file.
if (existsSync('passports/beispiel-ebike-akku.json')) cpSync('passports/beispiel-ebike-akku.json', join(OUT, 'editor/beispiel.json'));

function write(path, html, p, item) {
  const dir = join(OUT, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  writeFileSync(join(dir, 'passport.json'), JSON.stringify({ ...p, items: undefined, item, uri: `${BASE}/${path}/` }, null, 2));
  writeFileSync(join(dir, 'qr.svg'), qrSvg(`${BASE}/${path}/`));
}

const passports = [];
let failed = false;
for (const file of readdirSync('passports').filter((f) => f.endsWith('.json')).sort()) {
  const p = JSON.parse(readFileSync(join('passports', file), 'utf8'));
  const { errors, warnings } = validate(p);
  for (const w of warnings) console.warn(`  ${file}: Hinweis: ${w}`);
  if (errors.length) {
    failed = true;
    for (const e of errors) console.error(`  ${file}: FEHLER: ${e}`);
    continue;
  }
  const version = {
    updated: git('log', '-1', '--format=%cs', '--', join('passports', file)) || null,
    historyUrl: repoWeb.startsWith('https://') ? `${repoWeb}/commits/${branch}/passports/${file}` : null,
  };
  const modelPath = passportPath(p);
  const modelUrl = `${BASE}/${modelPath}/`;
  const items = (p.items ?? []).map((item) => ({ item, path: passportPath(p, item.serial) }));
  const labelsUrl = items.length ? `${modelUrl}etiketten/` : null;
  write(modelPath, renderPassport(p, { url: modelUrl, labelsUrl, ...version }), p);
  for (const { item, path } of items) write(path, renderPassport(p, { url: `${BASE}/${path}/`, item, modelUrl, ...version }), p, item);
  if (items.length) {
    mkdirSync(join(OUT, modelPath, 'etiketten'), { recursive: true });
    writeFileSync(join(OUT, modelPath, 'etiketten', 'index.html'), renderLabels(p, items.map(({ item, path }) => ({ serial: item.serial, url: `${BASE}/${path}/` }))));
  }
  passports.push({ id: p.id, template: p.template, productName: p.productName, gtin: p.gtin ?? null, url: modelUrl, updated: version.updated, items: items.map(({ item, path }) => ({ serial: item.serial, url: `${BASE}/${path}/` })) });
  console.log(`  ${file} → ${modelPath}/ (+${items.length} Seriennummern)`);
}
if (failed) process.exit(1);
writeFileSync(join(OUT, 'passports.json'), `${JSON.stringify({ generated: new Date().toISOString().slice(0, 10), passports }, null, 2)}\n`);

// The project website lives in website/. Forks that only want passports can delete that folder.
if (existsSync('website/build.mjs')) {
  const { buildWebsite } = await import('./website/build.mjs');
  buildWebsite({ BASE, OUT, passports });
}
console.log(`fertig: ${OUT}/ für ${BASE}`);
