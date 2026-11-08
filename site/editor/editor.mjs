import { TEMPLATES, fieldsOf, refText } from '../lib/templates.mjs';
import { isEmpty, passportPath, renderPassport, validate } from '../lib/passport.mjs';
import { qrSvg } from '../lib/qr.mjs';

const $ = (id) => document.getElementById(id);
const store = {
  get: (k, s = localStorage) => { try { return s.getItem(k); } catch { return null; } },
  set: (k, v, s = localStorage) => { try { v == null ? s.removeItem(k) : s.setItem(k, v); } catch { /* private mode */ } },
};

const blank = () => ({ template: 'battery', language: 'de', items: [] });
let p = (() => { try { return { ...blank(), ...JSON.parse(store.get('passwerk.draft')) }; } catch { return blank(); } })();
let aiKeys = new Set(JSON.parse(store.get('passwerk.ai') ?? '[]'));
let idTouched = !isEmpty(p.id);
const defaultBase = new URL('../', location.href).href.replace(/\/$/, '');
$('base').value = store.get('passwerk.base') ?? defaultBase;
$('ai-key').value = store.get('passwerk.key', sessionStorage) ?? '';
$('ai-remember').checked = !!$('ai-key').value;

const slug = (s) => String(s).toLowerCase().replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' })[c]).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const base = () => $('base').value.trim().replace(/\/+$/, '');
const urlFor = (serial) => `${base()}/${passportPath(p, serial)}/`;

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v);
  n.append(...kids.filter((k) => k != null));
  return n;
}

// The form for the chosen template, built from the same field list the build validates against.
function renderFields() {
  const tpl = TEMPLATES[p.template];
  const box = $('fields');
  box.replaceChildren();
  for (const g of tpl.groups) {
    const fs = el('fieldset', { class: 'group' }, el('legend', {}, g.title.de));
    for (const fd of g.fields) {
      const id = `f-${fd.key}`;
      const label = el('label', { for: id }, fd.label.de, fd.required ? el('span', { class: 'req' }, ' Pflicht') : null, el('span', { class: 'ref' }, refText(fd.ref, 'de')));
      let input;
      if (fd.options) {
        input = el('select', { id, name: fd.key }, el('option', { value: '' }, 'bitte wählen'), ...fd.options.map((o) => el('option', { value: o.value }, o.de)));
      } else if (fd.kind === 'long') {
        input = el('textarea', { id, name: fd.key, rows: 3 });
      } else {
        input = el('input', { id, name: fd.key, type: fd.kind === 'url' ? 'url' : 'text', inputmode: fd.kind === 'number' ? 'decimal' : null, autocomplete: 'off' });
      }
      input.value = p[fd.key] ?? '';
      input.dataset.key = fd.key;
      const wrap = el('div', { class: `field${aiKeys.has(fd.key) ? ' is-ai' : ''}` }, label, input);
      if (aiKeys.has(fd.key)) wrap.append(el('p', { class: 'ai-note' }, `Vorschlag aus ${p.sources?.[fd.key] || 'den Dokumenten'}, bitte prüfen`));
      else if (p.sources?.[fd.key]) wrap.append(el('p', { class: 'src-note' }, `Quelle: ${p.sources[fd.key]}`));
      fs.append(wrap);
    }
    box.append(fs);
  }
  for (const k of ['gtin', 'id']) $(k).value = p[k] ?? '';
  $(`tpl-${p.template}`).checked = true;
  $('language').value = p.language ?? 'de';
  $('items').value = (p.items ?? []).map((i) => [i.serial, i.manufactureDate].filter(Boolean).join(' ')).join('\n');
}

// Accepts "SERIAL 2026-09", Excel columns (tab), semicolons and German dates (09.2026, 15.09.2026).
const monthOf = (d) => {
  if (!d) return undefined;
  const de = d.match(/^(?:\d{1,2}\.)?(\d{1,2})\.(\d{4})$/);
  if (de) return `${de[2]}-${de[1].padStart(2, '0')}`;
  const iso = d.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
  return iso ? `${iso[1]}-${iso[2]}` : d;
};
function parseItems(text) {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [serial, date] = l.split(/[\t;,]\s*|\s+/).filter(Boolean);
    const manufactureDate = monthOf(date);
    return manufactureDate ? { serial, manufactureDate } : { serial };
  });
}

