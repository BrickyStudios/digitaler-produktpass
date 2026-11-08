import { fieldsOf } from '../lib/templates.mjs';

// JSON schema for structured outputs. Structured outputs allow at most 16 union-typed
// (anyOf / nullable) and 24 optional parameters per request, so instead of one nullable
// property per field the model returns a list of the fields it actually found.
export function aiSchema(template) {
  const keys = ['gtin', ...fieldsOf(template).map((fd) => fd.key)];
  return {
    type: 'object',
    properties: {
      fields: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            key: { type: 'string', enum: keys },
            value: { type: 'string' },
            source: { type: 'string', description: 'file name and page, e.g. "datasheet.pdf, p. 2"' },
          },
          required: ['key', 'value', 'source'],
          additionalProperties: false,
        },
      },
    },
    required: ['fields'],
    additionalProperties: false,
  };
}

// Field list for the prompt: key, meaning, legal reference, allowed values.
export function fieldGuide(template) {
  return fieldsOf(template)
    .map((fd) => `${fd.key}: ${fd.label.en} (${fd.ref})${fd.options ? `; one of ${fd.options.map((o) => `${o.value} = ${o.en}`).join(', ')}` : ''}`)
    .join('\n');
}
