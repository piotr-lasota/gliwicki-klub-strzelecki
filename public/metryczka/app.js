'use strict';

const $ = (s) => document.querySelector(s);

const sharedRoot = $('#shared');
const choicesRoot = $('#choices');
const summaryEl = $('#summary');
const errorEl = $('#error');
const statusEl = $('#status');
const a4Button = $('#a4');
const printButton = $('#print');

const CATEGORIES = [
  ['BP', 'BIG PISTOL (BP)'],
  ['LP', 'LITTLE PISTOL (LP)'],
  ['SR', 'SMALL RIFLE (SR)'],
  ['SHOTGUN', 'SHOTGUN (SG)']
];

const FIELDS = [
  ['Nazwisko', 'Nazwisko', 16],
  ['comb_2', 'Imię', 9],
  ['KLUB', 'Klub', 50],
  ['Siedziba', 'Siedziba klubu', 50],
  ['urodzenia', 'Rok urodzenia', 4],
  ['Tekst3', 'Data zawodów', 10]
];

const REQUIRED_FIELDS = ['Nazwisko', 'comb_2', 'KLUB', 'urodzenia', 'Tekst3'];

const PLACE = 'Gliwice';
const MIN_YEAR = 1900;
const CLUBS_URL = 'data/kluby.json';
const CLUB_LIMIT = 50;
const EVENTS_URL = 'data/zawody.json';
const EVENT_PAST_DAYS = 14;

/**
 * @typedef {Object} Club
 * @property {string} ShortName
 * @property {string} FullName
 * @property {string} Street
 * @property {string} HouseNumber
 * @property {string} AppartmentNumber
 * @property {string} City
 */

/**
 * @typedef {Object} Event
 * @property {string} date
 * @property {string} title
 * @property {string} [subtitle]
 */

/** @type {{ shared: Record<string, string>, selected: string[] }} */
const state = { shared: {}, selected: [] };
let ready = false, busy = false, assets;
/** @type {Club[]} */
let clubs = [];
/** @type {Event[]} */
let events = [];
let clubSiedziba = null, clubError = null, refreshClubOptions = () => {
};
let refreshEventOptions = () => {
}, eventsError = '';

/** @type {Map<string, { key: string, input: HTMLInputElement, error: HTMLElement, required: boolean, touched: boolean }>} */
const fieldStates = new Map();

function missingRequired() {
  return FIELDS
    .filter(([key]) => REQUIRED_FIELDS.includes(key))
    .filter(([key]) => !String(state.shared[key] ?? '').trim())
    .map(([, label]) => label.toLowerCase());
}

function joinPl(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' oraz ' + items[items.length - 1];
}

function isComplete() {
  return !missingRequired().length && yearValid() && state.selected.length > 0;
}

function fieldMessage(field) {
  const value = String(state.shared[field.key] ?? '').trim();
  if (!value) return field.required ? 'To pole jest wymagane.' : '';
  if (field.key === 'urodzenia' && !yearValid()) return 'Podaj czterocyfrowy rok (1900 lub później).';
  return '';
}

function refreshFieldErrors() {
  for (const field of fieldStates.values()) {
    if (field.touched) field.error.textContent = fieldMessage(field);
  }
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}[ch]));

const CLUB_DIACRITICS = { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z' };

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (ch) => CLUB_DIACRITICS[ch])
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clubAddress(club) {
  const street = String(club.Street ?? '').trim();
  const house = String(club.HouseNumber ?? '').trim();
  const flat = String(club.AppartmentNumber ?? '').trim();
  const building = [street, house].filter(Boolean).join(' ');
  const line = flat ? (building ? `${building}/${flat}` : flat) : building;
  return [line, String(club.City ?? '').trim()].filter(Boolean).join(', ');
}

