// Texts of the project website. Every legal statement names its source.
// Checked against EUR-Lex on 8 November 2026.

export const REPO = 'https://github.com/BrickyStudios/digitaler-produktpass';
export const UPDATED = '2026-11-08';
export const EURLEX_BATT = 'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32023R1542';
export const EURLEX_BATT_EN = 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1542';
export const EURLEX_ESPR = 'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R1781';
export const EURLEX_ESPR_EN = 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1781';
export const ESPR_PAGE = 'https://commission.europa.eu/energy-climate-change-environment/standards-tools-and-labels/products-labelling-rules-and-requirements/ecodesign-sustainable-products-regulation_en';

// Demo passport used in screenshots and links (GS1 prefix 952 is reserved for examples).
export const DEMO = { model: '01/09520123456788/', item: '01/09520123456788/21/AK500-000123/', item2: '01/09520123456788/21/AK500-000124/', shirt: '01/09520987654320/' };

const nav = {
  de: { links: [['batteriepass/', 'Batteriepass'], ['digitaler-produktpass-ab-wann/', 'Fristen'], ['digitaler-produktpass-beispiel/', 'Beispiel'], ['en/', 'English']], action: 'Editor öffnen', home: 'Passwerk, zur Startseite' },
  en: { links: [['en/battery-passport/', 'Battery passport'], ['en/dpp-software/', 'DPP software'], ['', 'Deutsch']], action: 'Open the editor', home: 'Passwerk, home' },
};

const footer = {
  de: {
    line: 'Digitale Produktpässe zum Selbsthosten.',
    cols: [
      ['Ratgeber', [['batteriepass/', 'Batteriepass erstellen'], ['digitaler-produktpass-ab-wann/', 'Ab wann Pflicht'], ['digitaler-produktpass-beispiel/', 'Beispiel ansehen'], ['dpp-software/', 'DPP-Software']]],
      ['English', [['en/', 'Digital product passport'], ['en/battery-passport/', 'Battery passport'], ['en/dpp-software/', 'DPP software']]],
      ['Projekt', [['editor/', 'Editor'], [REPO, 'Quellcode'], [`${REPO}/issues`, 'Fehler melden'], [`${REPO}/blob/main/LICENSE`, 'Lizenz']]],
    ],
    legal: 'Lizenz PolyForm Shield 1.0.0. Keine Rechtsberatung. Alle Beispieldaten sind erfunden.',
  },
  en: {
    line: 'Self-hosted digital product passports.',
    cols: [
      ['Guides', [['en/battery-passport/', 'Battery passport'], ['en/dpp-software/', 'DPP software'], ['digitaler-produktpass-beispiel/', 'Example (German)']]],
      ['Deutsch', [['', 'Digitaler Produktpass'], ['batteriepass/', 'Batteriepass erstellen'], ['digitaler-produktpass-ab-wann/', 'Ab wann Pflicht']]],
      ['Project', [['editor/', 'Editor'], [REPO, 'Source code'], [`${REPO}/issues`, 'Report a bug'], [`${REPO}/blob/main/LICENSE`, 'Licence']]],
    ],
    legal: 'Licence PolyForm Shield 1.0.0. Not legal advice. All sample data is made up.',
  },
};
export const CHROME = { nav, footer };

const demoJson = `{
  "template": "battery",
  "gtin": "09520123456788",
  "productName": "Akku 500 Wh",
  "category": "lmt",
  "chemistry": "Li-Ion NMC 811",
  "ratedCapacityAh": 13.9,
  "voltage": "30 V / 36 V / 42 V",
  "items": [
    { "serial": "AK500-000123",
      "manufactureDate": "2026-09" }
  ]
}`;