function supplierMail(missing) {
  const lines = missing.map((fd) => `- ${fd.label.de}${fd.required ? ' (Pflicht)' : ''}, ${refText(fd.ref, 'de')}`);
  return `Guten Tag,\n\nfür den digitalen Produktpass zu „${p.productName || 'unserem Produkt'}“ fehlen uns noch diese Angaben:\n\n${lines.join('\n')}\n\nKönnen Sie uns die Werte oder die passenden Unterlagen (Datenblatt, Konformitätserklärung, Prüfberichte) schicken?\n\nVielen Dank und freundliche Grüße`;
}

function clean() {
  const out = {};
  for (const [k, v] of Object.entries(p)) if (!isEmpty(v) && !(Array.isArray(v) && !v.length)) out[k] = v;
  for (const k of ['weightKg', 'ratedCapacityAh']) if (out[k] !== undefined && Number.isFinite(Number(String(out[k]).replace(',', '.')))) out[k] = Number(String(out[k]).replace(',', '.'));
  return out;
}

function update() {
  const { errors, warnings } = validate(p);
  const status = $('status');
  status.className = `status ${errors.length ? 'is-bad' : 'is-ok'}`;
  status.textContent = errors.length
    ? `${errors.length} ${errors.length === 1 ? 'Angabe fehlt oder ist fehlerhaft' : 'Angaben fehlen oder sind fehlerhaft'}`
    : `Pflichtangaben vollständig${warnings.length ? `, ${warnings.length} freiwillige Felder leer` : ''}`;
  const shown = errors.slice(0, 6);
  $('problems').replaceChildren(...shown.map((e) => el('li', {}, e)), ...(errors.length > shown.length ? [el('li', {}, `und ${errors.length - shown.length} weitere`)] : []));
  const missing = fieldsOf(p.template).filter((fd) => isEmpty(p[fd.key])).sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0));
  $('ask').hidden = !missing.length;
  $('ask').href = `mailto:?subject=${encodeURIComponent(`Angaben für den digitalen Produktpass: ${p.productName || 'unser Produkt'}`)}&body=${encodeURIComponent(supplierMail(missing))}`;

  const view = $('view');
  const keep = view.value;
  view.replaceChildren(el('option', { value: '' }, 'Modellseite'), ...(p.items ?? []).map((i) => el('option', { value: i.serial }, `Seriennummer ${i.serial}`)));
  view.value = (p.items ?? []).some((i) => i.serial === keep) ? keep : '';
  showPreview();
  store.set('passwerk.draft', JSON.stringify(clean()));
  store.set('passwerk.ai', JSON.stringify([...aiKeys]));
}

function currentHtml() {
  const item = (p.items ?? []).find((i) => i.serial === $('view').value);
  return renderPassport({ ...p, productName: p.productName || 'Ohne Namen' }, { url: urlFor(item?.serial), item, modelUrl: item ? urlFor() : null });
}

$('form').addEventListener('input', (e) => {
  const t = e.target;
  if (t.name === 'template') { p.template = t.value; renderFields(); }
  else if (t.name === 'language') p.language = t.value;
  else if (t.id === 'items') p.items = parseItems(t.value);
  else if (t.id === 'base') store.set('passwerk.base', t.value.trim());
  else if (t.dataset.key) {
    p[t.dataset.key] = t.value;
    if (p.sources?.[t.dataset.key]) { delete p.sources[t.dataset.key]; t.closest('.field')?.querySelector('.src-note')?.remove(); }
    if (t.dataset.key === 'id') idTouched = true;
    if (aiKeys.delete(t.dataset.key)) { t.closest('.field').classList.remove('is-ai'); t.closest('.field').querySelector('.ai-note')?.remove(); }
    if (t.dataset.key === 'productName' && !idTouched) { p.id = slug(t.value); $('id').value = p.id; }
  }
  update();
});
// The preview frame runs no scripts; the JSON-LD blocks only matter in the downloaded page.
const showPreview = () => { $('frame').srcdoc = currentHtml().replace(/<script[\s\S]*?<\/script>/g, ''); };
$('view').addEventListener('change', showPreview);

