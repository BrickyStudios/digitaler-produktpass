// Passport templates: one list of fields drives validation, the editor form,
// the rendered page and the JSON schema for the AI import.
// `ref` points at the legal source of each field.

const f = (key, de, en, ref, opts = {}) => ({ key, label: { de, en }, ref, kind: 'text', ...opts });

export const TEMPLATES = {
  battery: {
    name: { de: 'Batteriepass (EU 2023/1542)', en: 'Battery passport (EU 2023/1542)' },
    law: { de: 'Verordnung (EU) 2023/1542, Art. 77 und Anhang XIII', en: 'Regulation (EU) 2023/1542, Art. 77 and Annex XIII' },
    groups: [
      {
        title: { de: 'Identifikation', en: 'Identification' },
        fields: [
          f('productName', 'Modellbezeichnung', 'Model name', 'Anh. VI A Nr. 2', { required: true }),
          f('manufacturer', 'Hersteller (Name, Anschrift, Kontakt)', 'Manufacturer (name, address, contact)', 'Anh. VI A Nr. 1', { required: true, kind: 'long' }),
          f('category', 'Batteriekategorie', 'Battery category', 'Anh. VI A Nr. 2', {
            required: true,
            options: [
              { value: 'lmt', de: 'LMT-Batterie (E-Bike, E-Scooter)', en: 'LMT battery (e-bike, e-scooter)' },
              { value: 'industrial', de: 'Industriebatterie über 2 kWh', en: 'Industrial battery above 2 kWh' },
              { value: 'ev', de: 'Elektrofahrzeugbatterie', en: 'Electric vehicle battery' },
              { value: 'portable', de: 'Gerätebatterie', en: 'Portable battery' },
              { value: 'sli', de: 'SLI-Batterie (Starterbatterie)', en: 'SLI battery (starter battery)' },
            ],
          }),
          f('placeOfManufacture', 'Herstellungsort (Werk)', 'Place of manufacture (plant)', 'Anh. VI A Nr. 3', { required: true }),
          f('weightKg', 'Gewicht (kg)', 'Weight (kg)', 'Anh. VI A Nr. 5', { required: true, kind: 'number' }),
          f('chemistry', 'Chemie', 'Chemistry', 'Anh. VI A Nr. 7', { required: true }),
        ],
      },
      {
        title: { de: 'Zusammensetzung', en: 'Composition' },
        fields: [
          f('hazardousSubstances', 'Gefährliche Stoffe (außer Hg, Cd, Pb)', 'Hazardous substances (other than Hg, Cd, Pb)', 'Anh. XIII 1(b), VI A Nr. 8', { required: true, kind: 'long' }),
          f('criticalRawMaterials', 'Kritische Rohstoffe über 0,1 %', 'Critical raw materials above 0.1 %', 'Anh. XIII 1(b), VI A Nr. 10', { required: true, kind: 'long' }),
          f('extinguishingAgent', 'Geeignetes Löschmittel', 'Usable extinguishing agent', 'Anh. VI A Nr. 9', { required: true }),
          f('recycledContent', 'Rezyklatanteil (Kobalt, Lithium, Nickel, Blei)', 'Recycled content (cobalt, lithium, nickel, lead)', 'Anh. XIII 1(e)', { kind: 'long' }),
          f('renewableContent', 'Anteil erneuerbarer Materialien', 'Share of renewable content', 'Anh. XIII 1(f)'),
        ],
      },
      {
        title: { de: 'Leistung und Haltbarkeit', en: 'Performance and durability' },
        fields: [
          f('ratedCapacityAh', 'Nennkapazität (Ah)', 'Rated capacity (Ah)', 'Anh. XIII 1(g), VI A Nr. 6', { required: true, kind: 'number' }),
          f('voltage', 'Spannung min. / nom. / max. (V)', 'Voltage min / nominal / max (V)', 'Anh. XIII 1(h)', { required: true }),
          f('power', 'Leistungsfähigkeit (W) und Grenzen', 'Power capability (W) and limits', 'Anh. XIII 1(i)'),
          f('expectedLifetime', 'Erwartete Lebensdauer (Zyklen, Prüfnorm)', 'Expected lifetime (cycles, reference test)', 'Anh. XIII 1(j)'),
          f('capacityThreshold', 'Kapazitätsschwelle für Erschöpfung (nur E-Fahrzeug)', 'Capacity threshold for exhaustion (EV only)', 'Anh. XIII 1(k)'),
          f('temperatureRange', 'Temperaturbereich bei Nichtgebrauch', 'Temperature range when not in use', 'Anh. XIII 1(l)'),
          f('warranty', 'Gewährleistungszeitraum (kalendarische Lebensdauer)', 'Commercial warranty (calendar life)', 'Anh. XIII 1(m)'),
          f('roundTripEfficiency', 'Energieeffizienz (anfangs / bei 50 % der Zyklen)', 'Round-trip efficiency (initial / at 50 % of cycle life)', 'Anh. XIII 1(n)'),
          f('internalResistance', 'Innenwiderstand Zelle / Pack', 'Internal resistance cell / pack', 'Anh. XIII 1(o)'),
          f('cRate', 'C-Rate des Zyklentests', 'C-rate of cycle-life test', 'Anh. XIII 1(p)'),
        ],
      },
      {
        title: { de: 'Klima und Lieferkette', en: 'Climate and supply chain' },
        fields: [
          f('carbonFootprint', 'CO₂-Fußabdruck (kg CO₂e/kWh, Klasse)', 'Carbon footprint (kg CO₂e/kWh, class)', 'Anh. XIII 1(c), Art. 7'),
          f('dueDiligenceUrl', 'Bericht zur Sorgfaltspflicht (Link)', 'Due diligence report (link)', 'Anh. XIII 1(d), Art. 52', { kind: 'url' }),
        ],
      },
      {
        title: { de: 'Konformität und Entsorgung', en: 'Conformity and end of life' },
        fields: [
          f('declarationOfConformityUrl', 'EU-Konformitätserklärung (Link)', 'EU declaration of conformity (link)', 'Anh. XIII 1(r), Art. 18', { required: true, kind: 'url' }),
          f('markings', 'Kennzeichnungen (Sammelsymbol, Kapazität …)', 'Markings (collection symbol, capacity …)', 'Anh. XIII 1(q), Art. 13'),
          f('endOfLife', 'Rücknahme, Sammlung und Recycling', 'Take-back, collection and recycling', 'Anh. XIII 1(s), Art. 74', { kind: 'long' }),
          f('restrictedAccess', 'Kontakt für Berechtigte (Anh. XIII Nr. 2 bis 4)', 'Contact for parties with legitimate interest (Annex XIII 2 to 4)', 'Art. 77 Abs. 2'),
        ],
      },
    ],
  },

  product: {
    name: { de: 'Produktpass (ESPR-Grundgerüst)', en: 'Product passport (ESPR baseline)' },
    law: { de: 'Verordnung (EU) 2024/1781, Art. 9 bis 11 und Anhang III', en: 'Regulation (EU) 2024/1781, Art. 9 to 11 and Annex III' },
    groups: [
      {
        title: { de: 'Identifikation', en: 'Identification' },
        fields: [
          f('productName', 'Produktname / Modell', 'Product name / model', 'ESPR Anh. III', { required: true }),
          f('manufacturer', 'Hersteller (Name, Anschrift, Kontakt)', 'Manufacturer (name, address, contact)', 'ESPR Anh. III', { required: true, kind: 'long' }),
          f('importer', 'Importeur / EU-Verantwortlicher', 'Importer / responsible EU operator', 'ESPR Anh. III'),
          f('countryOfOrigin', 'Herkunftsland', 'Country of origin', 'ESPR Art. 7'),
          f('commodityCode', 'Warentarifnummer (KN/TARIC)', 'Commodity code (CN/TARIC)', 'ESPR Anh. III'),
        ],
      },
      {
        title: { de: 'Material und Umwelt', en: 'Materials and environment' },
        fields: [
          f('materials', 'Materialzusammensetzung', 'Material composition', 'ESPR Art. 7', { required: true, kind: 'long' }),
          f('substancesOfConcern', 'Besorgniserregende Stoffe', 'Substances of concern', 'ESPR Art. 7', { kind: 'long' }),
          f('recycledContent', 'Rezyklatanteil', 'Recycled content', 'ESPR Art. 7'),
          f('carbonFootprint', 'CO₂-Fußabdruck', 'Carbon footprint', 'ESPR Art. 7'),
        ],
      },
      {
        title: { de: 'Nutzung, Reparatur, Recycling', en: 'Use, repair, recycling' },
        fields: [
          f('careInstructions', 'Gebrauch und Pflege', 'Use and care', 'ESPR Art. 7', { kind: 'long' }),
          f('repairInfo', 'Reparatur und Ersatzteile', 'Repair and spare parts', 'ESPR Art. 7', { kind: 'long' }),
          f('endOfLife', 'Rücknahme und Recycling', 'Take-back and recycling', 'ESPR Art. 7', { kind: 'long' }),
          f('userManualUrl', 'Bedienungsanleitung (Link)', 'User manual (link)', 'ESPR Anh. III', { kind: 'url' }),
          f('safetyInfo', 'Sicherheitshinweise', 'Safety information', 'ESPR Anh. III', { kind: 'long' }),
          f('declarationOfConformityUrl', 'Konformitätserklärung (Link)', 'Declaration of conformity (link)', 'ESPR Anh. III', { kind: 'url' }),
        ],
      },
    ],
  },
};

// German reference abbreviations, spelled out for English pages.
export const refText = (ref, lang) =>
  lang === 'en' ? ref.replace(/Anh\./g, 'Annex').replace(/Nr\./g, 'no.').replace(/ und /g, ' and ') : ref;

export const fieldsOf = (template) => TEMPLATES[template].groups.flatMap((g) => g.fields);