function searchClubs(query) {
  const q = normalizeText(query);
  const tokens = q.split(' ').filter(Boolean);
  const found = [];
  clubs.forEach((club, index) => {
    const shortName = normalizeText(club.ShortName);
    const fullName = normalizeText(club.FullName);
    const haystack = `${shortName} ${fullName}`;
    if (tokens.length && !tokens.every((token) => haystack.includes(token))) return;
    let score = 0;
    if (q) {
      if (shortName.startsWith(q)) score = 0;
      else if (shortName.includes(q)) score = 1;
      else if (fullName.startsWith(q)) score = 2;
      else score = 3;
    }
    found.push({ club, score, index });
  });
  found.sort((a, b) => a.score - b.score || a.index - b.index);
  return found.slice(0, CLUB_LIMIT).map((entry) => entry.club);
}

function listEvents() {
  const today = new Date();
  const cutoff = new Date(today.getFullYear(), today.getMonth(), today.getDate() - EVENT_PAST_DAYS);
  const found = [];
  events.forEach((event, index) => {
    const date = parseEventDate(event.date);
    if (!date) return;
    found.push({ event, date, selectable: date >= cutoff, index });
  });
  found.sort((a, b) => b.date - a.date || a.index - b.index);
  return found;
}

function parseEventDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ''));
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function eventDateLabel(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

function eventName(event) {
  return [event.title, event.subtitle].filter(Boolean).join(' · ');
}

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

function cols(values, unit) {
  return values.map((value) => value + unit).join(' ');
}

function scoreTable() {
  const colsHTML = `<colgroup>${LAYOUT.SCORE_COLS.map((value) => `<col style="width:${value}%">`).join('')}</colgroup>`;
  const head = `<thead><tr>
      <th class="diag"><span>Strzały</span><span>Serie</span></th>
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<th>${n}</th>`).join('')}
      <th>Suma</th><th>Uwagi</th>
    </tr></thead>`;
  const rows = [1, 2, 3].map((r) => `<tr>
      <th class="rl">${r}</th>${'<td></td>'.repeat(10)}<td></td><td></td>
    </tr>`).join('');
  return `<table class="score">${colsHTML}${head}<tbody>${rows}</tbody></table>`;
}

function cardHTML(label) {
  const [catName, catCode] = categoryParts(label);
  return `<article class="metryczka">
    <h2 class="mtitle">METRYCZKA STRZELANIA</h2>

    <div class="mrow meta" style="grid-template-columns:${cols(LAYOUT.META_COLS, '%')}">
      <div class="cell lab">Konkurencja</div>
      <div class="cell val konk"><span>${esc(catName)}</span><span>${esc(catCode)}</span></div>
      <div class="cell lab">Zmiana</div>
      <div class="cell val"></div>
      <div class="cell lab">Stanowisko</div>
      <div class="cell val"></div>
      <div class="cell lab">Miejsce i data<br>zawodów</div>
      <div class="cell val">${esc(competitionDate())}</div>
    </div>

    <div class="mrow r-nazw" style="grid-template-columns:${cols([LAYOUT.LABEL_W, LAYOUT.NAZWISKO_COMB_W], 'pt')}">
      <div class="cell lab">Nazwisko</div>
      ${comb('Nazwisko', 27)}
    </div>

    <div class="mrow r-imie" style="grid-template-columns:${cols([LAYOUT.LABEL_W, LAYOUT.IMIE_COMB_W, LAYOUT.ROK_LABEL_W, LAYOUT.ROK_COMB_W], 'pt')}">
      <div class="cell lab">Imię</div>
      ${comb('comb_2', 20)}
      <div class="cell lab">Rok<br>urodzenia</div>
      ${comb('urodzenia', 4)}
    </div>

    <div class="mrow r-klub" style="grid-template-columns:${cols([LAYOUT.LABEL_W, LAYOUT.KLUB_VALUE_W, LAYOUT.SIEDZIBA_LABEL_W, LAYOUT.KLUB_VALUE_W], 'pt')}">
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
      <div class="osw">${esc(LAYOUT.DECL_TEXT)}</div>
    </div>

    <div class="bottom">
      <div class="bcell"><img class="logo" src="../assets/logo.jpg" alt="Gliwicki Klub Strzelecki"></div>
      <div class="bcell"><span class="phone">${esc(LAYOUT.PHONE)}</span></div>
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

