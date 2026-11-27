'use strict';

/* ============ konfiguracja ============ */

const $ = (s) => document.querySelector(s);

const KEY = 'gks-precompetition-v4';

/* kolejność zgodna z oryginalnym formularzem / example.pdf */
const CATEGORIES = [
  ['BP', 'BIG PISTOL (BP)'],
  ['LP', 'LITTLE PISTOL (LP)'],
  ['SR', 'SMALL RIFLE (SR)'],
  ['SHOTGUN', 'SHOTGUN'],
];

const FIELDS = [
  ['Nazwisko', 'Nazwisko', 16],
  ['comb_2', 'Imię', 9],
  ['KLUB', 'Klub', 50],
  ['Siedziba', 'Siedziba klubu', 50],
  ['urodzenia', 'Rok urodzenia', 4],
  ['Tekst3', 'Miejsce i data zawodów', 60],
];

let state = { version: 4, shared: {}, selected: [] };
let ready = false, busy = false, pdfBytes, fontBytes;

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

/* ============ dane ============ */

function valid(v) {
  return v?.version === 4
    && v.shared && typeof v.shared === 'object' && !Array.isArray(v.shared)
    && Object.entries(v.shared).every(([k, s]) => FIELDS.some(([key, , max]) => key === k && typeof s === 'string' && s.length <= max))
    && Array.isArray(v.selected) && v.selected.length <= 4
    && new Set(v.selected).size === v.selected.length
    && v.selected.every((k) => CATEGORIES.some(([id]) => id === k));
}

function forms() {
  return CATEGORIES
    .filter(([id]) => state.selected.includes(id))
    .map(([, label]) => ({ ...state.shared, Tekst1: label }));
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    $('#status').textContent = 'Zapisano w tej przeglądarce.';
  } catch {
    $('#status').textContent = 'Zapis lokalny niedostępny. Możesz wyeksportować dane.';
  }
}

/* ============ podgląd metryczki (HTML — układ wg oryginalnego formularza) ============ */

function comb(key, cols) {
  const chars = (state.shared[key] || '').trim().slice(0, cols).split('');
  let cells = '';
  for (let i = 0; i < cols; i++) cells += `<span class="cc">${esc(chars[i] || '')}</span>`;
  return `<div class="cell val comb">${cells}</div>`;
}

function scoreTable() {
  const cols = `<colgroup><col class="c-lab">${'<col class="c-n">'.repeat(10)}<col class="c-suma"><col class="c-uw"></colgroup>`;
  const head = `<thead><tr>
      <th class="diag"><span>Strzały</span><span>Serie</span></th>
      ${[1,2,3,4,5,6,7,8,9,10].map((n) => `<th>${n}</th>`).join('')}
      <th>Suma</th><th>Uwagi</th>
    </tr></thead>`;
  const rows = [1,2,3].map((r) => `<tr>
      <th class="rl">${r}</th>${'<td></td>'.repeat(10)}<td></td><td></td>
    </tr>`).join('');
  return `<table class="score">${cols}${head}<tbody>${rows}</tbody></table>`;
}

function cardHTML(label) {
  const s = state.shared;
  const match = label.match(/^(.*?)\s*(\([^)]*\))\s*$/);
  const catName = match ? match[1] : label;
  const catCode = match ? match[2] : '';
  return `<article class="metryczka">
    <h2 class="mtitle">METRYCZKA STRZELANIA</h2>

    <div class="mrow meta">
      <div class="cell lab">Konkurencja</div>
      <div class="cell val konk"><span>${esc(catName)}</span><span>${esc(catCode)}</span></div>
      <div class="cell lab">Zmiana</div>
      <div class="cell val"></div>
      <div class="cell lab">Stanowisko</div>
      <div class="cell val"></div>
      <div class="cell lab">Miejsce<br>i data zawodów</div>
      <div class="cell val">${esc(s.Tekst3)}</div>
    </div>

    <div class="mrow r-nazw">
      <div class="cell lab">Nazwisko</div>
      ${comb('Nazwisko', 27)}
    </div>

    <div class="mrow r-imie">
      <div class="cell lab">Imię</div>
      ${comb('comb_2', 20)}
      <div class="cell lab">Rok<br>urodzenia</div>
      ${comb('urodzenia', 4)}
    </div>

    <div class="mrow r-klub">
      <div class="cell lab">KLUB</div>
      <div class="cell val">${esc(s.KLUB)}</div>
      <div class="cell lab">Siedziba</div>
      <div class="cell val">${esc(s.Siedziba)}</div>
    </div>

    ${scoreTable()}

    <div class="sigs">
      <div class="sig"><div class="line"></div><span class="lbl">Podpis zawodnika</span></div>
      <div class="sig"><div class="line"></div><span class="lbl">Podpis sędziego oceniającego</span></div>
      <div class="sig"><div class="line"></div><span class="lbl">Podpis sędziego sprawdzającego</span></div>
    </div>

    <div class="decl">
      <div class="osw">Oświadczam, że stan mojego zdrowia, w dniu dzisiejszym pozwala na udział
        w zawodach strzeleckich oraz, że zapoznałem się z regulaminem strzelnicy i przepisami bezpieczeństwa.</div>
    </div>

    <div class="bottom">
      <div class="bcell"><img class="logo" src="../assets/logo.jpg" alt="Gliwicki Klub Strzelecki"></div>
      <div class="bcell"><span class="phone">+48 602 293 201</span></div>
      <div class="bcell"><div class="sig"><div class="line"></div><span class="lbl">Podpis zawodnika</span></div></div>
    </div>
  </article>`;
}

