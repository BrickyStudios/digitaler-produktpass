// Project website: home pages (DE, EN), guides, sitemap and the files search engines ask for.
// Called by build.mjs after the passports are built.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { esc } from '../site/lib/passport.mjs';
import { qrSvg } from '../site/lib/qr.mjs';
import { CHROME, DEMO, GUIDES, HOME, REPO, UPDATED } from './content.mjs';

const INDEXNOW_KEY = '5b1f0c7e9a2d4e86b3c1f7a0d9e2c4b8';
const GSC_FILE = 'google45e69daf80f002c0.html';

const out = (OUT, path, body) => {
  const f = join(OUT, path);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, body);
};
const up = (path) => '../'.repeat(path.split('/').filter(Boolean).length);
const href = (prefix, target) => (/^https?:/.test(target) ? target : `${prefix}${target}`);
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

function head({ BASE, page, prefix, schema }) {
  const url = `${BASE}/${page.path}`;
  const alts = page.alt != null
    ? [[page.lang, page.path], [page.lang === 'de' ? 'en' : 'de', page.alt], ['x-default', page.lang === 'de' ? page.path : page.alt]]
    : [];
  return `<!doctype html>
<html lang="${page.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
${alts.map(([l, p]) => `<link rel="alternate" hreflang="${l}" href="${BASE}/${p}">`).join('\n')}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Passwerk">
<meta property="og:locale" content="${page.lang === 'de' ? 'de_DE' : 'en_GB'}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${BASE}/assets/img/social-preview.png">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="640">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${prefix}assets/icon.svg" type="image/svg+xml">
<link rel="preload" href="${prefix}assets/fonts/familjen-grotesk-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${prefix}assets/fonts/ibm-plex-sans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${prefix}assets/site.css">
${ld(schema)}
</head>`;
}

function nav(lang, prefix) {
  const n = CHROME.nav[lang];
  return `<header class="nav-wrap"><nav class="floatbar" aria-label="${lang === 'de' ? 'Hauptnavigation' : 'Main navigation'}">
<a class="wordmark" href="${prefix}${lang === 'en' ? 'en/' : ''}" aria-label="${n.home}">Passwerk</a>
${(() => { const items = n.links.map(([p, t]) => `<li><a href="${prefix}${p}"${t === 'English' ? ' hreflang="en"' : t === 'Deutsch' ? ' hreflang="de"' : ''}>${t}</a></li>`).join(''); return `<ul class="floatbar__links">${items}</ul><details class="menu"><summary>${lang === 'de' ? 'Menü' : 'Menu'}</summary><ul>${items}</ul></details>`; })()}
<a class="key key--small" href="${prefix}editor/">${n.action}</a>
</nav></header>`;
}

function footer(lang, prefix) {
  const f = CHROME.footer[lang];
  return `<footer class="foot"><div class="container foot__grid">
<div class="foot__mark"><a class="wordmark" href="${prefix}${lang === 'en' ? 'en/' : ''}">Passwerk</a><p>${f.line}</p></div>
${f.cols.map(([h, links]) => `<div><h2 class="foot__head">${h}</h2><ul>${links.map(([p, t]) => `<li><a href="${href(prefix, p)}">${t}</a></li>`).join('')}</ul></div>`).join('\n')}
<p class="foot__legal">${f.legal}</p>
</div></footer>`;
}

const radio = (name, opts) => opts.map(([v, t]) => `<label class="opt"><input type="radio" name="${name}" value="${v}"><span>${t}</span></label>`).join('');
const CHECK_FORM = (prefix) => `<form class="check cut" id="check" data-editor="${prefix}editor/">
<fieldset><legend>Wofür ist die Batterie?</legend>${radio('kind', [['lmt', 'Antrieb von E-Bike, E-Scooter oder einem anderen Leichtfahrzeug, bis 25 kg'], ['ev', 'Antrieb von Auto, Transporter oder einem Fahrzeug über 25 kg Batterie'], ['industrial', 'Industrielle Nutzung oder stationärer Speicher, oder schwerer als 5 kg'], ['portable', 'Gerätebatterie bis 5 kg, etwa für Werkzeug, Laptop oder Haushalt'], ['sli', 'Starterbatterie für Fahrzeuge']])}</fieldset>
<fieldset id="q-cap"><legend>Kapazität über 2 kWh?</legend>${radio('cap', [['over', 'Ja, mehr als 2 kWh'], ['under', 'Nein, 2 kWh oder weniger']])}</fieldset>
<fieldset><legend>Ihre Rolle</legend>${radio('role', [['maker', 'Wir stellen die Batterie her oder lassen sie unter unserem Namen herstellen'], ['importer', 'Wir führen sie von außerhalb in die EU ein'], ['dealer', 'Wir verkaufen sie weiter']])}</fieldset>
<fieldset><legend>Wann kommt die Batterie in Verkehr?</legend>${radio('when', [['before', 'Vor dem 18. Februar 2027'], ['after', 'Ab dem 18. Februar 2027']])}</fieldset>
<div class="check__result" id="check-result" aria-live="polite"><noscript><p>Der Check braucht JavaScript. Die Regeln stehen unten auf dieser Seite.</p></noscript></div>
</form>
<script type="module" src="${prefix}assets/check.mjs"></script>`;