function createClubFields() {
  const field = document.createElement('div');
  field.className = 'club-field';

  const label = document.createElement('label');
  label.htmlFor = 'data-KLUB';
  label.textContent = 'Klub *';

  const box = document.createElement('div');
  box.className = 'club-combobox';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'data-KLUB';
  input.maxLength = 50;
  input.autocomplete = 'off';
  input.placeholder = 'Wpisz nazwę klubu…';
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'club-options');
  input.setAttribute('aria-required', 'true');
  input.required = true;
  input.value = state.shared.KLUB || '';

  const list = document.createElement('ul');
  list.className = 'club-options';
  list.id = 'club-options';
  list.setAttribute('role', 'listbox');
  list.hidden = true;

  const error = document.createElement('small');
  error.className = 'field-error';
  error.setAttribute('role', 'status');

  const requiredError = document.createElement('small');
  requiredError.className = 'field-error';
  requiredError.setAttribute('role', 'alert');

  box.append(input, list);
  field.append(label, box, error, requiredError);
  sharedRoot.append(field);

  const siedzibaField = document.createElement('label');
  siedzibaField.textContent = 'Siedziba klubu';
  const siedziba = document.createElement('input');
  siedziba.type = 'text';
  siedziba.id = 'data-Siedziba';
  siedziba.maxLength = 50;
  siedziba.readOnly = true;
  siedziba.value = state.shared.Siedziba || '';
  siedzibaField.append(siedziba);
  sharedRoot.append(siedzibaField);

  clubSiedziba = siedziba;
  clubError = error;
  fieldStates.set('KLUB', { key: 'KLUB', input, error: requiredError, required: true, touched: false });

  let selected = null;
  let matches = [];
  let active = -1;
  let open = false;

  function clearAddress() {
    if (state.shared.Siedziba === '') return;
    state.shared.Siedziba = '';
    siedziba.value = '';
  }

  function closeList() {
    open = false;
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function highlight() {
    Array.from(list.children).forEach((element, index) => {
      element.classList.toggle('active', index === active && element.getAttribute('role') === 'option');
    });
    if (active >= 0 && list.children[active]) {
      input.setAttribute('aria-activedescendant', list.children[active].id);
      list.children[active].scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function renderOptions() {
    if (!open) {
      closeList();
      return;
    }
    matches = searchClubs(input.value);
    list.textContent = '';
    if (!matches.length) {
      const empty = document.createElement('li');
      empty.className = 'club-empty';
      empty.textContent = clubs.length ? 'Brak pasujących klubów.' : 'Lista klubów jeszcze się wczytuje…';
      list.append(empty);
      active = -1;
    } else {
      matches.forEach((club, index) => {
        const item = document.createElement('li');
        item.id = 'club-option-' + index;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(club === selected));

        const shortName = document.createElement('span');
        shortName.className = 'club-short';
        shortName.textContent = club.ShortName;

        const fullName = document.createElement('span');
        fullName.className = 'club-full';
        fullName.textContent = club.FullName;

        const place = document.createElement('span');
        place.className = 'club-place';
        place.textContent = clubAddress(club);

        item.append(shortName, fullName, place);
        item.onmousedown = (event) => event.preventDefault();
        item.onclick = () => selectClub(club);
        item.onmouseenter = () => {
          active = index;
          highlight();
        };
        list.append(item);
      });
      if (active >= matches.length) active = matches.length - 1;
    }
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    highlight();
  }

  function selectClub(club) {
    selected = club;
    input.value = club.ShortName;
    state.shared.KLUB = club.ShortName;
    state.shared.Siedziba = clubAddress(club);
    siedziba.value = state.shared.Siedziba;
    closeList();
    update();
  }

  input.oninput = () => {
    state.shared.KLUB = input.value;
    if (!selected || input.value !== selected.ShortName) {
      selected = null;
      clearAddress();
    }
    open = true;
    active = -1;
    renderOptions();
    update();
  };

  input.onfocus = () => {
    open = true;
    active = -1;
    renderOptions();
  };

  input.onblur = () => {
    const field = fieldStates.get('KLUB');
    if (field) {
      field.touched = true;
      field.error.textContent = fieldMessage(field);
    }
    setTimeout(() => {
      if (document.activeElement !== input) closeList();
    }, 100);
  };

  input.onkeydown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        open = true;
        renderOptions();
      }
      if (!matches.length) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      active = active < 0
        ? (step === 1 ? 0 : matches.length - 1)
        : (active + step + matches.length) % matches.length;
      highlight();
    } else if (event.key === 'Enter' && open) {
      if (active < 0 && matches.length === 1) active = 0;
      if (active >= 0 && matches[active]) {
        event.preventDefault();
        selectClub(matches[active]);
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      closeList();
    }
  };

  refreshClubOptions = () => {
    if (open) renderOptions();
  };
}

