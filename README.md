<!-- © 2026 Claude Hecker — NIS2 Quick-Check — AGPL-3.0 -->
![NIS2 Quick-Check Banner](nis2-quickcheck-banner.jpeg)
# NIS2 Quick-Check

Ein kostenloser, rein clientseitiger Selbst-Check zur groben Einschätzung des eigenen
Umsetzungsstands gegenüber den zehn Maßnahmenbereichen aus Art. 21(2) der NIS2-Richtlinie.

**Eigenständiges Tool** — kein Bestandteil und keine Abhängigkeit von [ISMS Builder](https://github.com/coolstartnow/isms-builder).
Eine spätere Integration (z. B. als Modul innerhalb des ISMS Builders) ist möglich, aber
bewusst nicht Teil dieses Standes.

## Nutzung

Keine Installation, kein Build-Schritt, kein Server nötig — einfach `index.html` im Browser öffnen:

```bash
xdg-open index.html   # Linux
# oder: open index.html (macOS) / Doppelklick im Explorer (Windows)
```

Alternativ mit einem beliebigen statischen Webserver ausliefern, z. B.:

```bash
python3 -m http.server 8080
```

## Funktionsumfang

- 10 Domänen × 5 Fragen (50 Fragen gesamt) nach NIS2 Art. 21(2)(a)–(j), Reifegrad-Skala 0–4
- Automatische grobe Einstufung Essential/Important nach Sektor + Unternehmensgröße
- Ergebnis-Dashboard: Balkendiagramm, Radar-Diagramm, Gap-Analyse mit Prioritäten
- Länderinformation zum im Profil gewählten Land: zuständige Behörde, nationales Gesetz, Umsetzungsstand (alle 27 EU-Mitgliedsstaaten hinterlegt)
- PDF-Export über die Druckfunktion des Browsers (kein separates PDF-Tool nötig)
- JSON-Export/Import zum Sichern, Teilen und Wiederaufnehmen einer Bewertung
- Automatisches Zwischenspeichern im Browser (`localStorage`) — nichts geht bei einem Reload verloren
- Dark Mode
- Läuft komplett lokal, keine Daten verlassen den Browser, kein Tracking, keine Cloud-Anbindung

## Sprachen

Vollständig übersetzt in alle 24 EU-Amtssprachen: Bulgarisch, Kroatisch, Tschechisch, Dänisch,
Niederländisch, Englisch, Estnisch, Finnisch, Französisch, Deutsch, Griechisch, Ungarisch,
Irisch, Italienisch, Lettisch, Litauisch, Maltesisch, Polnisch, Portugiesisch, Rumänisch,
Slowakisch, Slowenisch, Spanisch, Schwedisch — jede Domäne, Frage, Länderangabe und jeder
UI-Text (`data.js`, `i18n.js`).

Bewusst kein automatischer Sprachfallback ohne Qualitätskontrolle — sollte künftig eine weitere
EU-Sprache hinzukommen, greift der in `i18n.js` (`t()`/`tl()`) eingebaute Fallback auf Englisch,
bis auch sie vollständig übersetzt ist.

## Wichtiger Hinweis

**Kein Ersatz für Rechtsberatung.** Dieses Tool liefert eine unverbindliche Orientierung.
Verbindliche Einstufung und Umsetzungspflichten hängen von der jeweiligen nationalen
Umsetzung der NIS2-Richtlinie ab und ändern sich laufend — bitte vor jeder Entscheidung mit
der zuständigen nationalen Behörde bzw. einer fachkundigen Beratung abstimmen.

Die Länderdaten (`data.js`, `COUNTRY_DATA`) spiegeln den Stand zum in `COUNTRY_DATA_ASOF`
genannten Datum wider und sind manuell zu pflegen — es gibt keine automatische Aktualisierung.

## Herkunft & Lizenz

Unabhängig entwickelt. Die grobe fachliche Struktur (10 NIS2-Domänen, Länderübersicht als
Konzept) wurde von einem thematisch verwandten, aber unlizenzierten Drittprojekt inspiriert —
sämtliche Texte, Fragen und Daten wurden eigenständig neu verfasst, kein Code wurde übernommen.

© 2026 Claude Hecker — [AGPL-3.0](LICENSE)
