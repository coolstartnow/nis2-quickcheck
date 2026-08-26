/* © 2026 Claude Hecker — NIS2 Quick-Check — AGPL-3.0
   ================================================================
   NIS2 Quick-Check — App-Logik
   Rein clientseitig, kein Backend, keine externen Abhängigkeiten.
   Persistenz: localStorage (Auto-Save) + manueller JSON-Export/Import.
   ================================================================ */

const STORAGE_KEY = 'nis2qc_v1';
const TOTAL_STEPS = 2 + NIS2_DOMAINS.length;

const state = {
  step: 0, // 0 = Welcome, 1 = Profil, 2..11 = Domänen, 99 = Ergebnis
  profile: { orgName: '', sector: '', country: '', employees: '' },
  answers: {}, // { questionId: { score: number|null, note: string } }
};

function allQuestionIds() {
  return NIS2_DOMAINS.flatMap(d => d.questions.map(q => q.id));
}

function initAnswers() {
  allQuestionIds().forEach(id => {
    if (!state.answers[id]) state.answers[id] = { score: null, note: '' };
  });
}

// ─── Persistenz ─────────────────────────────────────────────────
function autoSave() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Auto-Save fehlgeschlagen (localStorage nicht verfügbar):', e);
  }
}

function loadAutoSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    Object.assign(state, JSON.parse(raw));
    return true;
  } catch (e) {
    console.warn('Auto-Save konnte nicht geladen werden:', e);
    return false;
  }
}