export const HOME = {
  de: {
    path: '',
    alt: 'en/',
    title: 'Digitaler Produktpass Open Source: Batteriepass erstellen',
    description: 'Passwerk erstellt digitale Produktpässe und EU-Batteriepässe mit QR-Code. Quellcode offen, ohne Abo, gehostet auf GitHub Pages. Mit KI-Import aus Datenblättern.',
    h1: 'Digitaler Produktpass aus einer JSON-Datei',
    lede: 'Batteriepass mit QR-Code, gehostet auf GitHub Pages, ohne Abo.',
    primary: 'Pass im Editor anlegen',
    secondary: 'Quellcode auf GitHub',
    terms: 'Kostenlos, auch im Unternehmen. Lizenz PolyForm Shield 1.0.0.',
    file: 'passports/akku.json',
    json: demoJson,
    shotAlt: 'Passseite des Beispiel-Akkus mit Name, GTIN, Seriennummer, QR-Code und den ersten Pflichtfeldern',
    caption: 'Links die Datei, rechts die Seite hinter dem QR-Code.',
    steps: {
      h2: 'Vom Datenblatt zur Passseite',
      items: [
        { h3: 'Datenblatt einlesen', p: 'PDF hochladen. Claude trägt ein, was drinsteht, und markiert jeden Vorschlag.', img: 'editor-ki.webp', w: 1368, h: 1500, alt: 'Editor mit geöffnetem KI-Import: eingefügter Datenblatt-Text, API-Schlüssel, Meldung über neun vorgeschlagene Felder' },
        { h3: 'Pflichtangaben prüfen', p: 'Fehlt eine Angabe aus Anhang XIII, nennt die Liste sie mit Fundstelle.', img: 'editor-pruefung.webp', w: 1368, h: 1858, alt: 'Prüfliste mit drei fehlenden Angaben über der Vorschau der Passseite' },
        { h3: 'Veröffentlichen', p: 'JSON-Datei committen. Jede Seriennummer bekommt eine Seite mit eigenem QR-Code.', img: 'passseite-handy.webp', w: 780, h: 1688, alt: 'Passseite einer einzelnen Seriennummer auf dem Handy' },
      ],
    },
    bento: {
      h2: 'Was jede Passseite mitbringt',
      qr: { h3: 'QR-Code nach GS1 Digital Link', p: 'Jede Handykamera liest ihn.', link: 'Beispiel öffnen' },
      fields: { h3: 'Alle öffentlichen Felder aus Anhang XIII', p: 'Jedes Feld mit Fundstelle.', rows: [['Nennkapazität', 'Anh. XIII 1(g)'], ['Löschmittel', 'Anh. VI A Nr. 9'], ['Konformitätserklärung', 'Anh. XIII 1(r)']] },
      data: { h3: 'Maschinenlesbar', p: 'JSON und schema.org-Product in jeder Seite.' },
      host: { h3: 'Keine laufenden Kosten', p: 'Statische Dateien. Jeder Webspace reicht.' },
      key: { h3: 'Ihr Schlüssel, Ihr Browser', p: 'Das Datenblatt geht direkt an Anthropic, nie an Passwerk.' },
    },
    deadlines: {
      h2: 'Fristen aus der Batterieverordnung',
      lede: 'Verordnung (EU) 2023/1542, Stand 8. November 2026.',
      head: ['Ab', 'Pflicht', 'Fundstelle'],
      rows: [
        ['18.08.2025', 'Symbol für getrennte Sammlung auf jeder Batterie', 'Art. 13 Abs. 4'],
        ['18.08.2026 oder später', 'Etikett mit Hersteller, Chemie, Gewicht und Kapazität', 'Art. 13 Abs. 1'],
        ['18.02.2027', 'QR-Code auf jeder Batterie', 'Art. 13 Abs. 6'],
        ['18.02.2027', 'Batteriepass für LMT-, Industrie- (über 2 kWh) und Elektrofahrzeugbatterien', 'Art. 77 Abs. 1'],
      ],
      more: ['digitaler-produktpass-ab-wann/', 'Fristen für alle Produkte'],
    },
    faq: {
      h2: 'Fragen vor dem ersten Pass',
      items: [
        ['Reicht GitHub Pages für die Pflicht?', 'Die Verordnung schreibt kein Hosting vor. Sie verlangt aber, dass der Pass erreichbar bleibt, auch wenn Ihr Unternehmen aufhört (Art. 78 Buchst. e). Ein GitHub-Konto allein sichert das nicht. Legen Sie die Seiten zusätzlich auf eine eigene Domain mit Hosting-Vertrag.'],
        ['Was ist mit Daten, die nicht öffentlich sein dürfen?', 'Detaillierte Zusammensetzung, Demontage und Prüfberichte (Anhang XIII Nr. 2 bis 4) bekommen nur Berechtigte. Passwerk veröffentlicht den öffentlichen Teil und nennt für den Rest einen Kontakt. Eine Zugriffssteuerung hat es nicht.'],
        ['Brauche ich eine GTIN?', 'Nein. Ohne GTIN liegen die Pässe unter /p/kurzname/. Die Kennung muss aber den Normen ISO/IEC 15459 folgen (Art. 77 Abs. 3). Eine GTIN von GS1 erfüllt das.'],
        ['Darf meine Firma Passwerk nutzen?', 'Ja, kostenlos und mit eigenen Änderungen. Die Lizenz PolyForm Shield verbietet nur, Passwerk als konkurrierendes Produkt anzubieten. Eine Open-Source-Lizenz im Sinne der OSI ist sie nicht.'],
        ['Ist das Rechtsberatung?', 'Nein. Passwerk bildet die Felder aus dem Gesetzestext ab. Ob Ihr Pass vollständig ist, klären Sie in Ihrer Konformitätsbewertung.'],
      ],
    },
    close: {
      h2: 'Vier Befehle bis zur ersten Passseite',
      p: 'Node 20 oder neuer, keine Abhängigkeiten. Für GitHub Pages: forken, bei Settings unter Pages „GitHub Actions“ wählen, JSON-Dateien in passports/ legen.',
      code: ['git clone https://github.com/BrickyStudios/digitaler-produktpass', 'cd digitaler-produktpass', 'npm run build', '  beispiel-ebike-akku.json → 01/09520123456788/ (+2 Seriennummern)', '  example-tshirt.json → 01/09520987654320/ (+0 Seriennummern)', '  fertig: _site/ für http://localhost:8080', 'npm run preview'],
      comment: '# Pässe liegen in passports/, die fertigen Seiten in _site/',
      fork: 'Repository forken',
      readme: 'Anleitung im README',
    },
  },

  en: {
    path: 'en/',
    alt: '',
    title: 'Open-source digital product passport and battery passport',
    description: 'Passwerk turns a JSON file into an EU digital product passport or battery passport with a QR code. Source available, no subscription, hosted on GitHub Pages.',
    h1: 'Digital product passports from one JSON file',
    lede: 'Battery passports with QR codes, hosted on GitHub Pages, no subscription.',
    primary: 'Create a passport',
    secondary: 'Source on GitHub',
    terms: 'Free, also for companies. Licence PolyForm Shield 1.0.0.',
    file: 'passports/battery.json',
    json: demoJson,
    shotAlt: 'Passport page of the sample battery with name, GTIN, serial number, QR code and the first required fields',
    caption: 'The file on the left, the page behind the QR code on the right.',
    steps: {
      h2: 'From datasheet to passport page',
      items: [
        { h3: 'Read the datasheet', p: 'Upload the PDF. Claude fills in what it states and marks every suggestion.', img: 'editor-ki.webp', w: 1368, h: 1500, alt: 'Editor with the AI import open: pasted datasheet text, API key, a note that nine fields were suggested' },
        { h3: 'Check the required fields', p: 'Anything missing from Annex XIII shows up in a list, with its reference.', img: 'editor-pruefung.webp', w: 1368, h: 1858, alt: 'Check list with three missing fields above the passport preview' },
        { h3: 'Publish', p: 'Commit the JSON file. Each serial number gets a page with its own QR code.', img: 'passseite-handy.webp', w: 780, h: 1688, alt: 'Passport page of a single serial number on a phone' },
      ],
    },
    bento: {
      h2: 'What every passport page includes',
      qr: { h3: 'QR code as GS1 Digital Link', p: 'Any phone camera reads it.', link: 'Open the example' },
      fields: { h3: 'Every public field from Annex XIII', p: 'Each field with its legal reference.', rows: [['Rated capacity', 'Annex XIII 1(g)'], ['Extinguishing agent', 'Annex VI A no. 9'], ['Declaration of conformity', 'Annex XIII 1(r)']] },
      data: { h3: 'Machine-readable', p: 'JSON and a schema.org Product in every page.' },
      host: { h3: 'No running costs', p: 'Static files. Any web space will do.' },
      key: { h3: 'Your key, your browser', p: 'The datasheet goes straight to Anthropic, never to Passwerk.' },
    },
    deadlines: {
      h2: 'Deadlines in the Batteries Regulation',
      lede: 'Regulation (EU) 2023/1542, as of 8 November 2026.',
      head: ['From', 'Obligation', 'Reference'],
      rows: [
        ['18 Aug 2025', 'Separate collection symbol on every battery', 'Art. 13(4)'],
        ['18 Aug 2026 or later', 'Label with manufacturer, chemistry, weight and capacity', 'Art. 13(1)'],
        ['18 Feb 2027', 'QR code on every battery', 'Art. 13(6)'],
        ['18 Feb 2027', 'Battery passport for LMT, industrial (above 2 kWh) and electric vehicle batteries', 'Art. 77(1)'],
      ],
      more: ['en/battery-passport/', 'Battery passport contents'],
    },
    faq: {
      h2: 'Questions before the first passport',
      items: [
        ['Is GitHub Pages enough to comply?', 'The regulation does not prescribe hosting. It does require the passport to stay available after your company stops trading (Art. 78(e)). A GitHub account alone does not guarantee that, so also publish the pages on your own domain under a hosting contract.'],
        ['What about data that must not be public?', 'Detailed composition, dismantling information and test reports (Annex XIII points 2 to 4) are for authorised parties only. Passwerk publishes the public part and names a contact for the rest. It has no access control.'],
        ['Do I need a GTIN?', 'No. Without a GTIN the passports live under /p/short-name/. The identifier must follow ISO/IEC 15459 (Art. 77(3)), which a GS1 GTIN does.'],
        ['May my company use Passwerk?', 'Yes, free of charge and with your own changes. The PolyForm Shield licence only forbids offering Passwerk as a competing product. It is not an OSI open-source licence.'],
        ['Is this legal advice?', 'No. Passwerk maps the fields of the legal text. Whether your passport is complete is part of your conformity assessment.'],
      ],
    },
    close: {
      h2: 'Four commands to your first passport page',
      p: 'Node 20 or newer, no dependencies. For GitHub Pages: fork, choose “GitHub Actions” under Settings, Pages, and put your JSON files in passports/.',
      code: ['git clone https://github.com/BrickyStudios/digitaler-produktpass', 'cd digitaler-produktpass', 'npm run build', '  beispiel-ebike-akku.json → 01/09520123456788/ (+2 Seriennummern)', '  example-tshirt.json → 01/09520987654320/ (+0 Seriennummern)', '  fertig: _site/ für http://localhost:8080', 'npm run preview'],
      comment: '# passports/ holds the data, _site/ the finished pages',
      fork: 'Fork the repository',
      readme: 'Instructions in the README',
    },
  },
};

