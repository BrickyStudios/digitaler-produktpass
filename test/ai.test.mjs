import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractFields } from '../site/editor/ai.mjs';

// No network: a fake fetch records the request and answers like the Messages API.
function fakeFetch(status, body) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url: String(url), headers: new Headers(init.headers), body: JSON.parse(init.body) });
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  };
  return { fn, calls };
}
const msg = (text, stop = 'end_turn') => ({
  id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5-5', stop_reason: stop,
  content: [{ type: 'text', text }], usage: { input_tokens: 1, output_tokens: 1 },
});

test('sends PDF + schema and parses the JSON answer', async () => {
  const { fn, calls } = fakeFetch(200, msg(JSON.stringify({ chemistry: 'Li-Ion NMC', gtin: null })));
  const out = await extractFields({ apiKey: 'sk-test', template: 'battery', lang: 'de', pdfBase64: 'JVBERi0=', fetch: fn });
  assert.equal(out.chemistry, 'Li-Ion NMC');
  const { url, headers, body } = calls[0];
  assert.match(url, /api\.anthropic\.com\/v1\/messages/);
  assert.equal(headers.get('authorization'), 'Bearer sk-test');
  assert.equal(headers.get('anthropic-dangerous-direct-browser-access'), 'true');
  assert.match(headers.get('anthropic-beta'), /server-side-fallback-2026-07-01/);
  assert.equal(body.model, 'claude-opus-5-5');
  assert.equal(body.fallbacks, 'default');
  assert.equal(body.output_config.format.type, 'json_schema');
  assert.equal(body.messages[0].content[0].type, 'document');
});

test('bad key gives a readable error', async () => {
  const { fn } = fakeFetch(401, { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } });
  await assert.rejects(extractFields({ apiKey: 'x', template: 'battery', lang: 'de', text: 'a', fetch: fn }), /ungültig/);
});

test('refusal is reported, not parsed', async () => {
  const { fn } = fakeFetch(200, msg('', 'refusal'));
  await assert.rejects(extractFields({ apiKey: 'x', template: 'product', lang: 'en', text: 'a', fetch: fn }), /abgelehnt/);
});
