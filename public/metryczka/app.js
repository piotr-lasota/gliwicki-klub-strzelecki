'use strict';

const $ = (s) => document.querySelector(s);

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
  ['Tekst3', 'Data zawodów', 10],
];

const PLACE = 'Gliwice';
const MIN_YEAR = 1900;

const state = { shared: {}, selected: [] };
let ready = false, busy = false, pdfBytes, fontBytes;

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

function categoryParts(label) {
  const match = label.match(/^(.*?)\s*(\([^)]*\))\s*$/);
  return match ? [match[1], match[2]] : [label, ''];
}

function competitionDate() {
  if (!state.shared.Tekst3) return PLACE;
  return `${PLACE}, ${state.shared.Tekst3.replace(/-/g, '.')}`;
}

function forms() {
  return CATEGORIES
    .filter(([id]) => state.selected.includes(id))
    .map(([, label]) => {
      const [name, code] = categoryParts(label);
      return { ...state.shared, Tekst1: code ? `${name}\n${code}` : name, Tekst3: competitionDate() };
    });
}

function yearValid() {
  const value = state.shared.urodzenia || '';
  return value === '' || (/^\d{4}$/.test(value) && Number(value) >= MIN_YEAR);
}

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
  const [catName, catCode] = categoryParts(label);
  return `<article class="metryczka">
    <h2 class="mtitle">METRYCZKA STRZELANIA</h2>

    <div class="mrow meta">
      <div class="cell lab">Konkurencja</div>
      <div class="cell val konk"><span>${esc(catName)}</span><span>${esc(catCode)}</span></div>
      <div class="cell lab">Zmiana</div>
      <div class="cell val"></div>
      <div class="cell lab">Stanowisko</div>
      <div class="cell val"></div>
      <div class="cell lab">Data zawodów</div>
      <div class="cell val">${esc(competitionDate())}</div>
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
      <div class="cell val">${esc(state.shared.KLUB)}</div>
      <div class="cell lab">Siedziba</div>
      <div class="cell val">${esc(state.shared.Siedziba)}</div>
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

function renderPreview() {
  const list = forms();
  const root = $('#preview');
  if (!list.length) {
    root.innerHTML = '';
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

function update() {
  const n = state.selected.length;
  const yearOk = yearValid();
  $('#summary').textContent = n === 0
    ? 'Zaznacz co najmniej jedną konkurencję.'
    : n + ' ' + (n === 1 ? 'metryczka' : 'metryczki') + ' · ' + Math.ceil(n / 2) + ' ' + (n <= 2 ? 'kartka A4' : 'kartki A4') + '.';
  $('#a4').disabled = !ready || busy || n === 0 || !yearOk;
  $('#print').disabled = n === 0 || !yearOk;
  renderPreview();
}

function download(bytes, name, type) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

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

$('#entry').onsubmit = (e) => e.preventDefault();

for (const [key, label, max] of FIELDS) {
  const wrap = document.createElement('label');
  wrap.textContent = label;
  const input = document.createElement('input');
  input.id = 'data-' + key;
  input.type = key === 'Tekst3' ? 'date' : 'text';
  if (key !== 'Tekst3') input.maxLength = max;
  let fieldError;
  if (key === 'urodzenia') {
    input.inputMode = 'numeric';
    input.pattern = '[0-9]*';
    input.autocomplete = 'bday-year';
    fieldError = document.createElement('small');
    fieldError.className = 'field-error';
    fieldError.setAttribute('role', 'alert');
  }
  input.oninput = () => {
    if (key === 'urodzenia') input.value = input.value.replace(/\D/g, '').slice(0, max);
    state.shared[key] = input.value;
    if (fieldError) {
      fieldError.textContent = input.value.length === max && !yearValid()
        ? 'Podaj czterocyfrowy rok (1900 lub później).'
        : '';
    }
    update();
  };
  if (fieldError) {
    input.onblur = () => {
      fieldError.textContent = input.value && !yearValid() ? 'Podaj czterocyfrowy rok (1900 lub później).' : '';
    };
  }
  wrap.append(input);
  if (fieldError) wrap.append(fieldError);
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
    update();
  };
  wrap.append(input, text);
  $('#choices').append(wrap);
}

$('#a4').onclick = () => exportPDF();
$('#print').onclick = () => window.print();

async function init() {
  update();
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