// Guides: long documents. `body` is trusted HTML written here.
export const GUIDES = [
  {
    path: 'batteriepass/', lang: 'de', alt: 'en/battery-passport/',
    title: 'Batteriepass erstellen: Pflichtangaben nach Anhang XIII',
    description: 'Welche Batterien ab 18.02.2027 einen digitalen Batteriepass brauchen, welche Angaben öffentlich sein müssen und wie Sie ihn kostenlos erstellen.',
    h1: 'Batteriepass erstellen',
    lede: 'Ab dem 18. Februar 2027 braucht jede LMT-, Industrie- und Elektrofahrzeugbatterie einen digitalen Pass. Hier steht, was hineingehört und wer was sehen darf.',
    body: `
<h2>Welche Batterien einen Pass brauchen</h2>
<p>Nach Art. 77 Abs. 1 der Batterieverordnung braucht ab dem 18. Februar 2027 jede Batterie einen Batteriepass, die in Verkehr gebracht oder in Betrieb genommen wird und zu einer dieser Gruppen gehört:</p>
<ul>
<li>LMT-Batterien, also Batterien für leichte Verkehrsmittel wie E-Bikes und E-Scooter, unabhängig von der Kapazität</li>
<li>Industriebatterien mit mehr als 2 kWh</li>
<li>Elektrofahrzeugbatterien</li>
</ul>
<p>Gerätebatterien und Starterbatterien brauchen keinen Pass. Sie tragen ab demselben Tag aber einen QR-Code, der zu ihren Pflichtinformationen führt (Art. 13 Abs. 6).</p>

<h2>Was öffentlich im Pass steht</h2>
<p>Anhang XIII Nr. 1 listet die Angaben zum Batteriemodell, die jeder sehen darf:</p>
<ul>
<li><strong>Etikettangaben aus Anhang VI Teil A:</strong> Hersteller, Kategorie, Herstellungsort und -datum, Gewicht, Kapazität, Chemie, gefährliche Stoffe, Löschmittel und kritische Rohstoffe über 0,1 Gewichtsprozent</li>
<li><strong>Herkunft und Umwelt:</strong> Materialzusammensetzung, CO₂-Fußabdruck, Bericht zur Sorgfaltspflicht, Rezyklatanteil, Anteil erneuerbarer Materialien</li>
<li><strong>Leistung und Haltbarkeit:</strong> Nennkapazität, Spannungen, Leistung, Lebensdauer in Zyklen mit Prüfnorm, Temperaturbereich, Garantiezeit, Energieeffizienz, Innenwiderstand, C-Rate; bei Elektrofahrzeugbatterien die Kapazitätsschwelle für Erschöpfung</li>
<li><strong>Konformität:</strong> Kennzeichnungen nach Art. 13, die EU-Konformitätserklärung und die Informationen zu Rücknahme und Recycling nach Art. 74</li>
</ul>
<p>Passwerk hat für jeden dieser Punkte ein Feld, mit der Fundstelle daneben. Der Editor und der Build melden fehlende Pflichtangaben, bevor eine Seite online geht.</p>

<h2>Was nur Berechtigte sehen dürfen</h2>
<p>Drei Teile des Passes sind nicht öffentlich:</p>
<ul>
<li><strong>Nr. 2, für Personen mit berechtigtem Interesse und die Kommission:</strong> Zusammensetzung von Kathode, Anode und Elektrolyt, Teilenummern und Bezugsquellen für Ersatzteile, Demontageanleitung, Sicherheitsmaßnahmen</li>
<li><strong>Nr. 3, nur für benannte Stellen, Marktüberwachung und Kommission:</strong> Prüfberichte</li>
<li><strong>Nr. 4, für Berechtigte, je einzelner Batterie:</strong> Leistungswerte, Gesundheitszustand, Status (Original, wiederverwendet, umgewidmet, wiederaufbereitet oder Abfall) und Nutzungsdaten wie Ladezyklen</li>
</ul>
<p>Wer als berechtigt gilt, regelt ein Durchführungsrechtsakt nach Art. 77 Abs. 9. Passwerk veröffentlicht nur Nr. 1 und zeigt für den Rest einen Kontakt an. Eine Zugriffssteuerung baut es nicht.</p>

<h2>QR-Code und eindeutige Kennung</h2>
<p>Der Pass ist über den QR-Code erreichbar, der auf eine eindeutige Kennung verweist (Art. 77 Abs. 3). Kennung und Code müssen den Normen ISO/IEC 15459-1 bis -6 entsprechen. GS1 ist eine Vergabestelle nach dieser Normreihe; eine GTIN mit Seriennummer erfüllt die Anforderung.</p>
<p>Passwerk legt jede Seite unter einer GS1-Digital-Link-Adresse ab: <code>/01/&lt;GTIN&gt;/21/&lt;Seriennummer&gt;/</code>. Der QR-Code wird mit Fehlerkorrektur M und Ruhezone erzeugt. Auf die Batterie gehört er gedruckt oder graviert, gut lesbar und dauerhaft; geht das nicht, auf Verpackung und Begleitpapiere (Art. 13 Abs. 7).</p>

<h2>Technische Anforderungen an das System</h2>
<p>Art. 77 Abs. 5 verlangt offene Standards, ein maschinenlesbares, strukturiertes und durchsuchbares Format ohne Bindung an einen Anbieter. Passwerk schreibt die Daten als JSON-Datei und zusätzlich als schema.org-Product in jede Seite. Die Dateien liegen in Ihrem Repository.</p>
<p>Art. 78 fordert außerdem kostenlosen Zugang, Speicherung durch Sie oder einen beauftragten Betreiber und dass der Pass erreichbar bleibt, wenn Ihr Unternehmen aufhört. Für den letzten Punkt reicht ein GitHub-Konto allein nicht. Spiegeln Sie die Seiten auf eine eigene Domain mit Hosting-Vertrag.</p>

<h2>So erstellen Sie den Pass mit Passwerk</h2>
<ol>
<li>Öffnen Sie den <a href="../editor/">Editor</a> und wählen Sie die Vorlage Batteriepass.</li>
<li>Füllen Sie die Felder aus oder lassen Sie Claude das Datenblatt lesen. Jeder KI-Vorschlag bleibt markiert, bis Sie ihn ändern.</li>
<li>Laden Sie die JSON-Datei herunter und legen Sie sie in den Ordner <code>passports/</code> Ihres Forks.</li>
<li>Nach dem Push baut GitHub Actions die Seiten. Den QR-Code jeder Seriennummer finden Sie als <code>qr.svg</code> neben ihrer Seite.</li>
</ol>`,
    sources: [[EURLEX_BATT, 'Verordnung (EU) 2023/1542 (Batterieverordnung) auf EUR-Lex'], [EURLEX_ESPR, 'Verordnung (EU) 2024/1781 (Ökodesign) auf EUR-Lex']],
    faq: [
      ['Ab wann gilt der Batteriepass?', 'Ab dem 18. Februar 2027 für LMT-, Industrie- (über 2 kWh) und Elektrofahrzeugbatterien (Art. 77 Abs. 1 der Verordnung (EU) 2023/1542).'],
      ['Braucht ein E-Bike-Akku einen Batteriepass?', 'Ja. E-Bike-Akkus sind LMT-Batterien und brauchen ab dem 18. Februar 2027 einen Batteriepass, unabhängig von ihrer Kapazität.'],
    ],
  },

  {
    path: 'digitaler-produktpass-ab-wann/', lang: 'de', alt: null,
    title: 'Digitaler Produktpass: Ab wann ist er Pflicht?',
    description: 'Batteriepass ab 18.02.2027, EU-Register seit Juli 2026, Textilien und Möbel folgen per delegiertem Rechtsakt. Alle Fristen mit Fundstelle.',
    h1: 'Ab wann der digitale Produktpass Pflicht ist',
    lede: 'Zuerst für Batterien, danach Produktgruppe für Produktgruppe. Hier stehen die Termine, die schon im Gesetz stehen, und was noch offen ist.',
    body: `
<h2>Batterien: feste Termine</h2>
<div class="table-wrap"><table>
<thead><tr><th>Ab</th><th>Pflicht</th><th>Fundstelle</th></tr></thead>
<tbody>
<tr><td class="num">18.08.2025</td><td>Symbol für getrennte Sammlung auf jeder Batterie</td><td>Art. 13 Abs. 4</td></tr>
<tr><td class="num">18.08.2026 oder später</td><td>Etikett mit den Angaben aus Anhang VI Teil A, frühestens 18 Monate nach dem Durchführungsrechtsakt</td><td>Art. 13 Abs. 1</td></tr>
<tr><td class="num">18.02.2027</td><td>QR-Code auf jeder Batterie</td><td>Art. 13 Abs. 6</td></tr>
<tr><td class="num">18.02.2027</td><td>Batteriepass für LMT-, Industrie- (über 2 kWh) und Elektrofahrzeugbatterien</td><td>Art. 77 Abs. 1</td></tr>
</tbody></table></div>
<p>Die Batterieverordnung wird gerade über ein Omnibus-Verfahren der EU in Teilen geändert. Prüfen Sie vor dem Stichtag den konsolidierten Text auf EUR-Lex.</p>

<h2>Alle anderen Produkte: die Ökodesign-Verordnung</h2>
<p>Die Ökodesign-Verordnung (EU) 2024/1781, kurz ESPR, gilt seit dem 18. Juli 2024. Sie legt fest, wie ein digitaler Produktpass technisch aussehen muss (Art. 9 bis 11). Welche Produkte einen Pass brauchen und welche Angaben hineingehören, bestimmt sie selbst aber nicht. Das regeln delegierte Rechtsakte, einer je Produktgruppe (Art. 4).</p>
<ul>
<li><strong>Register:</strong> Bis zum 19. Juli 2026 musste die Kommission ein Register einrichten, das mindestens die eindeutigen Kennungen speichert, auch die der Batteriepässe (Art. 13).</li>
<li><strong>Arbeitsplan:</strong> Der erste Arbeitsplan der Kommission vom 16. April 2025, COM(2025) 187, nennt als Prioritäten unter anderem Eisen und Stahl, Aluminium, Textilien mit Schwerpunkt Bekleidung, Möbel, Reifen und Matratzen.</li>
<li><strong>Stand heute:</strong> Für diese Gruppen gilt am 8. November 2026 noch keine Passpflicht. Den Stand der delegierten Rechtsakte führt die <a href="${ESPR_PAGE}">Kommission auf ihrer ESPR-Seite</a>.</li>
</ul>

<h2>Was Sie jetzt tun können</h2>
<p>Wer Batterien in Verkehr bringt, braucht bis zum 18. Februar 2027 die vollständigen Daten aus Anhang XIII, ein festes Schema für Seriennummern und den QR-Code in der Etikettenplanung. Die <a href="../batteriepass/">Liste der Pflichtangaben</a> zeigt, was gebraucht wird.</p>
<p>Für andere Produkte lohnt sich die Vorarbeit trotzdem: Materialangaben pflegen, Lieferanten nach Stoffen fragen, Reparatur- und Entsorgungshinweise sammeln. Passwerk hat dafür eine ESPR-Vorlage mit den Feldern, die nach Art. 7 typischerweise verlangt werden. Erscheint der delegierte Rechtsakt für Ihre Gruppe, passen Sie die Felder in <code>site/lib/templates.mjs</code> an.</p>`,
    sources: [[EURLEX_BATT, 'Verordnung (EU) 2023/1542 auf EUR-Lex'], [EURLEX_ESPR, 'Verordnung (EU) 2024/1781 (ESPR) auf EUR-Lex'], [ESPR_PAGE, 'Europäische Kommission: Ecodesign for Sustainable Products Regulation']],
    faq: [
      ['Ab wann ist der digitale Produktpass Pflicht?', 'Für Batterien ab dem 18. Februar 2027 (Art. 77 der Verordnung (EU) 2023/1542). Für andere Produkte erst, wenn der delegierte Rechtsakt nach der Ökodesign-Verordnung für ihre Produktgruppe gilt. Am 8. November 2026 ist das für keine Gruppe der Fall.'],
      ['Wann kommt der digitale Produktpass für Textilien?', 'Textilien stehen im Arbeitsplan der Kommission vom 16. April 2025. Eine Pflicht entsteht erst mit dem delegierten Rechtsakt für Textilien, der am 8. November 2026 noch nicht gilt.'],
    ],
  },

  {
    path: 'digitaler-produktpass-beispiel/', lang: 'de', alt: null,
    title: 'Digitaler Produktpass: Beispiel mit QR-Code zum Ansehen',
    description: 'Ein vollständiger Beispiel-Batteriepass für einen E-Bike-Akku: Passseite, QR-Code zum Scannen, JSON-Daten und alle Pflichtfelder mit Fundstelle.',
    h1: 'Beispiel für einen digitalen Produktpass',
    lede: 'Ein erfundener E-Bike-Akku mit allen öffentlichen Angaben, so wie Passwerk ihn veröffentlicht. Scannen Sie den Code mit dem Handy oder öffnen Sie die Seiten direkt.',
    body: `
<figure class="example">
<img src="../assets/img/passseite-handy.webp" width="780" height="1688" alt="Passseite der Seriennummer AK500-000123 auf dem Handy" fetchpriority="high">
<figcaption><span class="example__qr">{{QR_ITEM}}</span>Seriennummer AK500-000123. Der Code öffnet <a href="../${DEMO.item}">diese Seite</a>.</figcaption>
</figure>

<h2>Die Seiten des Beispiels</h2>
<ul>
<li><a href="../${DEMO.model}">Modellseite</a> mit allen Angaben zum Batteriemodell</li>
<li><a href="../${DEMO.item}">Seriennummer AK500-000123</a>, hergestellt im September 2026</li>
<li><a href="../${DEMO.item2}">Seriennummer AK500-000124</a>, hergestellt im Oktober 2026</li>
<li><a href="../${DEMO.item}passport.json">Daten als JSON</a></li>
<li><a href="../${DEMO.shirt}">Zweites Beispiel: T-Shirt nach der Ökodesign-Verordnung</a> (englisch)</li>
</ul>
<p>Die GTIN beginnt mit 952. Dieses Präfix hat GS1 für Beispiele reserviert, es gehört zu keinem echten Produkt.</p>

<h2>Woraus die Seite besteht</h2>
<ul>
<li><strong>Kopf:</strong> Produktname, Art des Passes, GTIN, Seriennummer, Herstellungsmonat und der QR-Code, der auf genau diese Seite führt</li>
<li><strong>Felder:</strong> eine Zeile je Angabe aus Anhang XIII, links der Name mit Fundstelle, rechts der Wert. Leere freiwillige Felder stehen als „nicht angegeben“ da.</li>
<li><strong>Hinweis für Berechtigte:</strong> ein Kontakt für die nicht öffentlichen Angaben nach Anhang XIII Nr. 2 bis 4</li>
<li><strong>Daten:</strong> im Quelltext stehen die Angaben als JSON und als schema.org-Product, daneben liegt <code>passport.json</code></li>
</ul>

<h2>Die Datei dahinter</h2>
<p>Die ganze Seite entsteht aus einer JSON-Datei im Ordner <code>passports/</code>. Ein Ausschnitt:</p>
<pre><code>{{DEMO_JSON}}</code></pre>
<p>Kopieren Sie die Datei, ändern Sie die Werte und bauen Sie neu. Oder laden Sie im <a href="../editor/">Editor</a> das Beispiel und passen es dort an.</p>`,
    sources: [[EURLEX_BATT, 'Verordnung (EU) 2023/1542, Anhang XIII, auf EUR-Lex']],
    faq: [],
  },

  {
    path: 'dpp-software/', lang: 'de', alt: 'en/dpp-software/',
    title: 'DPP-Software: Digitale Produktpässe selbst hosten',
    description: 'Was DPP-Software nach Art. 77 und 78 können muss, was Passwerk kostenlos abdeckt und wann Sie zusätzlich einen Dienstleister brauchen.',
    h1: 'DPP-Software, die Sie selbst betreiben',
    lede: 'Passwerk deckt den öffentlichen Teil eines Produktpasses ab. Für Zugriffsrechte und Betriebsdaten brauchen Sie mehr. Die Tabelle zeigt, wo die Grenze liegt.',
    body: `
<h2>Was eine DPP-Software leisten muss</h2>
<div class="table-wrap"><table>
<thead><tr><th>Anforderung</th><th>Fundstelle</th><th>Passwerk</th></tr></thead>
<tbody>
<tr><td>Pflichtangaben erfassen und prüfen</td><td>Anh. XIII Nr. 1</td><td>Ja, im Editor und beim Build</td></tr>
<tr><td>Eindeutige Kennung und QR-Code</td><td>Art. 77 Abs. 3</td><td>Ja, GS1 Digital Link</td></tr>
<tr><td>Offenes, maschinenlesbares Format</td><td>Art. 77 Abs. 5</td><td>Ja, JSON und schema.org</td></tr>
<tr><td>Kostenloser Zugang</td><td>Art. 78 Buchst. b</td><td>Ja, statische Seiten</td></tr>
<tr><td>Erreichbar nach Geschäftsaufgabe</td><td>Art. 78 Buchst. e</td><td>Teilweise: Die Dateien gehören Ihnen, das Hosting regeln Sie</td></tr>
<tr><td>Zugriffsrechte für Berechtigte</td><td>Art. 78 Buchst. f</td><td>Nein, nur eine Kontaktangabe</td></tr>
<tr><td>Daten aus dem Betrieb einzelner Batterien</td><td>Anh. XIII Nr. 4</td><td>Nein</td></tr>
<tr><td>Kennungen ans EU-Register melden</td><td>ESPR Art. 13</td><td>Nein</td></tr>
</tbody></table></div>

<h2>Wann Passwerk reicht</h2>
<p>Sie bringen wenige Modelle in Verkehr, die Modelldaten ändern sich selten und die Seriennummern kommen aus einer Liste. Dann pflegen Sie eine JSON-Datei je Modell und hängen neue Seriennummern an. Jeder Push veröffentlicht die neuen Seiten.</p>

<h2>Wann Sie mehr brauchen</h2>
<p>Wenn der Pass Daten aus dem Batteriemanagement zeigen muss, wenn Berechtigte sich anmelden sollen oder wenn täglich Tausende Seriennummern aus dem ERP kommen. Dafür brauchen Sie eine Datenbank, eine Anmeldung und Schnittstellen. Passwerk kann dann die öffentliche Seite liefern, der Rest läuft woanders.</p>

<h2>Kosten</h2>
<ul>
<li><strong>Passwerk:</strong> kostenlos, auch im Unternehmen (Lizenz PolyForm Shield 1.0.0)</li>
<li><strong>Hosting:</strong> GitHub Pages ist für öffentliche Repositorys kostenlos; eine eigene Domain kostet wenige Euro im Jahr</li>
<li><strong>GTIN:</strong> setzt eine kostenpflichtige Mitgliedschaft bei GS1 voraus</li>
<li><strong>KI-Import:</strong> rechnet Anthropic nach Verbrauch direkt mit Ihnen ab</li>
</ul>`,
    sources: [[EURLEX_BATT, 'Verordnung (EU) 2023/1542, Art. 77 und 78, auf EUR-Lex'], [EURLEX_ESPR, 'Verordnung (EU) 2024/1781, Art. 13, auf EUR-Lex']],
    faq: [
      ['Gibt es kostenlose DPP-Software?', 'Passwerk ist kostenlos und quelloffen. Es erzeugt die öffentlichen Passseiten mit QR-Code als statische Dateien; Zugriffsrechte für Berechtigte und Betriebsdaten deckt es nicht ab.'],
    ],
  },

  {
    path: 'en/battery-passport/', lang: 'en', alt: 'batteriepass/',
    title: 'EU battery passport: required data under Annex XIII',
    description: 'Which batteries need a digital battery passport from 18 February 2027, which data must be public, who may see the rest, and how to create one for free.',
    h1: 'Create an EU battery passport',
    lede: 'From 18 February 2027 every LMT, industrial and electric vehicle battery needs a digital passport. This page lists what goes into it and who may see what.',
    body: `
<h2>Which batteries need a passport</h2>
<p>Under Art. 77(1) of the Batteries Regulation, from 18 February 2027 every battery placed on the market or put into service needs a battery passport if it is:</p>
<ul>
<li>an LMT battery, for light means of transport such as e-bikes and e-scooters, regardless of capacity</li>
<li>an industrial battery with a capacity above 2 kWh</li>
<li>an electric vehicle battery</li>
</ul>
<p>Portable and SLI (starter) batteries need no passport, but from the same date they carry a QR code that leads to their required information (Art. 13(6)).</p>

<h2>What the public can see</h2>
<p>Annex XIII point 1 lists the battery model data open to everyone:</p>
<ul>
<li><strong>Label data from Annex VI Part A:</strong> manufacturer, category, place and date of manufacture, weight, capacity, chemistry, hazardous substances, extinguishing agent and critical raw materials above 0.1 % by weight</li>
<li><strong>Origin and environment:</strong> material composition, carbon footprint, due diligence report, recycled content, renewable content</li>
<li><strong>Performance and durability:</strong> rated capacity, voltages, power, expected lifetime in cycles with the reference test, temperature range, warranty, round-trip efficiency, internal resistance, C-rate; for EV batteries the capacity threshold for exhaustion</li>
<li><strong>Conformity:</strong> markings under Art. 13, the EU declaration of conformity and take-back and recycling information under Art. 74</li>
</ul>

<h2>What only authorised parties may see</h2>
<ul>
<li><strong>Point 2, persons with a legitimate interest and the Commission:</strong> detailed cathode, anode and electrolyte composition, part numbers and spare part sources, dismantling information, safety measures</li>
<li><strong>Point 3, notified bodies, market surveillance and the Commission only:</strong> test reports</li>
<li><strong>Point 4, per individual battery:</strong> performance values, state of health, status (original, re-used, repurposed, remanufactured or waste) and usage data such as charge cycles</li>
</ul>
<p>An implementing act under Art. 77(9) defines who counts as having a legitimate interest. Passwerk publishes point 1 only and shows a contact for the rest. It does not build access control.</p>

<h2>QR code and unique identifier</h2>
<p>The passport is reached through the QR code, which links to a unique identifier compliant with ISO/IEC 15459 parts 1 to 6 (Art. 77(3)). GS1 is an issuing agency under that series, so a GTIN with a serial number meets the requirement. Passwerk publishes each page at a GS1 Digital Link path, <code>/01/&lt;GTIN&gt;/21/&lt;serial&gt;/</code>, and draws the QR code with error correction level M and a quiet zone.</p>

<h2>Requirements for the system</h2>
<p>Art. 77(5) asks for open standards and a machine-readable, structured, searchable format without vendor lock-in. Passwerk writes the data as JSON and as a schema.org Product inside each page; the files live in your repository. Art. 78 adds free access and that the passport stays available if your company stops trading. A GitHub account alone does not guarantee the last point, so mirror the pages on your own domain.</p>

<h2>Create the passport with Passwerk</h2>
<ol>
<li>Open the <a href="../../editor/">editor</a> (German interface) and pick the battery template.</li>
<li>Fill in the fields or let Claude read the datasheet. Each AI suggestion stays marked until you change it.</li>
<li>Download the JSON file and put it in <code>passports/</code> in your fork.</li>
<li>After the push, GitHub Actions builds the pages. Each serial number gets its <code>qr.svg</code> next to its page.</li>
</ol>`,
    sources: [[EURLEX_BATT_EN, 'Regulation (EU) 2023/1542 (Batteries Regulation) on EUR-Lex'], [EURLEX_ESPR_EN, 'Regulation (EU) 2024/1781 (ESPR) on EUR-Lex']],
    faq: [
      ['When does the EU battery passport apply?', 'From 18 February 2027 for LMT, industrial (above 2 kWh) and electric vehicle batteries (Art. 77(1) of Regulation (EU) 2023/1542).'],
      ['Does an e-bike battery need a battery passport?', 'Yes. E-bike batteries are LMT batteries and need a battery passport from 18 February 2027, whatever their capacity.'],
    ],
  },

  {
    path: 'en/dpp-software/', lang: 'en', alt: 'dpp-software/',
    title: 'DPP software you host yourself: what Passwerk covers',
    description: 'What digital product passport software must do under Art. 77 and 78, what Passwerk covers for free and when you need a service provider as well.',
    h1: 'DPP software you run yourself',
    lede: 'Passwerk covers the public part of a product passport. Access rights and operating data need more. The table shows where the line is.',
    body: `
<h2>What DPP software has to do</h2>
<div class="table-wrap"><table>
<thead><tr><th>Requirement</th><th>Reference</th><th>Passwerk</th></tr></thead>
<tbody>
<tr><td>Capture and check required data</td><td>Annex XIII point 1</td><td>Yes, in the editor and at build time</td></tr>
<tr><td>Unique identifier and QR code</td><td>Art. 77(3)</td><td>Yes, GS1 Digital Link</td></tr>
<tr><td>Open, machine-readable format</td><td>Art. 77(5)</td><td>Yes, JSON and schema.org</td></tr>
<tr><td>Free access</td><td>Art. 78(b)</td><td>Yes, static pages</td></tr>
<tr><td>Available after the business closes</td><td>Art. 78(e)</td><td>Partly: you own the files, you arrange the hosting</td></tr>
<tr><td>Access rights for authorised parties</td><td>Art. 78(f)</td><td>No, a contact only</td></tr>
<tr><td>Operating data of individual batteries</td><td>Annex XIII point 4</td><td>No</td></tr>
<tr><td>Reporting identifiers to the EU registry</td><td>ESPR Art. 13</td><td>No</td></tr>
</tbody></table></div>

<h2>When Passwerk is enough</h2>
<p>You place a handful of models on the market, the model data rarely changes and serial numbers come from a list. Keep one JSON file per model and append new serial numbers. Every push publishes the new pages.</p>

<h2>When you need more</h2>
<p>If the passport has to show data from the battery management system, if authorised parties need to sign in, or if thousands of serial numbers arrive from your ERP each day, you need a database, a login and interfaces. Passwerk can still produce the public page while the rest runs elsewhere.</p>

<h2>Costs</h2>
<ul>
<li><strong>Passwerk:</strong> free, also for companies (PolyForm Shield 1.0.0)</li>
<li><strong>Hosting:</strong> GitHub Pages is free for public repositories; a domain of your own costs a few euros a year</li>
<li><strong>GTIN:</strong> requires a paid GS1 membership</li>
<li><strong>AI import:</strong> billed by Anthropic per use, directly to you</li>
</ul>`,
    sources: [[EURLEX_BATT_EN, 'Regulation (EU) 2023/1542, Art. 77 and 78, on EUR-Lex'], [EURLEX_ESPR_EN, 'Regulation (EU) 2024/1781, Art. 13, on EUR-Lex']],
    faq: [
      ['Is there free DPP software?', 'Passwerk is free and source-available. It produces the public passport pages with QR codes as static files; access rights and operating data are out of scope.'],
    ],
  },
];
