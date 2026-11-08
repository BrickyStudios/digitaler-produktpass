// KI-Import: reads a datasheet (PDF or text) with Claude and returns field values.
// Runs in the browser with the user's own API key; the key goes only to api.anthropic.com.
import { aiSchema } from './ai-schema.mjs';

const PROMPT = {
  de: 'Fülle aus dem Datenblatt oben die Felder eines digitalen Produktpasses. Übernimm nur Angaben, die im Dokument stehen, mit Einheit. Steht etwas nicht drin, setze null. Nichts schätzen oder ergänzen. Antworte auf Deutsch.',
  en: 'From the datasheet above, fill in the fields of a digital product passport. Only use information stated in the document, with units. If something is not stated, use null. Do not estimate or add anything. Answer in English.',
};

export async function extractFields({ apiKey, template, lang, pdfBase64, text, fetch }) {
  const { default: Anthropic } = await import('./vendor/anthropic.mjs');
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 1, ...(fetch && { fetch }) });
  const content = [];
  if (pdfBase64) content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } });
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