function createEventPicker() {
  const dateInput = $('#data-Tekst3');
  if (!dateInput) return;

  const field = document.createElement('label');
  field.className = 'wide';
  field.textContent = 'Zawody';

  const box = document.createElement('div');
  box.className = 'club-combobox';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'data-zawody';
  input.autocomplete = 'off';
  input.readOnly = true;
  input.placeholder = 'Wybierz zawody z listy…';
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'event-options');
  input.setAttribute('aria-readonly', 'true');

  const list = document.createElement('ul');
  list.className = 'club-options event-options';
  list.id = 'event-options';
  list.setAttribute('role', 'listbox');
  list.hidden = true;

  const error = document.createElement('small');
  error.className = 'field-error';
  error.setAttribute('role', 'status');

  box.append(input, list);
  field.append(box, error);
  sharedRoot.prepend(field);

  let selected = null;
  let matches = [];
  let active = -1;
  let open = false;

  function closeList() {
    open = false;
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function highlight() {
    Array.from(list.children).forEach((element, index) => {
      element.classList.toggle('active', index === active && element.getAttribute('role') === 'option');
    });
    if (active >= 0 && list.children[active]) {
      input.setAttribute('aria-activedescendant', list.children[active].id);
      list.children[active].scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function moveActive(step) {
    if (!matches.length) return;
    let index = active;
    for (let i = 0; i < matches.length; i++) {
      index = index < 0
        ? (step === 1 ? 0 : matches.length - 1)
        : (index + step + matches.length) % matches.length;
      if (matches[index].selectable) {
        active = index;
        return;
      }
    }
    active = -1;
  }

  function selectEvent(event) {
    selected = event;
    input.value = eventName(event);
    state.shared.Tekst3 = event.date;
    dateInput.value = event.date;
    closeList();
    update();
  }

  function renderOptions() {
    if (!open) {
      closeList();
      return;
    }
    matches = listEvents();
    list.textContent = '';
    if (!matches.length) {
      const empty = document.createElement('li');
      empty.className = 'event-empty';
      empty.textContent = eventsError || 'Lista zawodów jeszcze się wczytuje…';
      list.append(empty);
      active = -1;
    } else {
      matches.forEach((entry, index) => {
        const item = document.createElement('li');
        item.id = 'event-option-' + index;
        item.setAttribute('role', 'option');

        const name = document.createElement('span');
        name.className = 'event-name';
        name.textContent = eventDateLabel(entry.date) + ' - ' + entry.event.title;

        const subtitle = String(entry.event.subtitle ?? '').trim();
        const metaText = [subtitle, entry.selectable ? '' : 'przeszłe'].filter(Boolean).join(' · ');
        const meta = document.createElement('span');
        meta.className = 'event-meta';
        meta.textContent = metaText;

        if (!entry.selectable) {
          item.classList.add('past');
          item.setAttribute('aria-disabled', 'true');
          item.title = 'Zawody przeszłe — nie można ich wybrać.';
        } else {
          item.setAttribute('aria-selected', String(entry.event === selected));
          item.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            selectEvent(entry.event);
          };
          item.onmouseenter = () => {
            active = index;
            highlight();
          };
        }

        item.onmousedown = (event) => event.preventDefault();
        item.append(name);
        if (metaText) item.append(meta);
        list.append(item);
      });
      if (active >= matches.length || active < 0 || !matches[active]?.selectable) active = -1;
    }
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    highlight();
  }

  input.onfocus = () => {
    open = true;
    active = -1;
    renderOptions();
  };

  input.onclick = () => {
    open = true;
    renderOptions();
  };

  input.onblur = () => {
    setTimeout(() => {
      if (document.activeElement !== input) closeList();
    }, 100);
  };

  input.onkeydown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        open = true;
        renderOptions();
      }
      moveActive(event.key === 'ArrowDown' ? 1 : -1);
      highlight();
    } else if (event.key === 'Enter' && open) {
      if (active < 0 && matches.length === 1 && matches[0].selectable) active = 0;
      if (active >= 0 && matches[active]?.selectable) {
        event.preventDefault();
        selectEvent(matches[active].event);
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      closeList();
    }
  };

  dateInput.addEventListener('input', () => {
    if (selected && selected.date !== dateInput.value) {
      selected = null;
      input.value = '';
    }
  });

  refreshEventOptions = () => {
    error.textContent = eventsError;
    if (open) renderOptions();
  };
}

