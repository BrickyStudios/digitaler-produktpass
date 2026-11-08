// Shared by the Node build (build.mjs) and the browser editor: validation,
// GS1 Digital Link paths and the HTML of one passport page.
import { TEMPLATES, fieldsOf, refText } from './templates.mjs';
import { qrSvg } from './qr.mjs';

export const REPO_URL = 'https://github.com/BrickyStudios/digitaler-produktpass';

const UI = {
  de: {
    passport: 'Digitaler Produktpass', serial: 'Seriennummer', made: 'Herstellungsdatum',
    model: 'Modelldaten', scan: 'Dieser QR-Code führt zu diesem Pass.', data: 'Maschinenlesbar (JSON)',
    restricted: 'Weitere Angaben für berechtigte Stellen (detaillierte Zusammensetzung, Demontage, Prüfberichte) auf Anfrage:',
    made_with: 'Erstellt mit Passwerk, Open Source', basis: 'Rechtsgrundlage', empty: 'nicht angegeben',
  },
  en: {
    passport: 'Digital product passport', serial: 'Serial number', made: 'Date of manufacture',
    model: 'Model data', scan: 'This QR code links to this passport.', data: 'Machine-readable (JSON)',
    restricted: 'Further information for parties with a legitimate interest (detailed composition, dismantling, test reports) on request:',
    made_with: 'Made with Passwerk, open source', basis: 'Legal basis', empty: 'not stated',
  },
};

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Only http(s) links reach the page; anything else (javascript:, data:) is shown as text.
export function safeUrl(u) {
  try {
    const x = new URL(String(u));
    return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : null;
  } catch {
    return null;
  }
}

// GS1 check digit over all digits but the last.
export function gtinOk(g) {
  if (!/^\d{8}$|^\d{12,14}$/.test(g)) return false;
  const body = g.slice(0, -1);
  const sum = [...body].reduce((s, d, i) => s + Number(d) * ((body.length - i) % 2 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === Number(g.at(-1));
}
export const gtin14 = (g) => String(g).padStart(14, '0');

export const isEmpty = (v) => v === undefined || v === null || String(v).trim() === '';

// GS1 Digital Link path (/01/<GTIN>/21/<serial>) when a GTIN exists, else /p/<id>/<serial>.
export function passportPath(p, serial) {
  const base = p.gtin ? `01/${gtin14(p.gtin)}` : `p/${p.id}`;
  if (!serial) return base;
  return p.gtin ? `${base}/21/${serial}` : `${base}/${serial}`;
}

export function validate(p) {
  const errors = [];
  const warnings = [];
  const tpl = TEMPLATES[p?.template];
  if (!tpl) return { errors: [`template muss ${Object.keys(TEMPLATES).join(' oder ')} sein`], warnings };
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(p.id ?? '')) errors.push('id: nur Kleinbuchstaben, Ziffern und Bindestriche');
  if (p.language && !UI[p.language]) errors.push('language: de oder en');
  if (!isEmpty(p.gtin) && !gtinOk(String(p.gtin))) errors.push(`gtin ${p.gtin}: Länge oder Prüfziffer falsch`);

  for (const fd of fieldsOf(p.template)) {
    const v = p[fd.key];
    if (isEmpty(v)) {
      (fd.required ? errors : warnings).push(`${fd.label.de} fehlt (${fd.ref})`);
      continue;
    }
    if (fd.kind === 'url' && !safeUrl(v)) errors.push(`${fd.label.de}: kein vollständiger Link mit https://`);
    if (fd.kind === 'number' && !Number.isFinite(Number(String(v).replace(',', '.')))) errors.push(`${fd.label.de}: keine Zahl`);
    if (fd.options && !fd.options.some((o) => o.value === v)) errors.push(`${fd.label.de}: unbekannter Wert ${v}`);
  }

  const seen = new Set();
  for (const it of p.items ?? []) {
    // GS1 AI 21 allows up to 20 characters; we keep to URL- and filename-safe ones.
    if (!/^[A-Za-z0-9._-]{1,20}$/.test(it.serial ?? '')) errors.push(`Seriennummer "${it.serial}": 1 bis 20 Zeichen aus A bis Z, 0 bis 9, Punkt, Unterstrich, Bindestrich`);
    if (seen.has(it.serial)) errors.push(`Seriennummer ${it.serial} doppelt`);
    seen.add(it.serial);
    if (!isEmpty(it.manufactureDate) && !/^\d{4}-(0[1-9]|1[0-2])$/.test(it.manufactureDate)) errors.push(`${it.serial}: Herstellungsdatum "${it.manufactureDate}" bitte als JJJJ-MM`);
    if (p.template === 'battery' && isEmpty(it.manufactureDate)) errors.push(`${it.serial}: Herstellungsdatum fehlt (Anh. VI A Nr. 4)`);
  }
  return { errors, warnings };
}

function valueHtml(fd, v, lang) {
  if (fd.options) {
    const o = fd.options.find((x) => x.value === v);
    return esc(o ? o[lang] : v);
  }
  if (fd.kind === 'url') {
    const u = safeUrl(v);
    return u ? `<a href="${esc(u)}" rel="noopener">${esc(u.replace(/^https?:\/\//, ''))}</a>` : esc(v);
  }
  return esc(v).replace(/\r?\n/g, '<br>');
}

// JSON inside <script> must not be able to close the tag.
const scriptJson = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');

export function jsonLd(p, url, item) {
  const lang = p.language ?? 'de';
  const props = fieldsOf(p.template)
    .filter((fd) => !isEmpty(p[fd.key]) && !['productName', 'manufacturer'].includes(fd.key))
    .map((fd) => ({ '@type': 'PropertyValue', propertyID: fd.key, name: fd.label[lang], value: String(p[fd.key]) }));
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.productName,
    url,
    ...(p.gtin && { gtin14: gtin14(p.gtin) }),
    ...(item && { serialNumber: item.serial }),
    ...(item?.manufactureDate && { productionDate: item.manufactureDate }),
    manufacturer: { "@type": "Organization", name: String(p.manufacturer ?? "").split('\n')[0] },
    additionalProperty: props,
  };
}

