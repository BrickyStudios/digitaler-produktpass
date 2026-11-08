import { fieldsOf } from '../lib/templates.mjs';

// JSON schema for structured outputs: every field present, null when no document states it,
// otherwise the value plus where it was found (file name and page).
export function aiSchema(template) {
  const found = (valueSchema, description) => ({
    anyOf: [
      {
        type: 'object',
        description,
        properties: { value: valueSchema, source: { type: 'string', description: 'file name and page, e.g. "datasheet.pdf, p. 2"' } },
        required: ['value', 'source'],
        additionalProperties: false,
      },
      { type: 'null' },
    ],
  });
  const properties = { gtin: found({ type: 'string' }, 'GTIN/EAN if printed in a document') };
  for (const fd of fieldsOf(template)) {
    properties[fd.key] = found(fd.options ? { type: 'string', enum: fd.options.map((o) => o.value) } : { type: 'string' }, `${fd.label.en} (${fd.ref})`);
  }
  return { type: 'object', properties, required: Object.keys(properties), additionalProperties: false };
}
