import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gtinOk, passportPath, renderPassport, validate } from '../site/lib/passport.mjs';
import { qrSvg } from '../site/lib/qr.mjs';
import { aiSchema } from '../site/editor/ai-schema.mjs';

const battery = JSON.parse(readFileSync(new URL('../passports/beispiel-ebike-akku.json', import.meta.url)));

test('GTIN check digit', () => {
  assert.ok(gtinOk('4006381333931'));
  assert.ok(gtinOk('09520123456788'));
  assert.ok(!gtinOk('4006381333932'));
  assert.ok(!gtinOk('123'));
});

test('GS1 Digital Link paths', () => {
  assert.equal(passportPath(battery), '01/09520123456788');
  assert.equal(passportPath(battery, 'AK500-000123'), '01/09520123456788/21/AK500-000123');
  assert.equal(passportPath({ id: 'x-1' }, 'S1'), 'p/x-1/S1');
});

test('example passports validate', () => {
  for (const f of ['beispiel-ebike-akku.json', 'example-tshirt.json']) {
    const p = JSON.parse(readFileSync(new URL(`../passports/${f}`, import.meta.url)));
    assert.deepEqual(validate(p).errors, [], f);
  }
});

test('validation catches the mistakes that matter', () => {
  const bad = {
    ...battery,
    chemistry: '',
    declarationOfConformityUrl: 'javascript:alert(1)',
    gtin: '09520123456789',
    items: [{ serial: 'a/b' }, { serial: 'X', manufactureDate: '2026-13' }],
  };
  const e = validate(bad).errors.join('\n');
  for (const part of ['Chemie fehlt', 'Konformitätserklärung', 'gtin', 'a/b', '2026-13', 'Herstellungsdatum fehlt']) assert.match(e, new RegExp(part));
  assert.match(validate({ template: 'nope' }).errors[0], /template/);
});

test('rendered page escapes input and drops non-http links', () => {
  const evil = { ...battery, productName: '<img src=x onerror=alert(1)>', dueDiligenceUrl: 'javascript:alert(1)', markings: '</script><script>alert(1)</script>' };
  const html = renderPassport(evil, { url: 'https://example.com/01/09520123456788/' });
  assert.ok(!html.includes('<img src=x'));
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(!html.includes('</script><script>alert(1)'));
  assert.match(html, /"gtin14": "09520123456788"/);
});

test('item page shows serial and date', () => {
  const html = renderPassport(battery, { url: 'https://e.com/x/', item: battery.items[0], modelUrl: 'https://e.com/m/' });
  assert.match(html, /AK500-000123/);
  assert.match(html, /2026-09/);
});

test('QR code decodes to the passport URL', (t) => {
  const url = 'https://brickystudios.github.io/digitaler-produktpass/01/09520123456788/21/AK500-000123/';
  const dir = mkdtempSync(join(tmpdir(), 'qr-'));
  writeFileSync(join(dir, 'qr.svg'), qrSvg(url));
  try {
    execFileSync('rsvg-convert', ['-w', '400', join(dir, 'qr.svg'), '-o', join(dir, 'qr.png')]);
    assert.equal(execFileSync('zbarimg', ['-q', '--raw', join(dir, 'qr.png')]).toString().trim(), url);
  } catch (e) {
    if (e.code === 'ENOENT') return t.skip('rsvg-convert or zbarimg not installed');
    throw e;
  }
});

test('AI schema covers every field and is strict', () => {
  const s = aiSchema('battery');
  assert.equal(s.additionalProperties, false);
  assert.deepEqual(s.required, Object.keys(s.properties));
  assert.ok(s.properties.chemistry && s.properties.ratedCapacityAh);
});