function download(name, type, data) {
  const a = el('a', { href: URL.createObjectURL(new Blob([data], { type })), download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const fileBase = () => `${p.id || 'produktpass'}${$('view').value ? `-${$('view').value}` : ''}`;
$('dl-json').addEventListener('click', () => download(`${p.id || 'produktpass'}.json`, 'application/json', `${JSON.stringify(clean(), null, 2)}\n`));
$('dl-html').addEventListener('click', () => download(`${fileBase()}.html`, 'text/html', currentHtml()));
$('dl-svg').addEventListener('click', () => download(`${fileBase()}-qr.svg`, 'image/svg+xml', qrSvg(urlFor($('view').value || undefined))));
$('dl-png').addEventListener('click', () => {
  const img = new Image();
  img.onload = () => {
    const c = el('canvas', { width: 1024, height: 1024 });
    c.getContext('2d').drawImage(img, 0, 0, 1024, 1024);
    c.toBlob((b) => download(`${fileBase()}-qr.png`, 'image/png', b));
  };
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg(urlFor($('view').value || undefined)))}`;
});

function load(obj) {
  p = { ...blank(), ...obj };
  aiKeys = new Set();
  idTouched = !isEmpty(p.id);
  renderFields();
  update();
}
$('load').addEventListener('change', async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try { load(JSON.parse(await f.text())); } catch { $('status').textContent = `${f.name} ist keine gültige JSON-Datei.`; }
  e.target.value = '';
});
$('example').addEventListener('click', async () => {
  try { load(await (await fetch('beispiel.json')).json()); } catch { $('status').textContent = 'Beispiel konnte nicht geladen werden.'; }
});
$('clear').addEventListener('click', () => { if (confirm('Alle Eingaben in diesem Browser löschen?')) load(blank()); });

// KI-Import
$('ai-run').addEventListener('click', async () => {
  const btn = $('ai-run');
  const msg = $('ai-status');
  const apiKey = $('ai-key').value.trim();
  const files = [...$('ai-file').files];
  const text = $('ai-text').value.trim();
  store.set('passwerk.key', $('ai-remember').checked ? apiKey : null, sessionStorage);
  if (!apiKey) { msg.textContent = 'Bitte zuerst einen API-Schlüssel eintragen.'; $('ai-key').focus(); return; }
  if (!files.length && !text) { msg.textContent = 'Bitte ein PDF wählen oder Text einfügen.'; $('ai-file').focus(); return; }
  // 32 MB request limit; base64 adds a third.
  if (files.reduce((n, f) => n + f.size, 0) > 22 * 1024 * 1024) { msg.textContent = 'Die PDFs sind zusammen größer als 22 MB. Bitte weniger oder kleinere Dateien wählen.'; return; }
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
  msg.textContent = files.length > 1 ? `Claude liest ${files.length} Dokumente…` : 'Claude liest das Dokument…';
  try {
    const docs = await Promise.all(files.map((file) => new Promise((ok, bad) => {
      const r = new FileReader();
      r.onload = () => ok({ name: file.name, base64: String(r.result).split(',')[1] });
      r.onerror = () => bad(new Error(`${file.name} konnte nicht gelesen werden.`));
      r.readAsDataURL(file);
    })));
    const { extractFields } = await import('./ai.mjs');
    const out = await extractFields({ apiKey, template: p.template, lang: p.language ?? 'de', files: docs, text });
    let n = 0;
    for (const [k, v] of Object.entries(out)) {
      if (!v || isEmpty(v.value)) continue;
      p[k] = v.value;
      if (k !== 'gtin') { aiKeys.add(k); if (!isEmpty(v.source)) p.sources = { ...p.sources, [k]: v.source }; }
      n++;
    }
    if (!idTouched && p.productName) p.id = slug(p.productName);
    renderFields();
    update();
    msg.textContent = n ? `${n} Felder vorgeschlagen. Die markierten Felder bitte mit den Dokumenten abgleichen.` : 'Im Dokument standen keine passenden Angaben.';
  } catch (e) {
    msg.textContent = e.message || 'Unbekannter Fehler.';
  } finally {
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
  }
});

renderFields();
update();
