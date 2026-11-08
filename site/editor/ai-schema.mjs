import { fieldsOf } from '../lib/templates.mjs';

// JSON schema for structured outputs: every field present, null when the document does not say.
export function aiSchema(template) {
  const nullable = (s) => ({ anyOf: [s, { type: 'null' }] });
  const properties = { gtin: nullable({ type: 'string', description: 'GTIN/EAN if printed in the document' }) };
  for (const fd of fieldsOf(template)) {
    const base = fd.options ? { type: 'string', enum: fd.options.map((o) => o.value) } : { type: 'string' };
    properties[fd.key] = nullable({ ...base, description: `${fd.label.en} (${fd.ref})` });
  }
  return { type: 'object', properties, required: Object.keys(properties), additionalProperties: false };
}