const faqLd = (items) => items.length && { '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

function home(BASE, c) {
  const prefix = up(c.path);
  const lang = c.path ? 'en' : 'de';
  const page = { ...c, lang };
  const app = {
    '@type': 'SoftwareApplication', name: 'Passwerk', url: `${BASE}/${c.path}`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
    description: c.description, inLanguage: lang, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    license: `${REPO}/blob/main/LICENSE`, sameAs: REPO,
  };
  const code = { '@type': 'SoftwareSourceCode', name: 'Passwerk', codeRepository: REPO, programmingLanguage: 'JavaScript', license: `${REPO}/blob/main/LICENSE` };
  const schema = { '@context': 'https://schema.org', '@graph': [app, code, faqLd(c.faq.items)] };
  const s = c.steps, b = c.bento, d = c.deadlines;
  const qrUrl = `${BASE}/${DEMO.item}`;

  return `${head({ BASE, page, prefix, schema })}
<body class="home">
${nav(lang, prefix)}
<main>
<section class="hero"><div class="container hero__grid">
  <div class="hero__text">
    <h1>${c.h1}</h1>
    <p class="lead">${c.lede}</p>
    <div class="actions">
      <a class="key key--primary" href="${prefix}editor/">${c.primary}</a>
      <a class="key" href="${REPO}">${c.secondary}</a>
    </div>
    <p class="terms">${c.terms}</p>
  </div>
  <figure class="mapping">
    <div class="mapping__panes">
      <div class="pane-code graphite" data-slot="code" data-kind="product" aria-label="${c.file}">
        <p class="pane-code__head">${c.file}</p>
        <pre><code>${esc(c.json)}</code></pre>
      </div>
      <div class="pane-shot" data-slot="hero" data-kind="product">
        <img src="${prefix}assets/img/passseite.webp" width="1640" height="1960" alt="${c.shotAlt}" fetchpriority="high">
      </div>
    </div>
    <figcaption>${c.caption}</figcaption>
  </figure>
</div></section>

<section class="steps"><div class="container">
  <h2>${s.h2}</h2>
  <ol class="steps__list">
    ${s.items.map((it) => `<li class="step">
      <h3>${it.h3}</h3>
      <p>${it.p}</p>
      <div class="step__shot" data-slot="step" data-kind="product"><img src="${prefix}assets/img/${it.img}" width="${it.w}" height="${it.h}" alt="${it.alt}" loading="lazy"></div>
    </li>`).join('\n    ')}
  </ol>
</div></section>

<section class="bento"><div class="container">
  <h2>${b.h2}</h2>
  <div class="bento__grid">
    <article class="tile tile--qr cut">
      <div class="tile__qr">${qrSvg(qrUrl).replace('aria-label="QR-Code"', `aria-label="QR-Code: ${qrUrl}"`)}</div>
      <div><h3>${b.qr.h3}</h3><p>${b.qr.p}</p><p class="tile__url"><code>/${esc(DEMO.item)}</code></p><p><a class="text-link" href="${prefix}${DEMO.item}">${b.qr.link}</a></p></div>
    </article>
    <article class="tile tile--fields cut">
      <h3>${b.fields.h3}</h3><p>${b.fields.p}</p>
      <dl class="ledger">${b.fields.rows.map(([k, r]) => `<div><dt>${k}</dt><dd>${r}</dd></div>`).join('')}</dl>
    </article>
    <article class="tile tile--data graphite">
      <h3>${b.data.h3}</h3><p>${b.data.p}</p>
      <pre><code>${esc('{ "@type": "Product",\n  "gtin14": "09520123456788",\n  "serialNumber": "AK500-000123" }')}</code></pre>
    </article>
    <article class="tile cut"><h3>${b.host.h3}</h3><p>${b.host.p}</p></article>
    <article class="tile cut"><h3>${b.key.h3}</h3><p>${b.key.p}</p></article>
  </div>
</div></section>

<section class="deadlines"><div class="container">
  <div class="split-head"><h2>${d.h2}</h2><p class="lead">${d.lede}</p></div>
  <div class="table-wrap"><table>
    <thead><tr>${d.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>${d.rows.map(([a, b2, r], i) => `<tr${i === 3 ? ' class="is-key"' : ''}><td class="num">${a}</td><td>${b2}</td><td>${r}</td></tr>`).join('')}</tbody>
  </table></div>
  <p class="more"><a href="${prefix}${d.more[0]}">${d.more[1]}</a></p>
</div></section>

<section class="faq"><div class="container faq__grid">
  <h2>${c.faq.h2}</h2>
  <div class="faq__rows">${c.faq.items.map(([q, a]) => `<details><summary><span>${q}</span><span class="sign" aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div>
</div></section>

<section class="close"><div class="container close__grid">
  <div><h2>${c.close.h2}</h2><p>${c.close.p}</p>
    <div class="actions"><a class="key" href="${REPO}/fork">${c.close.fork}</a><a class="text-link" href="${REPO}#readme">${c.close.readme}</a></div></div>
  <div class="pane-code graphite" data-slot="code-close" data-kind="product"><pre><code><span class="comment">${esc(c.close.comment)}</span>\n${c.close.code.map((l) => (l.startsWith('  ') ? `<span class="comment">${esc(l)}</span>` : esc(l))).join('\n')}</code></pre></div>
</div></section>
</main>
${footer(lang, prefix)}
</body>
</html>
`;
}

function guide(BASE, g) {
  const prefix = up(g.path);
  const url = `${BASE}/${g.path}`;
  const homeUrl = `${BASE}/${g.lang === 'en' ? 'en/' : ''}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: g.h1, description: g.description, inLanguage: g.lang, dateModified: UPDATED, mainEntityOfPage: url, author: { '@type': 'Organization', name: 'BrickyStudios', url: 'https://github.com/BrickyStudios' }, publisher: { '@type': 'Organization', name: 'Passwerk', url: homeUrl } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Passwerk', item: homeUrl }, { '@type': 'ListItem', position: 2, name: g.h1, item: url }] },
      faqLd(g.faq),
    ].filter(Boolean),
  };
  const de = g.lang === 'de';
  const body = g.body
    .replace('{{QR_ITEM}}', qrSvg(`${BASE}/${DEMO.item}`).replace('aria-label="QR-Code"', `aria-label="QR-Code: ${BASE}/${DEMO.item}"`))
    .replace('{{DEMO_JSON}}', esc(HOME.de.json))
    .replace('{{CHECK}}', CHECK_FORM(prefix));
  return `${head({ BASE, page: g, prefix, schema })}
<body class="doc">
${nav(g.lang, prefix)}
<main class="container doc__grid">
<article class="doc__main">
  <h1>${g.h1}</h1>
  <p class="lead">${g.lede}</p>
  <p class="doc__meta">${de ? 'Stand' : 'Updated'} <time datetime="${UPDATED}">${de ? '8. November 2026' : '8 November 2026'}</time></p>
  <p class="doc__action"><a class="text-link" href="${prefix}editor/">${de ? 'Pass im Editor anlegen' : 'Create a passport in the editor'}</a></p>
  <div class="prose">${body}</div>
  ${g.faq.length ? `<h2 class="doc__h2">${de ? 'Kurz beantwortet' : 'Short answers'}</h2><dl class="qa">${g.faq.map(([q, a]) => `<dt>${q}</dt><dd>${a}</dd>`).join('')}</dl>` : ''}
  <h2 class="doc__h2">${de ? 'Quellen' : 'Sources'}</h2>
  <ul class="sources">${g.sources.map(([u, t]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul>
</article>
<aside class="doc__aside">
  <div class="aside-box cut">
    <p class="aside-box__title">${de ? 'Pass direkt im Browser anlegen' : 'Create a passport in your browser'}</p>
    <p>${de ? 'Mit Pflichtfeld-Prüfung, QR-Code und Download als JSON.' : 'With required-field checks, QR code and JSON download.'}</p>
    <a class="key key--primary" href="${prefix}editor/">${de ? 'Editor öffnen' : 'Open the editor'}</a>
  </div>
</aside>
</main>
${footer(g.lang, prefix)}
</body>
</html>
`;
}

