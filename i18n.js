/* © 2026 Claude Hecker — NIS2 Quick-Check — AGPL-3.0
   ================================================================
   Internationalisierung — Struktur für alle 24 EU-Amtssprachen.

   Aktuell echt befüllt: de, en. Alle anderen 22 Sprachen sind als
   auswählbare Optionen angelegt, fallen aber mangels Übersetzung
   automatisch auf Englisch zurück (t()-Funktion unten) — bewusst
   keine maschinelle Rohübersetzung ohne Qualitätskontrolle.
   ================================================================ */

const LANGUAGES = [
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹' },
  { code: 'mt', name: 'Maltese', native: 'Malti', flag: '🇲🇹' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
];

const FULLY_TRANSLATED = ['de', 'en', 'fr', 'nl'];

// ─── UI-Strings ───────────────────────────────────────────────
const UI = {
  title:               { de: 'NIS2 Quick-Check',            en: 'NIS2 Quick-Check',            fr: 'NIS2 Quick-Check',              nl: 'NIS2 Quick-Check' },
  lead:                { de: 'Ein kostenloser, rein lokal laufender Selbst-Check zur groben Einschätzung des eigenen Umsetzungsstands gegenüber den zehn Maßnahmenbereichen aus Art. 21(2) der NIS2-Richtlinie.',
                         en: 'A free, fully local self-check to get a rough estimate of your implementation status against the ten measure areas in Article 21(2) of the NIS2 Directive.',
                         fr: 'Une auto-évaluation gratuite et entièrement locale pour estimer approximativement votre niveau de mise en œuvre au regard des dix domaines de mesures de l\'article 21(2) de la directive NIS2.',
                         nl: 'Een gratis, volledig lokaal draaiende zelfcheck om je implementatiestatus grofweg in te schatten ten opzichte van de tien maatregelgebieden uit art. 21(2) van de NIS2-richtlijn.' },
  disclaimer:          { de: 'Kein Ersatz für Rechtsberatung.', en: 'Not a substitute for legal advice.', fr: 'Ne remplace pas un conseil juridique.', nl: 'Geen vervanging voor juridisch advies.' },
  disclaimerBody:      { de: 'Dieses Tool liefert eine unverbindliche Orientierung. Verbindliche Einstufung und Umsetzungspflichten hängen von der jeweiligen nationalen Umsetzung ab — bitte mit der zuständigen Behörde bzw. einer fachkundigen Beratung abstimmen.',
                         en: 'This tool provides non-binding orientation only. Binding classification and implementation obligations depend on the respective national transposition — please confirm with the competent authority or qualified legal counsel.',
                         fr: 'Cet outil fournit uniquement une orientation non contraignante. La classification et les obligations de mise en œuvre contraignantes dépendent de la transposition nationale respective — merci de vérifier auprès de l\'autorité compétente ou d\'un conseil juridique qualifié.',
                         nl: 'Deze tool biedt alleen een vrijblijvende oriëntatie. Bindende classificatie en implementatieverplichtingen hangen af van de nationale omzetting — overleg met de bevoegde autoriteit of gekwalificeerd juridisch advies.' },
  countryDataAsOf:     { de: 'Länderdaten Stand', en: 'Country data as of', fr: 'Données pays au', nl: 'Landgegevens per' },
  featStructure:       { de: '10 Domänen × 5 Fragen (50 Fragen gesamt), Reifegrad-Skala 0–4', en: '10 domains × 5 questions (50 questions total), maturity scale 0–4', fr: '10 domaines × 5 questions (50 questions au total), échelle de maturité 0–4', nl: '10 domeinen × 5 vragen (50 vragen totaal), volwassenheidsschaal 0–4' },
  featClassify:        { de: 'Automatische grobe Einstufung Essential/Important nach Sektor + Größe', en: 'Automatic rough classification Essential/Important by sector + size', fr: 'Classification approximative automatique Essentiel/Important selon secteur + taille', nl: 'Automatische grove classificatie Essentieel/Belangrijk op basis van sector + omvang' },
  featDashboard:       { de: 'Ergebnis-Dashboard mit Radar- und Balkendiagramm, Gap-Analyse', en: 'Result dashboard with radar and bar chart, gap analysis', fr: 'Tableau de bord des résultats avec diagramme radar et à barres, analyse des écarts', nl: 'Resultatendashboard met radar- en staafdiagram, gap-analyse' },
  featCountries:       { de: 'Länderübersicht: zuständige Behörde, Gesetz, Umsetzungsstand (15 EU-Länder)', en: 'Country overview: competent authority, law, transposition status (15 EU countries)', fr: 'Aperçu par pays : autorité compétente, loi, état de transposition (15 pays UE)', nl: 'Landenoverzicht: bevoegde autoriteit, wet, omzettingsstatus (15 EU-landen)' },
  featExport:          { de: 'PDF-Export (Druckansicht), JSON-Export/Import, automatisches Zwischenspeichern im Browser', en: 'PDF export (print view), JSON export/import, automatic browser autosave', fr: 'Export PDF (vue impression), export/import JSON, sauvegarde automatique dans le navigateur', nl: 'PDF-export (afdrukweergave), JSON-export/import, automatisch opslaan in de browser' },
  featLocal:           { de: 'Läuft komplett lokal — keine Daten verlassen den Browser', en: 'Runs entirely locally — no data ever leaves the browser', fr: 'Fonctionne entièrement en local — aucune donnée ne quitte le navigateur', nl: 'Werkt volledig lokaal — er verlaten nooit gegevens de browser' },
  start:               { de: 'Start', en: 'Start', fr: 'Démarrer', nl: 'Starten' },
  loadSaved:           { de: 'Gespeicherten Stand laden (JSON)', en: 'Load saved assessment (JSON)', fr: 'Charger une évaluation enregistrée (JSON)', nl: 'Opgeslagen beoordeling laden (JSON)' },
  orgProfile:          { de: 'Organisationsprofil', en: 'Organization profile', fr: 'Profil de l\'organisation', nl: 'Organisatieprofiel' },
  orgProfileHint:      { de: 'Diese Angaben dienen ausschließlich der groben Einstufung und werden nirgendwo hochgeladen.', en: 'This information is used only for the rough classification and is never uploaded anywhere.', fr: 'Ces informations servent uniquement à la classification approximative et ne sont jamais téléchargées.', nl: 'Deze gegevens dienen uitsluitend voor de grove classificatie en worden nergens geüpload.' },
  orgName:             { de: 'Name der Organisation (optional)', en: 'Organization name (optional)', fr: 'Nom de l\'organisation (facultatif)', nl: 'Naam van de organisatie (optioneel)' },
  orgNamePlaceholder:  { de: 'z. B. Muster GmbH', en: 'e.g. Example Ltd.', fr: 'p. ex. Exemple SARL', nl: 'bijv. Voorbeeld B.V.' },
  sector:              { de: 'Sektor', en: 'Sector', fr: 'Secteur', nl: 'Sector' },
  pleaseSelect:        { de: '— bitte wählen —', en: '— please select —', fr: '— veuillez choisir —', nl: '— maak een keuze —' },
  annexI:              { de: 'Anhang I', en: 'Annex I', fr: 'Annexe I', nl: 'Bijlage I' },
  annexII:             { de: 'Anhang II', en: 'Annex II', fr: 'Annexe II', nl: 'Bijlage II' },
  employees:           { de: 'Anzahl Mitarbeitende', en: 'Number of employees', fr: 'Nombre de collaborateurs', nl: 'Aantal medewerkers' },
  empSmall:            { de: '< 50 (Kleinstunternehmen/klein)', en: '< 50 (micro/small enterprise)', fr: '< 50 (micro/petite entreprise)', nl: '< 50 (micro-/kleine onderneming)' },
  empMedium:           { de: '50–249 (mittel)', en: '50–249 (medium)', fr: '50–249 (moyenne)', nl: '50–249 (middelgroot)' },
  empLarge:            { de: '≥ 250 (groß)', en: '≥ 250 (large)', fr: '≥ 250 (grande)', nl: '≥ 250 (groot)' },
  country:             { de: 'Land', en: 'Country', fr: 'Pays', nl: 'Land' },
  back:                { de: 'Zurück', en: 'Back', fr: 'Retour', nl: 'Terug' },
  next:                { de: 'Weiter', en: 'Next', fr: 'Suivant', nl: 'Volgende' },
  toResults:           { de: 'Zu den Ergebnissen', en: 'To the results', fr: 'Vers les résultats', nl: 'Naar de resultaten' },
  backToQuestions:     { de: 'Zurück zu den Fragen', en: 'Back to the questions', fr: 'Retour aux questions', nl: 'Terug naar de vragen' },
  exportJsonBtn:       { de: 'JSON exportieren', en: 'Export JSON', fr: 'Exporter en JSON', nl: 'JSON exporteren' },
  printPdf:            { de: 'Als PDF drucken', en: 'Print as PDF', fr: 'Imprimer en PDF', nl: 'Afdrukken als PDF' },
  resetAll:            { de: 'Alles zurücksetzen', en: 'Reset everything', fr: 'Tout réinitialiser', nl: 'Alles resetten' },
  resetConfirm:        { de: 'Wirklich alle Eingaben löschen? Das kann nicht rückgängig gemacht werden.', en: 'Really delete all entries? This cannot be undone.', fr: 'Vraiment supprimer toutes les saisies ? Cette action est irréversible.', nl: 'Alle invoer echt verwijderen? Dit kan niet ongedaan worden gemaakt.' },
  importError:         { de: 'Datei konnte nicht gelesen werden — ist es eine gültige nis2-quickcheck-JSON-Datei?', en: 'Could not read the file — is it a valid nis2-quickcheck JSON file?', fr: 'Impossible de lire le fichier — s\'agit-il d\'un fichier JSON nis2-quickcheck valide ?', nl: 'Bestand kon niet worden gelezen — is het een geldig nis2-quickcheck JSON-bestand?' },
  notePlaceholder:     { de: 'Notiz (optional)', en: 'Note (optional)', fr: 'Note (facultatif)', nl: 'Notitie (optioneel)' },
  results:             { de: '📊 Ergebnis-Dashboard', en: '📊 Result dashboard', fr: '📊 Tableau de bord des résultats', nl: '📊 Resultatendashboard' },
  questionsAnswered:   { de: 'Fragen beantwortet', en: 'questions answered', fr: 'questions répondues', nl: 'vragen beantwoord' },
  overallMaturity:     { de: 'Gesamt-Reifegrad', en: 'Overall maturity', fr: 'Maturité globale', nl: 'Totale volwassenheid' },
  classificationLabel: { de: 'Grobe Einstufung (unverbindlich)', en: 'Rough classification (non-binding)', fr: 'Classification approximative (non contraignante)', nl: 'Grove classificatie (vrijblijvend)' },
  maturityByDomain:    { de: 'Reifegrad je Domäne', en: 'Maturity by domain', fr: 'Maturité par domaine', nl: 'Volwassenheid per domein' },
  radarView:           { de: 'Radar-Ansicht', en: 'Radar view', fr: 'Vue radar', nl: 'Radarweergave' },
  gapAnalysis:         { de: 'Gap-Analyse', en: 'Gap analysis', fr: 'Analyse des écarts', nl: 'Gap-analyse' },
  countryInfo:         { de: 'Länderinformation', en: 'Country information', fr: 'Informations pays', nl: 'Landinformatie' },
  countryOverviewAll:  { de: 'Länderübersicht (alle 15)', en: 'Country overview (all 15)', fr: 'Aperçu de tous les pays (15)', nl: 'Landenoverzicht (alle 15)' },
  colDomain:           { de: 'Domäne', en: 'Domain', fr: 'Domaine', nl: 'Domein' },
  colMaturity:         { de: 'Reifegrad', en: 'Maturity', fr: 'Maturité', nl: 'Volwassenheid' },
  colTarget:           { de: 'Ziel', en: 'Target', fr: 'Cible', nl: 'Doel' },
  colGap:               { de: 'Lücke', en: 'Gap', fr: 'Écart', nl: 'Verschil' },
  colPriority:         { de: 'Priorität', en: 'Priority', fr: 'Priorité', nl: 'Prioriteit' },
  colAuthority:        { de: 'Behörde', en: 'Authority', fr: 'Autorité', nl: 'Autoriteit' },
  colStatus:           { de: 'Umsetzungsstand', en: 'Transposition status', fr: 'État de transposition', nl: 'Omzettingsstatus' },
  colCountry:          { de: 'Land', en: 'Country', fr: 'Pays', nl: 'Land' },
  authorityLabel:      { de: 'Zuständige Behörde', en: 'Competent authority', fr: 'Autorité compétente', nl: 'Bevoegde autoriteit' },
  lawLabel:            { de: 'Nationales Gesetz', en: 'National law', fr: 'Loi nationale', nl: 'Nationale wet' },
  statusLabel:         { de: 'Umsetzungsstand', en: 'Transposition status', fr: 'État de transposition', nl: 'Omzettingsstatus' },
  csirtLabel:          { de: 'CSIRT', en: 'CSIRT', fr: 'CSIRT', nl: 'CSIRT' },
  penaltyEssential:    { de: 'Bußgeldrahmen (wesentliche E.)', en: 'Penalty range (essential entities)', fr: 'Fourchette de sanctions (entités essentielles)', nl: 'Boetebandbreedte (essentiële entiteiten)' },
  penaltyImportant:    { de: 'Bußgeldrahmen (wichtige E.)', en: 'Penalty range (important entities)', fr: 'Fourchette de sanctions (entités importantes)', nl: 'Boetebandbreedte (belangrijke entiteiten)' },
  noteLabel:           { de: 'Hinweis', en: 'Note', fr: 'Remarque', nl: 'Opmerking' },
  countryTableFooter:  { de: 'Unverbindliche Orientierung — bitte mit der jeweiligen nationalen Behörde verifizieren.', en: 'Non-binding orientation — please verify with the respective national authority.', fr: 'Orientation non contraignante — merci de vérifier auprès de l\'autorité nationale compétente.', nl: 'Vrijblijvende oriëntatie — verifieer bij de betreffende nationale autoriteit.' },
  langUnavailable:     { de: 'Diese Sprache ist noch nicht vollständig übersetzt — englische Inhalte werden angezeigt.', en: 'This language is not yet fully translated — showing English content.', fr: 'Cette langue n\'est pas encore entièrement traduite — le contenu anglais est affiché.', nl: 'Deze taal is nog niet volledig vertaald — Engelse inhoud wordt getoond.' },
  prioCritical:        { de: 'Kritisch', en: 'Critical', fr: 'Critique', nl: 'Kritiek' },
  prioHigh:            { de: 'Hoch', en: 'High', fr: 'Élevée', nl: 'Hoog' },
  prioMedium:          { de: 'Mittel', en: 'Medium', fr: 'Moyenne', nl: 'Gemiddeld' },
  prioLow:             { de: 'Niedrig', en: 'Low', fr: 'Faible', nl: 'Laag' },
};

let currentLang = localStorage.getItem('nis2qc_lang') || (navigator.language || 'en').slice(0, 2);
if (!LANGUAGES.some(l => l.code === currentLang)) currentLang = 'en';

function setLang(code) {
  currentLang = code;
  localStorage.setItem('nis2qc_lang', code);
  render();
}

// t(): UI-String übersetzen, Fallback auf Englisch, dann auf den Key selbst.
function t(key) {
  const entry = UI[key];
  if (!entry) return key;
  return entry[currentLang] || entry.en || key;
}

// tl(): lokalisierbares Datenfeld übersetzen ({de:'', en:'', ...}), Fallback Englisch.
function tl(field) {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field; // nicht-lokalisierte Felder (z.B. Eigennamen)
  return field[currentLang] || field.en || field.de || '';
}