async function fetchClubs() {
  const response = await fetch(CLUBS_URL, { cache: 'no-cache' });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const payload = await response.json();
  const list = payload && Array.isArray(payload['soz.pzss.org.pl']) ? payload['soz.pzss.org.pl'] : [];
  const found = list.filter((club) => club && String(club.ShortName ?? '').trim());
  if (!found.length) throw new Error('Lista klubów jest pusta.');
  return found;
}

async function loadClubs() {
  try {
    clubs = await fetchClubs();
    clubError.textContent = '';
    refreshClubOptions();
  } catch (e) {
    console.error(e);
    clubError.textContent = 'Nie udało się wczytać listy klubów. Wpisz klub i siedzibę ręcznie.';
    if (clubSiedziba) {
      clubSiedziba.readOnly = false;
      clubSiedziba.placeholder = 'Wpisz siedzibę klubu';
    }
  }
}

async function fetchEvents() {
  const response = await fetch(EVENTS_URL, { cache: 'no-cache' });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const payload = await response.json();
  const list = payload && Array.isArray(payload.zawody) ? payload.zawody : [];
  const found = list.filter((event) => event && parseEventDate(event.date) && String(event.title ?? '').trim());
  if (!found.length) throw new Error('Lista zawodów jest pusta.');
  return found;
}

async function loadEvents() {
  try {
    events = await fetchEvents();
    eventsError = '';
    refreshEventOptions();
  } catch (e) {
    console.error(e);
    events = [];
    eventsError = 'Nie udało się wczytać listy zawodów. Wybierz datę ręcznie.';
    refreshEventOptions();
  }
}

function setTip(button, text) {
  const wrap = button.parentElement;
  if (!wrap || !wrap.classList.contains('action')) return;
  if (text) wrap.dataset.tip = text;
  else wrap.removeAttribute('data-tip');
}

function update() {
  const n = state.selected.length;
  const missing = missingRequired();
  const yearOk = yearValid();
  const complete = isComplete();
  if (missing.length) {
    summaryEl.textContent = 'Uzupełnij: ' + joinPl(missing) + '.';
  } else if (!yearOk) {
    summaryEl.textContent = 'Podaj czterocyfrowy rok urodzenia (1900 lub później).';
  } else if (n === 0) {
    summaryEl.textContent = 'Zaznacz co najmniej jedną konkurencję.';
  } else {
    summaryEl.textContent = n + ' ' + (n === 1 ? 'metryczka' : 'metryczki') + ' · ' + Math.ceil(n / 2) + ' ' + (n <= 2 ? 'kartka A4' : 'kartki A4') + '.';
  }
  a4Button.disabled = !ready || busy || !complete;
  printButton.disabled = busy || !complete;
  const tip = complete ? '' : summaryEl.textContent;
  setTip(a4Button, a4Button.disabled && tip ? tip : '');
  setTip(printButton, printButton.disabled && tip ? tip : '');
  refreshFieldErrors();
  renderPreview();
}