/* dwie metryczki na arkusz A4 */
function renderPreview() {
  const list = forms();
  const root = $('#preview');
  if (!list.length) {
    root.innerHTML = '<p class="empty-msg">Zaznacz przynajmniej jedną konkurencję, aby zobaczyć podgląd metryczek.</p>';
    return;
  }
  let html = '';
  for (let i = 0; i < list.length; i += 2) {
    const first = cardHTML(list[i].Tekst1);
    const second = list[i + 1] ? cardHTML(list[i + 1].Tekst1) : '<div class="metryczka empty" aria-hidden="true"></div>';
    html += `<section class="sheet">${first}${second}</section>`;
  }
  root.innerHTML = html;
}

/* ============ aktualizacja ============ */

function update() {
  const n = state.selected.length;
  $('#summary').textContent = n === 0
    ? 'Zaznacz co najmniej jedną konkurencję.'
    : n + ' ' + (n === 1 ? 'metryczka' : 'metryczki') + ' · ' + Math.ceil(n / 2) + ' ' + (n <= 2 ? 'kartka A4' : 'kartki A4') + '.';
  $('#a4').disabled = !ready || busy || n === 0;
  $('#print').disabled = n === 0;
  renderPreview();
}

function render() {
  for (const [k] of FIELDS) document.getElementById('data-' + k).value = state.shared[k] || '';
  for (const [id] of CATEGORIES) document.getElementById('choice-' + id).checked = state.selected.includes(id);
  update();
}

function download(bytes, name, type) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/* ============ PDF (oryginalny formularz, 2 metryczki na A4 — jak data/example.pdf) ============ */

async function exportPDF() {
  if (!ready || busy || !state.selected.length) return;
  busy = true; update();
  $('#error').textContent = '';
  $('#status').textContent = 'Przygotowywanie PDF…';
  try {
    const bytes = await fillPrintPDF(pdfBytes, fontBytes, forms());
    download(bytes, 'metryczki-gks-do-druku-A4.pdf', 'application/pdf');
    $('#status').textContent = 'Przygotowano PDF do pobrania. Otwórz zapisany plik w programie do PDF.';
  } catch (e) {
    $('#error').textContent = 'Nie udało się przygotować PDF: ' + e.message;
  } finally {
    busy = false; update();
  }
}

/* ============ zdarzenia ============ */

$('#entry').onsubmit = (e) => e.preventDefault();

for (const [key, label, max] of FIELDS) {
  const wrap = document.createElement('label');
  wrap.textContent = label;
  const input = document.createElement('input');
  input.id = 'data-' + key;
  input.maxLength = max;
  input.type = 'text';
  if (key === 'urodzenia') input.inputMode = 'numeric';
  input.oninput = () => { state.shared[key] = input.value; save(); renderPreview(); };
  wrap.append(input);
  $('#shared').append(wrap);
}

for (const [id, label] of CATEGORIES) {
  const wrap = document.createElement('label');
  const input = document.createElement('input');
  const text = document.createElement('span');
  input.type = 'checkbox';
  input.id = 'choice-' + id;
  text.textContent = label;
  input.onchange = () => {
    state.selected = CATEGORIES.filter(([key]) => document.getElementById('choice-' + key).checked).map(([key]) => key);
    update(); save();
  };
  wrap.append(input, text);
  $('#choices').append(wrap);
}

$('#a4').onclick = () => exportPDF();
$('#print').onclick = () => window.print();

$('#reset').onclick = () => {
  if (!confirm('Wyczyścić dane zawodnika i wybór konkurencji?')) return;
  state = { version: 4, shared: {}, selected: [] };
  for (const key of [KEY, 'gks-multi-form-v3', 'gks-original-form-v2', 'gks-metryczka-v1']) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
  render(); save();
};

$('#backup').onclick = () => download(JSON.stringify(state, null, 2), 'metryczki-gks-dane.json', 'application/json');
$('#restore').onclick = () => $('#file').click();
$('#file').onchange = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 200000) throw Error('Plik jest zbyt duży.');
    const v = JSON.parse(await file.text());
    if (!valid(v)) throw Error('Wybierz eksport danych z tej wersji.');
    if (!confirm('Zastąpić dane i wybór konkurencji danymi z pliku?')) return;
    state = v; render(); save();
  } catch (err) {
    $('#error').textContent = 'Import nie powiódł się: ' + err.message;
  } finally {
    e.target.value = '';
  }
};

/* ============ start ============ */

async function init() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (valid(saved)) state = saved;
    else {
      const old = JSON.parse(localStorage.getItem('gks-multi-form-v3'));
      if (old?.forms?.[0]?.values) {
        for (const [k, , max] of FIELDS) {
          const val = old.forms[0].values[k];
          if (typeof val === 'string') state.shared[k] = val.slice(0, max);
        }
        $('#status').textContent = 'Przeniesiono dane zawodnika z poprzedniej wersji. Zaznacz konkurencje.';
      }
    }
  } catch { /* brak zapisu */ }
  render();
  try {
    const r = await Promise.all(['formularz-gks.pdf', 'vendor/font.ttf'].map((p) => fetch(p)));
    if (r.some((x) => !x.ok)) throw Error('Nie udało się wczytać wzoru PDF.');
    [pdfBytes, fontBytes] = await Promise.all(r.map((x) => x.arrayBuffer()));
    ready = true;
    update();
  } catch (e) {
    $('#error').textContent = e.message + ' Odśwież stronę.';
  }
}

init();
