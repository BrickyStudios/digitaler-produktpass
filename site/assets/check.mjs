// Betroffenheits-Check: which obligations of Regulation (EU) 2023/1542 apply to one battery.
// evaluate() is pure and tested in test/check.test.mjs; the rest wires it to the form.

export function evaluate({ kind, cap, role, when }) {
  if (!kind || !role || !when || (kind === 'industrial' && !cap)) return null;
  const passportCategory = kind === 'lmt' || kind === 'ev' || (kind === 'industrial' && cap === 'over');
  const before = when === 'before';
  const dealer = role === 'dealer';
  const items = [];

  if (!passportCategory) {
    items.push({ ok: false, title: 'Kein Batteriepass', text: 'Für diese Batteriekategorie verlangt Art. 77 keinen Pass. Er gilt nur für LMT-Batterien, Industriebatterien über 2 kWh und Elektrofahrzeugbatterien.', ref: 'Art. 77 Abs. 1' });
  } else if (dealer) {
    items.push({ ok: true, title: 'Batteriepass: prüfen, nicht erstellen', text: 'Den Pass stellt bereit, wer die Batterie in der EU in Verkehr bringt, also Hersteller oder Importeur. Als Händler prüfen Sie vor dem Verkauf, ob die Kennzeichnung nach Art. 13 vorhanden ist, dazu gehört ab dem 18.02.2027 der QR-Code.', ref: 'Art. 77 Abs. 4, Art. 42 Abs. 2' });
  } else if (before) {
    items.push({ ok: true, title: 'Batteriepass ab dem 18.02.2027', text: 'Für Batterien, die Sie vorher in Verkehr bringen, gilt die Passpflicht noch nicht. Jede Batterie, die Sie ab dem 18.02.2027 in Verkehr bringen, braucht einen eigenen Pass.', ref: 'Art. 77 Abs. 1' });
  } else {
    items.push({ ok: true, title: 'Batteriepass für jede Batterie', text: 'Sie müssen für jede einzelne Batterie einen Pass bereitstellen und dafür sorgen, dass die Angaben richtig, vollständig und aktuell sind.', ref: 'Art. 77 Abs. 1 und 4' });
  }

  items.push({
    ok: true,
    title: 'QR-Code auf der Batterie',
    text: `Ab dem 18.02.2027 trägt jede Batterie einen QR-Code. ${passportCategory ? 'Er führt zum Batteriepass.' : 'Er führt zu den Pflichtinformationen, der Konformitätserklärung und den Hinweisen zur Entsorgung.'} Ist auf der Batterie kein Platz, kommt er auf Verpackung und Begleitpapiere.`,
    ref: 'Art. 13 Abs. 6 und 7',
  });
  items.push({ ok: true, title: 'Etikett mit Grunddaten', text: 'Hersteller, Kategorie, Herstellungsort und -datum, Gewicht, Kapazität, Chemie, gefährliche Stoffe, Löschmittel und kritische Rohstoffe. Pflicht ab dem 18.08.2026 oder 18 Monate nach dem Durchführungsrechtsakt, je nachdem, was später liegt.', ref: 'Art. 13 Abs. 1, Anhang VI Teil A' });
  items.push({ ok: true, title: 'Symbol für getrennte Sammlung', text: 'Die durchgestrichene Mülltonne, seit dem 18.08.2025 auf jeder Batterie.', ref: 'Art. 13 Abs. 4' });
  return { passport: passportCategory && !dealer, items };
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('check');
  const out = document.getElementById('check-result');
  const capBox = document.getElementById('q-cap');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const update = () => {
    const a = Object.fromEntries(new FormData(form));
    capBox.hidden = a.kind !== 'industrial';
    const r = evaluate(a);
    if (!r) { out.innerHTML = '<p class="check__wait">Das Ergebnis erscheint, sobald alle Fragen beantwortet sind.</p>'; return; }
    out.innerHTML = `<ul class="check__list">${r.items.map((i) => `<li class="${i.ok ? '' : 'is-no'}"><b>${esc(i.title)}</b><span>${esc(i.text)}</span><small>${esc(i.ref)}</small></li>`).join('')}</ul>${r.passport ? `<p class="check__cta"><a class="key key--primary" href="${esc(form.dataset.editor)}">Batteriepass im Editor anlegen</a></p>` : ''}<p class="check__fine">Indikative Einschätzung nach dem Verordnungstext, keine Rechtsberatung. Gespeichert oder gesendet wird nichts.</p>`;
  };
  form.addEventListener('change', update);
  update();
}
