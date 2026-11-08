import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate } from '../site/assets/check.mjs';

const titles = (a) => evaluate(a).items.map((i) => i.title);

test('incomplete answers give no result', () => {
  assert.equal(evaluate({ kind: 'lmt', role: 'maker' }), null);
  assert.equal(evaluate({ kind: 'industrial', role: 'maker', when: 'after' }), null);
});

test('e-bike battery from a manufacturer needs a passport', () => {
  const r = evaluate({ kind: 'lmt', role: 'maker', when: 'after' });
  assert.equal(r.passport, true);
  assert.equal(r.items[0].ref, 'Art. 77 Abs. 1 und 4');
});

test('industrial battery: 2 kWh decides', () => {
  assert.equal(evaluate({ kind: 'industrial', cap: 'over', role: 'importer', when: 'after' }).passport, true);
  assert.equal(evaluate({ kind: 'industrial', cap: 'under', role: 'importer', when: 'after' }).passport, false);
});

test('portable and SLI batteries: no passport, but QR code', () => {
  for (const kind of ['portable', 'sli']) {
    const t = titles({ kind, role: 'maker', when: 'after' });
    assert.equal(t[0], 'Kein Batteriepass');
    assert.ok(t.includes('QR-Code auf der Batterie'));
  }
});

test('dealers check, they do not create', () => {
  const r = evaluate({ kind: 'lmt', role: 'dealer', when: 'after' });
  assert.equal(r.passport, false);
  assert.match(r.items[0].ref, /Art\. 42/);
});