export function buildWebsite({ BASE, OUT }) {
  const pages = [];
  for (const c of [HOME.de, HOME.en]) { out(OUT, `${c.path}index.html`, home(BASE, c)); pages.push(c); }
  for (const g of GUIDES) { out(OUT, `${g.path}index.html`, guide(BASE, g)); pages.push(g); }

  const alt = (p) => (p.alt != null ? `\n    <xhtml:link rel="alternate" hreflang="${p.path.startsWith('en/') ? 'de' : 'en'}" href="${BASE}/${p.alt}"/>\n    <xhtml:link rel="alternate" hreflang="${p.path.startsWith('en/') ? 'en' : 'de'}" href="${BASE}/${p.path}"/>` : '');
  const urls = [...pages.map((p) => `  <url>\n    <loc>${BASE}/${p.path}</loc>\n    <lastmod>${UPDATED}</lastmod>${alt(p)}\n  </url>`), `  <url>\n    <loc>${BASE}/editor/</loc>\n    <lastmod>${UPDATED}</lastmod>\n  </url>`, ...Object.values(DEMO).map((p) => `  <url>\n    <loc>${BASE}/${p}</loc>\n  </url>`)];
  out(OUT, 'sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);

  out(OUT, GSC_FILE, `google-site-verification: ${GSC_FILE}`);
  out(OUT, `${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
  out(OUT, 'llms.txt', `# Passwerk

> Open-source (PolyForm Shield 1.0.0) generator for EU digital product passports and battery passports. One JSON file per product model becomes static passport pages with GS1 Digital Link QR codes, hosted on GitHub Pages or any web server. Browser editor with required-field checks and an optional AI import of datasheets via the user's own Anthropic API key.

## Pages
- [Digitaler Produktpass (Deutsch)](${BASE}/): overview
- [Digital product passport (English)](${BASE}/en/): overview
- [Batteriepass erstellen](${BASE}/batteriepass/): Annex XIII fields, access levels, QR code rules
- [EU battery passport](${BASE}/en/battery-passport/): the same in English
- [Ab wann Pflicht](${BASE}/digitaler-produktpass-ab-wann/): deadlines for batteries and ESPR product groups
- [Pflicht-Check](${BASE}/batteriepass-pflicht-check/): four questions decide whether a battery needs a passport
- [Beispiel](${BASE}/digitaler-produktpass-beispiel/): a live example passport
- [passports.json](${BASE}/passports.json): machine-readable index of all passports on this site
- [DPP-Software](${BASE}/dpp-software/), [DPP software](${BASE}/en/dpp-software/): what the tool covers and what it does not
- [Editor](${BASE}/editor/): create a passport in the browser
- [Source code](${REPO})

## Facts
- Battery passport mandatory from 18 February 2027 for LMT, industrial (> 2 kWh) and EV batteries: Regulation (EU) 2023/1542, Art. 77(1).
- QR code on all batteries from 18 February 2027: Art. 13(6).
- Passwerk publishes only the public part (Annex XIII point 1) and has no access control.
`);
  out(OUT, '404.html', `${head({ BASE, page: { path: '404.html', lang: 'de', alt: null, title: 'Seite nicht gefunden | Passwerk', description: 'Diese Seite gibt es nicht.' }, prefix: `${new URL(BASE).pathname.replace(/\/?$/, '/')}`, schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Seite nicht gefunden' } }).replace('<link rel="canonical"', '<meta name="robots" content="noindex">\n<link rel="canonical"')}
<body class="doc">
${nav('de', new URL(BASE).pathname.replace(/\/?$/, '/'))}
<main class="container notfound"><h1>Diese Seite gibt es nicht</h1><p class="lead">Vielleicht hat sich die Seriennummer geändert. Prüfen Sie den QR-Code oder öffnen Sie die <a href="${BASE}/">Startseite</a>.</p></main>
</body>
</html>
`);
  console.log(`  Website: ${pages.length} Seiten, sitemap.xml, llms.txt, 404.html`);
}
