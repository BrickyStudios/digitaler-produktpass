# Plan v0.2: Was Passwerk von DPP-Flash und anderen übernehmen soll

Stand 8. November 2026. Passwerk v0.1 ist live (brickystudios.github.io/digitaler-produktpass): JSON je Modell, statische Passseiten mit GS1-Digital-Link-QR, Editor mit Pflichtfeld-Prüfung und KI-Import (eigener Anthropic-Schlüssel), GitHub Actions baut und veröffentlicht. Kein Server, kein Konto, Lizenz PolyForm Shield.

## Ziel

Kleine Hersteller und Importeure von LMT- und Industriebatterien sollen ohne Abo einen vollständigen öffentlichen Batteriepass bis zum 18.02.2027 veröffentlichen können. Die Website soll für „digitaler produktpass“ (2.400/Monat, KD 9), „dpp software“ (590, KD 0), „batteriepass“ (260) und „batterieverordnung“ (880) ranken.

## Was der bekannteste Wettbewerber anbietet (dppflash.de, 79 bis 719 €/Monat)

Readiness-Check (10 Fragen, Score), Demo, KI-Extraktion aus mehreren Dokumenten (Datenblatt, Zertifikat, Herstellererklärung), Beleg je Feld, Lieferantenportal mit automatischen Nachfragen, CSV/XLSX-Import, Versionierung und Audit-Trail, Rollen-Sichten (Öffentlichkeit, Recycler, Prüfer), EU-Registry-Einreichung, REST-API und Webhooks, AAS-Export, SSO, 15 Jahre Hosting.

## Kandidaten (Aufwand für einen Entwickler mit Claude)

| # | Funktion | Ohne Server machbar? | Aufwand |
|---|---|---|---|
| 1 | KI-Import mit mehreren Dokumenten auf einmal | ja | 20 min |
| 2 | Beleg je Feld: KI nennt Dokument und Seite, Passseite zeigt die Quelle klein an | ja | 1 h |
| 3 | Lieferanten-Anfrage: Knopf erzeugt E-Mail (mailto) mit allen fehlenden Pflichtfeldern und Fundstellen | ja | 30 min |
| 4 | Betroffenheits-Check als eigene Seite: 5 Fragen, Ergebnis mit Pflichten, Fristen und Fundstellen; SEO-Seite „Batteriepass Pflicht prüfen“ | ja | 1,5 h |
| 5 | Etikettenbogen: druckbare A4-Seite mit allen QR-Codes eines Modells | ja | 45 min |
| 6 | Versionierung über Git: Passseite zeigt letzte Änderung und verlinkt den Verlauf | ja | 45 min |
| 7 | Seriennummern aus Excel einfügen (Tab, Semikolon) und als CSV laden | ja | 20 min |
| 8 | Index-API: /passports.json listet alle Pässe | ja | 15 min |
| 9 | Verschlüsselter Teil für Berechtigte (Anhang XIII Nr. 2 bis 4) mit Schlüssel, im Browser entschlüsselt | ja, aber sicherheitskritisch | 1 Tag |
| 10 | Mehrsprachige Passseiten | ja | 3 h |
| 11 | AAS-Export | ja | 1 Tag |
| 12 | EU-Registry-Einreichung | nein, Schnittstelle nicht öffentlich | offen |

## Offene Frage

Welche davon jetzt, welche später, welche nie? Rahmen: kein Server, kein Konto, keine laufenden Kosten für Nutzer, Passwerk bleibt ehrlich über seine Grenzen.

## Entscheidung (8. November 2026)

Bewertet nach den sechs Entscheidungsregeln von gstack /autoplan. Die volle Pipeline mit Subagenten und Freigabe-Abfrage lief nicht. Regel 2: Alles unter einem Tag Aufwand ohne neue Infrastruktur wird gebaut.

- **Gebaut in v0.2:** 1 mehrere Dokumente, 2 Quelle je Feld, 3 Lieferanten-Anfrage (mailto), 4 Pflicht-Check, 5 Etikettenbogen, 6 Versionierung über Git, 7 Seriennummern aus Excel, 8 `/passports.json`
- **Zurückgestellt:** 9 verschlüsselter Teil für Berechtigte (Kryptografie im Browser braucht ein eigenes Review), 10 mehrsprachige Seiten, 11 AAS-Export
- **Nicht geplant:** 12 EU-Registry-Einreichung, solange es keine öffentliche Schnittstelle gibt