function download(bytes, name, type) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

async function exportPDF() {
  if (!ready || busy || !isComplete()) return;
  busy = true;
  update();
  errorEl.textContent = '';
  statusEl.textContent = 'Przygotowywanie PDF…';
  try {
    const bytes = await fillPrintPDF(assets, forms());
    download(bytes, 'metryczki-gks-do-druku-A4.pdf', 'application/pdf');
    statusEl.textContent = 'Przygotowano PDF do pobrania. Otwórz zapisany plik w programie do PDF.';
  } catch (e) {
    errorEl.textContent = 'Nie udało się przygotować PDF: ' + e.message;
  } finally {
    busy = false;
    update();
  }
}

$('#entry').onsubmit = (e) => e.preventDefault();

for (const [key, label, max] of FIELDS) {
  if (key === 'KLUB') {
    createClubFields();
    continue;
  }
  if (key === 'Siedziba') continue;
  const required = REQUIRED_FIELDS.includes(key);
  const wrap = document.createElement('label');
  wrap.textContent = required ? label + ' *' : label;
  const input = document.createElement('input');
  input.id = 'data-' + key;
  input.type = key === 'Tekst3' ? 'date' : 'text';
  if (key !== 'Tekst3') input.maxLength = max;
  if (required) {
    input.required = true;
    input.setAttribute('aria-required', 'true');
  }
  if (key === 'urodzenia') {
    input.inputMode = 'numeric';
    input.pattern = '[0-9]*';
    input.autocomplete = 'bday-year';
  }
  const fieldError = document.createElement('small');
  fieldError.className = 'field-error';
  fieldError.setAttribute('role', 'alert');
  fieldStates.set(key, { key, input, error: fieldError, required, touched: false });
  input.oninput = () => {
    if (key === 'urodzenia') input.value = input.value.replace(/\D/g, '').slice(0, max);
    state.shared[key] = input.value;
    const field = fieldStates.get(key);
    if (field?.touched) field.error.textContent = fieldMessage(field);
    update();
  };
  input.onblur = () => {
    const field = fieldStates.get(key);
    if (!field) return;
    field.touched = true;
    field.error.textContent = fieldMessage(field);
  };
  wrap.append(input, fieldError);
  sharedRoot.append(wrap);
}

createEventPicker();

for (const [id, label] of CATEGORIES) {
  const wrap = document.createElement('label');
  const input = document.createElement('input');
  const text = document.createElement('span');
  input.type = 'checkbox';
  input.id = 'choice-' + id;
  text.textContent = label;
  input.onchange = () => {
    state.selected = CATEGORIES
      .filter(([key]) => {
        const box = document.getElementById('choice-' + key);
        return box instanceof HTMLInputElement && box.checked;
      })
      .map(([key]) => key);
    update();
  };
  wrap.append(input, text);
  choicesRoot.append(wrap);
}

a4Button.onclick = () => exportPDF();
printButton.onclick = () => {
  if (isComplete()) window.print();
};

async function fetchAssets() {
  const r = await Promise.all(['vendor/LiberationSans-Regular.ttf', 'vendor/LiberationSans-Bold.ttf', '../assets/logo.jpg'].map((p) => fetch(p)));
  if (r.some((x) => !x.ok)) throw Error('Nie udało się wczytać czcionek.');
  const [regular, bold, logo] = await Promise.all(r.map((x) => x.arrayBuffer()));
  return { regular, bold, logo };
}

async function init() {
  update();
  void loadClubs();
  void loadEvents();
  try {
    assets = await fetchAssets();
    ready = true;
    update();
  } catch (e) {
    errorEl.textContent = e.message + ' Odśwież stronę.';
  }
}

void init();
