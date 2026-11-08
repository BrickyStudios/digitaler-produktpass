// KI-Import: reads a datasheet (PDF or text) with Claude and returns field values.
// Runs in the browser with the user's own API key; the key goes only to api.anthropic.com.
import { aiSchema } from './ai-schema.mjs';

const PROMPT = {
  de: 'Fülle aus den Dokumenten oben die Felder eines digitalen Produktpasses. Übernimm nur Angaben, die in einem Dokument stehen, mit Einheit, und nenne als Quelle Dateiname und Seite. Steht etwas nirgends, setze null. Nichts schätzen oder ergänzen. Werte auf Deutsch.',
  en: 'From the documents above, fill in the fields of a digital product passport. Only use information stated in a document, with units, and give file name and page as the source. If something is not stated anywhere, use null. Do not estimate or add anything. Values in English.',
};

// files: [{ name, base64 }] PDFs, read together in one request.
export async function extractFields({ apiKey, template, lang, files = [], text, fetch }) {
  const { default: Anthropic } = await import('./vendor/anthropic.mjs');
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 1, ...(fetch && { fetch }) });
  const content = [];
  for (const f of files) content.push({ type: 'document', title: f.name, source: { type: 'base64', media_type: 'application/pdf', data: f.base64 } });
  if (text) content.push({ type: 'text', text: `Datenblatt / datasheet:\n\n${text}` });
  content.push({ type: 'text', text: PROMPT[lang] ?? PROMPT.de });

  let res;
  try {
    res = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: aiSchema(template) } },
      messages: [{ role: 'user', content }],
    });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw new Error('API-Schlüssel ungültig (401).');
    if (e instanceof Anthropic.PermissionDeniedError) throw new Error('Schlüssel ohne Berechtigung (403).');
    if (e instanceof Anthropic.RateLimitError) throw new Error('Zu viele Anfragen oder kein Guthaben (429). Später erneut versuchen.');
    if (e instanceof Anthropic.BadRequestError) throw new Error(`Anfrage abgelehnt (400): ${e.message}`);
    if (e instanceof Anthropic.APIConnectionError) throw new Error('Keine Verbindung zu api.anthropic.com.');
    throw e;
  }
  if (res.stop_reason === 'refusal') throw new Error('Das Modell hat die Anfrage abgelehnt.');
  if (res.stop_reason === 'max_tokens') throw new Error('Antwort abgeschnitten. Kürzeres Dokument versuchen.');
  const block = res.content.find((b) => b.type === 'text');
  if (!block) throw new Error('Leere Antwort.');
  return JSON.parse(block.text);
}