function exportJson() {
  const payload = { tool: 'nis2-quickcheck', exportedAt: new Date().toISOString(), ...state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (state.profile.orgName || 'assessment').replace(/[^a-z0-9]+/gi, '_');
  a.href = url;
  a.download = `nis2-quickcheck_${safeName}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      state.profile = data.profile || state.profile;
      state.answers = data.answers || state.answers;
      state.step = 1;
      initAnswers();
      autoSave();
      render();
    } catch (e) {
      alert(t('importError'));
    }
  };
  reader.readAsText(file);
}

function resetAll() {
  if (!confirm(t('resetConfirm'))) return;
  state.step = 0;
  state.profile = { orgName: '', sector: '', country: '', employees: '' };
  state.answers = {};
  localStorage.removeItem(STORAGE_KEY);
  render();
}

// ─── Klassifizierung (vereinfacht) ──────────────────────────────
// Hinweis: die tatsächliche Einordnung Essential/Important hängt von
// Sektor UND exakten Schwellenwerten laut NIS2 Anhang I/II sowie
// nationaler Umsetzung ab. Diese Heuristik ist eine Orientierung,
// keine verbindliche Einstufung.
function classifyEntity() {
  const sector = SECTORS.find(s => s.id === state.profile.sector);
  if (!sector) return null;
  const employees = parseInt(state.profile.employees, 10) || 0;
  const isLarge = employees >= 250;
  const isMedium = employees >= 50;

  if (sector.category === 'essential') {
    return isMedium ? 'essential' : 'out-of-scope-likely';
  }
  return isLarge ? 'important' : (isMedium ? 'important' : 'out-of-scope-likely');
}

// ─── Scoring ─────────────────────────────────────────────────────
function domainScore(domain) {
  const scores = domain.questions.map(q => state.answers[q.id]?.score).filter(s => s !== null && s !== undefined);
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function overallScore() {
  const domainScores = NIS2_DOMAINS.map(domainScore).filter(s => s !== null);
  if (domainScores.length === 0) return null;
  return domainScores.reduce((a, b) => a + b, 0) / domainScores.length;
}

function answeredCount() {
  return Object.values(state.answers).filter(a => a.score !== null && a.score !== undefined).length;
}

function priorityFor(score) {
  if (score === null) return { label: '—', color: '#6b7280' };
  if (score < 1) return { label: t('prioCritical'), color: '#dc2626' };
  if (score < 2) return { label: t('prioHigh'), color: '#ea580c' };
  if (score < 3) return { label: t('prioMedium'), color: '#ca8a04' };
  return { label: t('prioLow'), color: '#16a34a' };
}

// ─── Rendering ───────────────────────────────────────────────────
const app = document.getElementById('app');

function render() {
  initAnswers();
  autoSave();
  renderLangSwitcher();
  updateProgressBar();
  document.title = t('title');

  if (state.step === 0) return renderWelcome();
  if (state.step === 1) return renderProfile();
  if (state.step === 99) return renderResults();

  const domainIdx = state.step - 2;
  if (domainIdx >= 0 && domainIdx < NIS2_DOMAINS.length) {
    return renderDomain(NIS2_DOMAINS[domainIdx]);
  }
  // state.step zeigt hinter die letzte Domäne (z. B. nach "Zu den Ergebnissen"
  // auf der letzten Fragenseite, oder ein alter, vor diesem Fix gespeicherter
  // Stand) — in dem Fall gehören wir zu den Ergebnissen, nicht zurück auf die
  // Startseite. Nur ein wirklich negativer/unbekannter Schritt geht auf Welcome.
  if (state.step > 1) { state.step = 99; return renderResults(); }
  renderWelcome();
}

function renderLangSwitcher() {
  const wrap = document.getElementById('langSwitcher');
  if (!wrap) return;
  wrap.innerHTML = `
    <select class="lang-select" onchange="setLang(this.value)" title="${escHtml(t('title'))}">
      ${LANGUAGES.map(l => `<option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.flag} ${l.native}</option>`).join('')}
    </select>
  `;
  const hint = document.getElementById('langHint');
  const hintText = document.getElementById('langHintText');
  const showHint = !FULLY_TRANSLATED.includes(currentLang);
  if (hint) hint.style.display = showHint ? '' : 'none';
  if (hintText && showHint) hintText.textContent = t('langUnavailable');
}

function updateProgressBar() {
  const bar = document.getElementById('progressBar');
  const wrap = document.getElementById('progressWrap');
  if (state.step === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  const pct = state.step === 99 ? 100 : Math.round((state.step / TOTAL_STEPS) * 100);
  bar.style.width = pct + '%';
}

function renderWelcome() {
  app.innerHTML = `
    <div class="card welcome">
      <h1><img src="favicon.jpeg" alt="" class="welcome-icon"> ${t('title')}</h1>
      <p class="lead">${t('lead')}</p>
      <div class="notice">
        <strong>${t('disclaimer')}</strong> ${t('disclaimerBody')}
        ${t('countryDataAsOf')}: ${COUNTRY_DATA_ASOF}.
      </div>
      <ul class="feature-list">
        <li>${t('featStructure')}</li>
        <li>${t('featClassify')}</li>
        <li>${t('featDashboard')}</li>
        <li>${t('featCountries')}</li>
        <li>${t('featExport')}</li>
        <li>${t('featLocal')}</li>
      </ul>
      <div class="btn-row">
        <button class="btn btn-primary" onclick="startAssessment()">${t('start')}</button>
        <label class="btn btn-secondary file-btn">
          ${t('loadSaved')}
          <input type="file" accept="application/json" style="display:none" onchange="importJson(this.files[0])" />
        </label>
      </div>
    </div>
  `;
}

function startAssessment() {
  state.step = 1;
  render();
}

function renderProfile() {
  const p = state.profile;
  app.innerHTML = `
    <div class="card">
      <h2>${t('orgProfile')}</h2>
      <p class="muted">${t('orgProfileHint')}</p>

      <label class="field-label">${t('orgName')}</label>
      <input type="text" class="input" id="orgName" value="${escHtml(p.orgName)}" placeholder="${escHtml(t('orgNamePlaceholder'))}" />

      <label class="field-label">${t('sector')}</label>
      <select class="input" id="sector">
        <option value="">${t('pleaseSelect')}</option>
        ${SECTORS.map(s => `<option value="${s.id}" ${p.sector === s.id ? 'selected' : ''}>${escHtml(tl(s.name))} (${s.category === 'essential' ? t('annexI') : t('annexII')})</option>`).join('')}
      </select>

      <label class="field-label">${t('employees')}</label>
      <select class="input" id="employees">
        <option value="">${t('pleaseSelect')}</option>
        <option value="10" ${p.employees === '10' ? 'selected' : ''}>${t('empSmall')}</option>
        <option value="100" ${p.employees === '100' ? 'selected' : ''}>${t('empMedium')}</option>
        <option value="500" ${p.employees === '500' ? 'selected' : ''}>${t('empLarge')}</option>
      </select>

      <label class="field-label">${t('country')}</label>
      <select class="input" id="country">
        <option value="">${t('pleaseSelect')}</option>
        ${Object.entries(COUNTRY_DATA).map(([code, c]) => `<option value="${code}" ${p.country === code ? 'selected' : ''}>${c.flag} ${escHtml(tl(c.name))}</option>`).join('')}
      </select>

      <div id="classificationPreview"></div>

      <div class="btn-row">
        <button class="btn btn-secondary" onclick="goStep(0)">${t('back')}</button>
        <button class="btn btn-primary" onclick="saveProfileAndContinue()">${t('next')}</button>
      </div>
    </div>
  `;
  ['orgName', 'sector', 'employees', 'country'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateProfileLive);
    document.getElementById(id).addEventListener('change', updateProfileLive);
  });
  updateProfileLive();
}

function updateProfileLive() {
  state.profile.orgName = document.getElementById('orgName').value;
  state.profile.sector = document.getElementById('sector').value;
  state.profile.employees = document.getElementById('employees').value;
  state.profile.country = document.getElementById('country').value;
  const cls = classifyEntity();
  const box = document.getElementById('classificationPreview');
  if (cls && box) {
    const c = CLASSIFICATION_LABELS[cls];
    box.innerHTML = `<div class="classification-badge" style="border-color:${c.color}"><strong style="color:${c.color}">${escHtml(tl(c.label))}</strong><br><span class="muted">${escHtml(tl(c.desc))}</span></div>`;
  } else if (box) {
    box.innerHTML = '';
  }
}

function saveProfileAndContinue() {
  autoSave();
  state.step = 2;
  render();
}

function renderDomain(domain) {
  const idx = NIS2_DOMAINS.findIndex(d => d.id === domain.id);
  app.innerHTML = `
    <div class="card">
      <div class="domain-header">
        <span class="domain-icon">${domain.icon}</span>
        <div>
          <div class="domain-article">${domain.article}</div>
          <h2>${escHtml(tl(domain.name))}</h2>
        </div>
      </div>
      <p class="muted">${escHtml(tl(domain.description))}</p>

      ${domain.questions.map(q => renderQuestion(q)).join('')}

      <div class="btn-row">
        <button class="btn btn-secondary" onclick="goStep(${state.step - 1})">${t('back')}</button>
        <button class="btn btn-primary" onclick="goStep(${idx === NIS2_DOMAINS.length - 1 ? 99 : state.step + 1})">
          ${idx === NIS2_DOMAINS.length - 1 ? t('toResults') : t('next')}
        </button>
      </div>
    </div>
  `;
}

function renderQuestion(q) {
  const a = state.answers[q.id] || { score: null, note: '' };
  return `
    <div class="question-block">
      <div class="question-text">${escHtml(tl(q.text))}</div>
      <div class="question-help">${escHtml(tl(q.help))}</div>
      <div class="maturity-scale">
        ${MATURITY_LEVELS.map(m => `
          <button class="maturity-btn ${a.score === m.value ? 'active' : ''}" style="--mc:${m.color}"
            onclick="setScore('${q.id}', ${m.value})" title="${escHtml(tl(m.label))}">
            ${m.value} · ${escHtml(tl(m.short))}
          </button>
        `).join('')}
      </div>
      <input type="text" class="input note-input" placeholder="${escHtml(t('notePlaceholder'))}" value="${escHtml(a.note)}"
        oninput="setNote('${q.id}', this.value)" />
    </div>
  `;
}

function setScore(qId, score) {
  state.answers[qId] = state.answers[qId] || { score: null, note: '' };
  state.answers[qId].score = state.answers[qId].score === score ? null : score; // erneut klicken = zurücksetzen
  autoSave();
  render();
}

function setNote(qId, note) {
  state.answers[qId] = state.answers[qId] || { score: null, note: '' };
  state.answers[qId].note = note;
  autoSave();
}

function goStep(step) {
  window.scrollTo(0, 0);
  state.step = step;
  render();
}

// ─── Ergebnis-Dashboard ───────────────────────────────────────────
function renderResults() {
  const overall = overallScore();
  const cls = classifyEntity();
  const clsInfo = cls ? CLASSIFICATION_LABELS[cls] : null;
  const country = COUNTRY_DATA[state.profile.country];
  const answered = answeredCount();
  const total = allQuestionIds().length;

  app.innerHTML = `
    <div class="card results">
      <h2>${t('results')}</h2>
      <div class="muted">${state.profile.orgName ? escHtml(state.profile.orgName) + ' · ' : ''}${answered} / ${total} ${t('questionsAnswered')}</div>

      <div class="result-summary-grid">
        <div class="stat-box">
          <div class="stat-value">${overall !== null ? overall.toFixed(1) : '—'} / 4</div>
          <div class="stat-label">${t('overallMaturity')}</div>
        </div>
        ${clsInfo ? `
        <div class="stat-box" style="border-color:${clsInfo.color}">
          <div class="stat-value" style="font-size:16px;color:${clsInfo.color}">${escHtml(tl(clsInfo.label))}</div>
          <div class="stat-label">${t('classificationLabel')}</div>
        </div>` : ''}
        ${country ? `
        <div class="stat-box">
          <div class="stat-value" style="font-size:20px">${country.flag} ${escHtml(tl(country.name))}</div>
          <div class="stat-label">${escHtml(country.authority)}</div>
        </div>` : ''}
      </div>

      <h3>${t('maturityByDomain')}</h3>
      ${renderBarChart()}

      <h3>${t('radarView')}</h3>
      ${renderRadarChart()}

      <h3>${t('gapAnalysis')}</h3>
      ${renderGapTable()}

      ${country ? renderCountryPanel(country) : ''}

      <h3 class="no-print">${t('countryOverviewAll')}</h3>
      <div class="no-print">${renderCountryTable()}</div>

      <div class="btn-row no-print">
        <button class="btn btn-secondary" onclick="goStep(${1 + NIS2_DOMAINS.length})">${t('backToQuestions')}</button>
        <button class="btn btn-secondary" onclick="exportJson()">${t('exportJsonBtn')}</button>
        <button class="btn btn-primary" onclick="window.print()">${t('printPdf')}</button>
        <button class="btn btn-danger" onclick="resetAll()">${t('resetAll')}</button>
      </div>
    </div>
  `;
}

function renderBarChart() {
  const rows = NIS2_DOMAINS.map(d => {
    const s = domainScore(d);
    const pct = s === null ? 0 : (s / 4) * 100;
    return `
      <div class="bar-row">
        <div class="bar-label">${d.icon} ${escHtml(tl(d.shortName))}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="bar-value">${s === null ? '—' : s.toFixed(1)}</div>
      </div>`;
  }).join('');
  return `<div class="bar-chart">${rows}</div>`;
}

function renderRadarChart() {
  const n = NIS2_DOMAINS.length;
  const size = 320;
  const center = size / 2;
  const maxR = size / 2 - 50;
  const angleFor = i => (Math.PI * 2 * i) / n - Math.PI / 2;

  const gridPolys = [1, 2, 3, 4].map(level => {
    const r = (level / 4) * maxR;
    const pts = NIS2_DOMAINS.map((_, i) => {
      const a = angleFor(i);
      return `${center + r * Math.cos(a)},${center + r * Math.sin(a)}`;
    }).join(' ');
    return `<polygon points="${pts}" class="radar-grid" />`;
  }).join('');

  const dataPts = NIS2_DOMAINS.map((d, i) => {
    const s = domainScore(d) ?? 0;
    const r = (s / 4) * maxR;
    const a = angleFor(i);
    return `${center + r * Math.cos(a)},${center + r * Math.sin(a)}`;
  }).join(' ');

  const labels = NIS2_DOMAINS.map((d, i) => {
    const a = angleFor(i);
    const r = maxR + 28;
    const x = center + r * Math.cos(a);
    const y = center + r * Math.sin(a);
    return `<text x="${x}" y="${y}" class="radar-label" text-anchor="middle" dominant-baseline="middle">${d.icon}</text>`;
  }).join('');

  return `
    <svg viewBox="0 0 ${size} ${size}" class="radar-svg">
      ${gridPolys}
      <polygon points="${dataPts}" class="radar-data" />
      ${labels}
    </svg>
  `;
}

function renderGapTable() {
  const rows = NIS2_DOMAINS.map(d => {
    const s = domainScore(d);
    const prio = priorityFor(s);
    return { d, s, prio };
  }).sort((a, b) => (a.s ?? -1) - (b.s ?? -1));

  return `
    <table class="gap-table">
      <thead><tr><th>${t('colDomain')}</th><th>${t('colMaturity')}</th><th>${t('colTarget')}</th><th>${t('colGap')}</th><th>${t('colPriority')}</th></tr></thead>
      <tbody>
        ${rows.map(({ d, s, prio }) => `
          <tr>
            <td>${d.icon} ${escHtml(tl(d.name))}</td>
            <td>${s === null ? '—' : s.toFixed(1)}</td>
            <td>4.0</td>
            <td>${s === null ? '—' : (4 - s).toFixed(1)}</td>
            <td><span class="prio-badge" style="background:${prio.color}">${prio.label}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderCountryPanel(c) {
  const st = STATUS_LABELS[c.status];
  const noteText = tl(c.notes);
  return `
    <h3>${t('countryInfo')}: ${c.flag} ${escHtml(tl(c.name))}</h3>
    <div class="country-panel">
      <table class="country-info-table">
        <tr><th>${t('authorityLabel')}</th><td>${escHtml(c.authority)}</td></tr>
        <tr><th>${t('lawLabel')}</th><td>${escHtml(c.legislation)}</td></tr>
        <tr><th>${t('statusLabel')}</th><td><span class="status-badge" style="background:${st.color}">${escHtml(tl(st.label))}</span> — ${escHtml(tl(c.statusNote))}</td></tr>
        <tr><th>${t('csirtLabel')}</th><td>${escHtml(c.csirt)}</td></tr>
        <tr><th>${t('penaltyEssential')}</th><td>${EU_PENALTY_BASELINE.essential}</td></tr>
        <tr><th>${t('penaltyImportant')}</th><td>${EU_PENALTY_BASELINE.important}</td></tr>
        ${noteText ? `<tr><th>${t('noteLabel')}</th><td>${escHtml(noteText)}</td></tr>` : ''}
      </table>
    </div>
  `;
}

function renderCountryTable() {
  const rows = Object.entries(COUNTRY_DATA).map(([code, c]) => {
    const st = STATUS_LABELS[c.status];
    return `
      <tr class="${code === state.profile.country ? 'highlight-row' : ''}">
        <td>${c.flag} ${escHtml(tl(c.name))}</td>
        <td>${escHtml(c.authority)}</td>
        <td><span class="status-badge" style="background:${st.color}">${escHtml(tl(st.label))}</span></td>
      </tr>`;
  }).join('');
  return `
    <table class="country-info-table wide">
      <thead><tr><th>${t('colCountry')}</th><th>${t('colAuthority')}</th><th>${t('colStatus')}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="muted small">${t('countryDataAsOf')}: ${COUNTRY_DATA_ASOF}. ${t('countryTableFooter')}</p>
  `;
}

// ─── Utils ─────────────────────────────────────────────────────
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Dark Mode ───────────────────────────────────────────────────
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('nis2qc_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function initTheme() {
  if (localStorage.getItem('nis2qc_theme') === 'dark') document.body.classList.add('dark');
}

// ─── Init ────────────────────────────────────────────────────────
initTheme();
loadAutoSave();
initAnswers();
render();
