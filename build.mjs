#!/usr/bin/env node
// Builds _site/: editor + one page, passport.json and qr.svg per passport and serial number.
// BASE_URL is where _site/ will be served (GitHub Actions sets it from configure-pages).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { passportPath, renderPassport, validate } from './site/lib/passport.mjs';
import { qrSvg } from './site/lib/qr.mjs';

const BASE = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
const OUT = '_site';

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
  const modelPath = passportPath(p);
  const modelUrl = `${BASE}/${modelPath}/`;
  write(modelPath, renderPassport(p, { url: modelUrl }), p);
  for (const item of p.items ?? []) {
    const path = passportPath(p, item.serial);
    write(path, renderPassport(p, { url: `${BASE}/${path}/`, item, modelUrl }), p, item);
  }
  passports.push({ p, url: modelUrl, items: (p.items ?? []).map((i) => `${BASE}/${passportPath(p, i.serial)}/`) });
  console.log(`  ${file} → ${modelPath}/ (+${p.items?.length ?? 0} Seriennummern)`);
}
if (failed) process.exit(1);

// The project website lives in website/. Forks that only want passports can delete that folder.
if (existsSync('website/build.mjs')) {
  const { buildWebsite } = await import('./website/build.mjs');
  buildWebsite({ BASE, OUT, passports });
}
console.log(`fertig: ${OUT}/ für ${BASE}`);