const CSS = `
:root{--ink:#14211c;--muted:#5b6a63;--line:#d9e0dc;--paper:#fbfcfb;--accent:#0b6e4f}
@media (prefers-color-scheme:dark){:root{--ink:#e7eeea;--muted:#9fb0a8;--line:#2c3934;--paper:#101614;--accent:#5fd3a5}}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:46rem;margin:0 auto;padding:2rem 1rem 3rem}
.kind{color:var(--accent);font-weight:600;margin:0 0 1rem}
h1{font-size:1.9rem;line-height:1.2;margin:0 0 .4rem}
.top{display:grid;grid-template-columns:1fr 9rem;gap:1.25rem;align-items:start;border-bottom:1px solid var(--line);padding-bottom:1.25rem}
.qr svg{width:9rem;height:9rem;display:block;border-radius:6px}.qr p{font-size:.75rem;color:var(--muted);margin:.4rem 0 0}
.ids{margin:0;display:grid;grid-template-columns:auto 1fr;gap:.2rem 1rem;font-size:.95rem}.ids dt{color:var(--muted)}.ids dd{margin:0;font-variant-numeric:tabular-nums}
h2{font-size:1.05rem;margin:2rem 0 .5rem}
.fields{margin:0;border-top:1px solid var(--line)}.row{display:grid;grid-template-columns:minmax(0,15rem) 1fr;gap:1rem;padding:.6rem 0;border-bottom:1px solid var(--line)}
.row dt{color:var(--muted);font-size:.92rem}.row dd{margin:0;overflow-wrap:anywhere}.ref{display:block;font-size:.72rem;opacity:.75}
.empty{color:var(--muted);font-style:italic}a{color:var(--accent)}
.note{margin-top:2rem;padding:1rem;border:1px solid var(--line);border-radius:8px;font-size:.92rem}
footer{margin-top:2.5rem;font-size:.8rem;color:var(--muted);display:flex;flex-wrap:wrap;gap:.5rem 1.5rem}
@media (max-width:560px){.top{grid-template-columns:1fr}.row{grid-template-columns:1fr;gap:.1rem}}
@media print{body{background:#fff;color:#000}footer a{color:#000}}`;

export function renderPassport(p, { url, item = null, modelUrl = null } = {}) {
  const lang = p.language ?? 'de';
  const t = UI[lang];
  const tpl = TEMPLATES[p.template];
  const ids = [
    p.gtin && ['GTIN', gtin14(p.gtin)],
    item && [t.serial, item.serial],
    item?.manufactureDate && [t.made, item.manufactureDate],
  ].filter(Boolean);

  const groups = tpl.groups
    .map((g) => {
      const rows = g.fields
        .filter((fd) => fd.key !== 'productName' && fd.key !== 'restrictedAccess')
        .map((fd) => {
          const v = p[fd.key];
          const dd = isEmpty(v) ? `<span class="empty">${t.empty}</span>` : valueHtml(fd, v, lang);
          return `<div class="row"><dt>${esc(fd.label[lang])}<span class="ref">${esc(refText(fd.ref, lang))}</span></dt><dd>${dd}</dd></div>`;
        })
        .join('');
      return `<h2>${esc(g.title[lang])}</h2><dl class="fields">${rows}</dl>`;
    })
    .join('');

  const restricted = isEmpty(p.restrictedAccess) ? '' : `<p class="note">${t.restricted} ${valueHtml({}, p.restrictedAccess, lang)}</p>`;
  const data = { ...p, items: undefined, ...(item && { item }), uri: url };

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.productName)}${item ? ` · ${esc(item.serial)}` : ''} · ${t.passport}</title>
<meta name="description" content="${esc(`${t.passport}: ${p.productName}. ${tpl.name[lang]}.`)}">
${url ? `<link rel="canonical" href="${esc(url)}">` : ''}
<style>${CSS}</style>
<script type="application/ld+json">${scriptJson(jsonLd(p, url, item))}</script>
<script type="application/json" id="passport-data">${scriptJson(data)}</script>
</head>
<body>
<main>
<div class="top">
<div>
<h1>${esc(p.productName)}</h1>
<p class="kind">${esc(tpl.name[lang])}</p>
${ids.length ? `<dl class="ids">${ids.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}
${modelUrl ? `<p><a href="${esc(modelUrl)}">${t.model}</a></p>` : ''}
</div>
${url ? `<div class="qr">${qrSvg(url)}<p>${t.scan}</p></div>` : ''}
</div>
${groups}
${restricted}
<footer><span>${t.basis}: ${esc(tpl.law[lang])}</span>${url ? `<a href="passport.json">${t.data}</a>` : ''}<a href="${REPO_URL}">${t.made_with}</a></footer>
</main>
</body>
</html>
`;
}
