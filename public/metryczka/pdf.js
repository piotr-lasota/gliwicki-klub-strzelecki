'use strict';

/* global LAYOUT, PDFLib, fontkit */

/*
 * Metryczka jest rysowana wektorowo w PDF na podstawie tego samego układu,
 * który widać w podglądzie HTML. Dzięki temu pobierany plik nie zawiera
 * skanu formularza (ani artefaktów z osadzonego JPG).
 */

const PDF_MM = 72 / 25.4;
const PDF_PAGE_W = 210 * PDF_MM;
const PDF_PAGE_H = 297 * PDF_MM;
const PDF_CARD_H = PDF_PAGE_H / 2;
const PDF_PAD_X = 29.5;
const PDF_CONTENT_W = PDF_PAGE_W - 2 * PDF_PAD_X;
const PDF_ROW_W = LAYOUT.ROW_W;

const PDF_INK = PDFLib.rgb(0.2, 0.2, 0.2);
const PDF_BORDER = 0.75;
const PDF_CAP = 0.344;

const PDF_META = {
  top: 38,
  height: 25,
  cols: LAYOUT.META_COLS
};
const PDF_NAME_ROW_TOP = 70;
const PDF_ROW_H = 21;
const PDF_IME_ROW_TOP = PDF_NAME_ROW_TOP + PDF_ROW_H - PDF_BORDER;
const PDF_CLUB_ROW_TOP = PDF_IME_ROW_TOP + PDF_ROW_H - PDF_BORDER;
const PDF_SCORE_TOP = PDF_CLUB_ROW_TOP + PDF_ROW_H + 7;
const PDF_SCORE_HEAD_H = 42;
const PDF_SCORE_ROW_H = 21;
const PDF_SCORE_H = PDF_SCORE_HEAD_H + 3 * PDF_SCORE_ROW_H + PDF_BORDER;
const PDF_SIGS_TOP = PDF_SCORE_TOP + PDF_SCORE_H + 30;
const PDF_SIG_H = 11.745;
const PDF_DECL_TOP = PDF_SIGS_TOP + PDF_SIG_H + 14;
const PDF_DECL_LINE_H = 10.8;
const PDF_DECL_H = 2 * PDF_DECL_LINE_H;
const PDF_BOTTOM_TOP = PDF_DECL_TOP + PDF_DECL_H + 14;
const PDF_BOTTOM_H = 28.335;

function pdfRect(page, x, top, width, height, fill) {
  page.drawRectangle({
    x,
    y: top - height,
    width,
    height,
    color: fill,
    borderColor: PDF_INK,
    borderWidth: PDF_BORDER
  });
}

function pdfLine(page, x1, y1, x2, y2) {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: PDF_BORDER,
    color: PDF_INK
  });
}

function pdfText(page, text, x, baseline, size, font) {
  if (!text) return;
  page.drawText(text, { x, y: baseline, size, font, color: PDF_INK });
}

function pdfTextCentered(page, text, centerX, baseline, size, font) {
  if (!text) return;
  const width = font.widthOfTextAtSize(text, size);
  pdfText(page, text, centerX - width / 2, baseline, size, font);
}

function pdfFit(text, maxWidth, size, font) {
  const value = String(text ?? '');
  if (!value || font.widthOfTextAtSize(value, size) <= maxWidth) return value;
  let shortened = value;
  while (shortened.length && font.widthOfTextAtSize(shortened + '…', size) > maxWidth) {
    shortened = shortened.slice(0, -1);
  }
  return shortened ? shortened + '…' : '';
}

function pdfTrackingWidth(text, size, font, tracking) {
  return font.widthOfTextAtSize(text, size) + tracking * Math.max(0, text.length - 1);
}

function pdfTrackedTextCentered(page, text, centerX, baseline, size, font, tracking) {
  const width = pdfTrackingWidth(text, size, font, tracking);
  let x = centerX - width / 2;
  for (const ch of text) {
    pdfText(page, ch, x, baseline, size, font);
    x += font.widthOfTextAtSize(ch, size) + tracking;
  }
}

function pdfDrawMeta(page, cardTop, data, fonts) {
  const x = PDF_PAD_X;
  const width = PDF_CONTENT_W;
  const top = cardTop - PDF_META.top;
  pdfRect(page, x, top, width, PDF_META.height);

  const boundaries = [x];
  for (const percent of PDF_META.cols) {
    boundaries.push(boundaries[boundaries.length - 1] + width * percent / 100);
  }
  for (let i = 1; i < boundaries.length - 1; i++) {
    pdfLine(page, boundaries[i], top, boundaries[i], top - PDF_META.height);
  }

  const middle = top - PDF_META.height / 2;
  const labelBaseline = middle - PDF_CAP * 7.1;
  const centers = boundaries.slice(0, -1).map((left, i) => (left + boundaries[i + 1]) / 2);

  pdfTextCentered(page, 'Konkurencja', centers[0], labelBaseline, 7.1, fonts.bold);
  pdfTextCentered(page, 'Zmiana', centers[2], labelBaseline, 7.1, fonts.bold);
  pdfTextCentered(page, 'Stanowisko', centers[4], labelBaseline, 7.1, fonts.bold);
  pdfTextCentered(page, 'Miejsce i data', centers[6], middle + 3.9 - PDF_CAP * 7.1, 7.1, fonts.bold);
  pdfTextCentered(page, 'zawodów', centers[6], middle - 3.9 - PDF_CAP * 7.1, 7.1, fonts.bold);

  const [categoryName, categoryCode] = String(data.Tekst1 ?? '').split('\n');
  const categoryMax = width * PDF_META.cols[1] / 100 - 4;
  pdfTextCentered(page, pdfFit(categoryName, categoryMax, 9, fonts.regular), centers[1], middle + 4.86 - PDF_CAP * 9, 9, fonts.regular);
  if (categoryCode) {
    pdfTextCentered(page, pdfFit(categoryCode, categoryMax, 9, fonts.regular), centers[1], middle - 4.86 - PDF_CAP * 9, 9, fonts.regular);
  }

  const dateMax = width * PDF_META.cols[7] / 100 - 4;
  pdfTextCentered(page, pdfFit(data.Tekst3, dateMax, 9, fonts.regular), centers[7], middle - PDF_CAP * 9, 9, fonts.regular);
}

function pdfDrawComb(page, top, x, width, cols, value, fonts) {
  pdfRect(page, x, top, width, PDF_ROW_H);
  const step = width / cols;
  for (let i = 1; i < cols; i++) {
    pdfLine(page, x + i * step, top, x + i * step, top - PDF_ROW_H);
  }
  const baseline = top - PDF_ROW_H / 2 - PDF_CAP * 9;
  const chars = String(value ?? '').slice(0, cols).split('');
  for (let i = 0; i < chars.length; i++) {
    if (!chars[i]) continue;
    pdfTextCentered(page, chars[i], x + (i + 0.5) * step, baseline, 9, fonts.regular);
  }
}

function pdfDrawPersonRows(page, cardTop, data, fonts) {
  const x = PDF_PAD_X;

  let top = cardTop - PDF_NAME_ROW_TOP;
  const nameLabelW = LAYOUT.LABEL_W;
  const nameCombW = LAYOUT.NAZWISKO_COMB_W;
  pdfRect(page, x, top, PDF_ROW_W, PDF_ROW_H);
  pdfLine(page, x + nameLabelW, top, x + nameLabelW, top - PDF_ROW_H);
  pdfTextCentered(page, 'Nazwisko', x + nameLabelW / 2, top - PDF_ROW_H / 2 - PDF_CAP * 7.1, 7.1, fonts.bold);
  pdfDrawComb(page, top, x + nameLabelW, nameCombW, 27, data.Nazwisko, fonts);

  top = cardTop - PDF_IME_ROW_TOP;
  const imieCombW = LAYOUT.IMIE_COMB_W;
  const yearLabelW = LAYOUT.ROK_LABEL_W;
  const yearCombW = LAYOUT.ROK_COMB_W;
  pdfRect(page, x, top, PDF_ROW_W, PDF_ROW_H);
  pdfLine(page, x + nameLabelW, top, x + nameLabelW, top - PDF_ROW_H);
  pdfLine(page, x + nameLabelW + imieCombW, top, x + nameLabelW + imieCombW, top - PDF_ROW_H);
  pdfLine(page, x + nameLabelW + imieCombW + yearLabelW, top, x + nameLabelW + imieCombW + yearLabelW, top - PDF_ROW_H);
  pdfTextCentered(page, 'Imię', x + nameLabelW / 2, top - PDF_ROW_H / 2 - PDF_CAP * 7.1, 7.1, fonts.bold);
  pdfDrawComb(page, top, x + nameLabelW, imieCombW, 20, data.comb_2, fonts);
  const yearCenterX = x + nameLabelW + imieCombW + yearLabelW / 2;
  const yearMiddle = top - PDF_ROW_H / 2;
  pdfTextCentered(page, 'Rok', yearCenterX, yearMiddle + 3.9 - PDF_CAP * 7.1, 7.1, fonts.bold);
  pdfTextCentered(page, 'urodzenia', yearCenterX, yearMiddle - 3.9 - PDF_CAP * 7.1, 7.1, fonts.bold);
  pdfDrawComb(page, top, x + nameLabelW + imieCombW + yearLabelW, yearCombW, 4, data.urodzenia, fonts);

  top = cardTop - PDF_CLUB_ROW_TOP;
  const clubValueW = LAYOUT.KLUB_VALUE_W;
  const siedzibaLabelW = LAYOUT.SIEDZIBA_LABEL_W;
  pdfRect(page, x, top, PDF_ROW_W, PDF_ROW_H);
  pdfLine(page, x + nameLabelW, top, x + nameLabelW, top - PDF_ROW_H);
  pdfLine(page, x + nameLabelW + clubValueW, top, x + nameLabelW + clubValueW, top - PDF_ROW_H);
  pdfLine(page, x + nameLabelW + clubValueW + siedzibaLabelW, top, x + nameLabelW + clubValueW + siedzibaLabelW, top - PDF_ROW_H);
  const clubMiddle = top - PDF_ROW_H / 2;
  pdfTextCentered(page, 'KLUB', x + nameLabelW / 2, clubMiddle - PDF_CAP * 7.1, 7.1, fonts.bold);
  pdfTextCentered(page, 'Siedziba', x + nameLabelW + clubValueW + siedzibaLabelW / 2, clubMiddle - PDF_CAP * 7.1, 7.1, fonts.bold);

  const valueBaseline = clubMiddle - PDF_CAP * 9;
  const clubMax = clubValueW - 4;
  pdfTextCentered(page, pdfFit(data.KLUB, clubMax, 9, fonts.regular), x + nameLabelW + clubValueW / 2, valueBaseline, 9, fonts.regular);
  const siedzibaMax = clubValueW - 4;
  const siedzibaCenter = x + nameLabelW + clubValueW + siedzibaLabelW + clubValueW / 2;
  pdfTextCentered(page, pdfFit(data.Siedziba, siedzibaMax, 9, fonts.regular), siedzibaCenter, valueBaseline, 9, fonts.regular);
}

function pdfDrawScore(page, cardTop, fonts) {
  const x = PDF_PAD_X;
  const width = PDF_CONTENT_W;
  const top = cardTop - PDF_SCORE_TOP;
  const baseCols = LAYOUT.SCORE_COLS;
  const totalPercent = baseCols.reduce((sum, value) => sum + value, 0);
  const cols = baseCols.map((value) => width * value / totalPercent);
  const boundaries = [x];
  for (const col of cols) boundaries.push(boundaries[boundaries.length - 1] + col);

  const height = PDF_SCORE_HEAD_H + 3 * PDF_SCORE_ROW_H;
  pdfRect(page, x, top, width, height);
  for (let i = 1; i < boundaries.length - 1; i++) {
    pdfLine(page, boundaries[i], top, boundaries[i], top - height);
  }
  for (let row = 1; row <= 3; row++) {
    const y = top - PDF_SCORE_HEAD_H - row * PDF_SCORE_ROW_H;
    pdfLine(page, x, y, x + width, y);
  }
  pdfLine(page, x, top - PDF_SCORE_HEAD_H, x + width, top - PDF_SCORE_HEAD_H);

  const headerBaseline = top - PDF_SCORE_HEAD_H / 2 - PDF_CAP * 8;
  for (let i = 0; i < 10; i++) {
    const cx = (boundaries[i + 1] + boundaries[i + 2]) / 2;
    pdfTextCentered(page, String(i + 1), cx, headerBaseline, 8, fonts.bold);
  }
  const sumaCenter = (boundaries[11] + boundaries[12]) / 2;
  const uwagiCenter = (boundaries[12] + boundaries[13]) / 2;
  pdfTextCentered(page, 'Suma', sumaCenter, headerBaseline, 8, fonts.bold);
  pdfTextCentered(page, 'Uwagi', uwagiCenter, headerBaseline, 8, fonts.bold);

  // Przekątna w komórce „Strzały / Serie”.
  const diagLeft = x;
  const diagRight = boundaries[1];
  const diagTop = top;
  const diagBottom = top - PDF_SCORE_HEAD_H;
  pdfLine(page, diagLeft, diagTop, diagRight, diagBottom);
  pdfText(page, 'Strzały', diagRight - 3 - fonts.regular.widthOfTextAtSize('Strzały', 7), diagTop - 3 - 0.8 * 7, 7, fonts.regular);
  pdfText(page, 'Serie', diagLeft + 3, diagBottom + 3 + 0.212 * 7, 7, fonts.regular);

  for (let row = 0; row < 3; row++) {
    const y = top - PDF_SCORE_HEAD_H - (row + 0.5) * PDF_SCORE_ROW_H;
    pdfTextCentered(page, String(row + 1), (boundaries[0] + boundaries[1]) / 2, y - PDF_CAP * 8, 8, fonts.bold);
  }
}

function pdfDrawSignature(page, top, x, width, fonts, label) {
  pdfLine(page, x, top, x + width, top);
  const labelTop = top - 2.745;
  pdfTextCentered(page, label, x + width / 2, labelTop - 4.5 - PDF_CAP * 8, 8, fonts.regular);
}

function pdfDrawSignatures(page, cardTop, fonts) {
  const x = PDF_PAD_X;
  const gap = 16;
  const width = (PDF_CONTENT_W - 2 * gap) / 3;
  const top = cardTop - PDF_SIGS_TOP;
  const labels = ['Podpis zawodnika', 'Podpis sędziego oceniającego', 'Podpis sędziego sprawdzającego'];
  for (let i = 0; i < 3; i++) {
    pdfDrawSignature(page, top, x + i * (width + gap), width, fonts, labels[i]);
  }
}

function pdfWrapText(text, maxWidth, size, font) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? line + ' ' + word : word;
    if (!line || font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function pdfDrawDeclaration(page, cardTop, fonts) {
  const x = PDF_PAD_X;
  const lines = pdfWrapText(LAYOUT.DECL_TEXT, PDF_CONTENT_W, 8, fonts.regular);
  lines.forEach((line, index) => {
    const lineCenter = cardTop - PDF_DECL_TOP - (index + 0.5) * PDF_DECL_LINE_H;
    pdfText(page, line, x, lineCenter - PDF_CAP * 8, 8, fonts.regular);
  });
}

function pdfDrawBottom(page, cardTop, fonts, logo) {
  const x = PDF_PAD_X;
  const gap = 8;
  const width = (PDF_CONTENT_W - 2 * gap) / 3;
  const top = cardTop - PDF_BOTTOM_TOP;
  const centers = [x + width / 2, x + width + gap + width / 2, x + 2 * (width + gap) + width / 2];

  const logoHeight = 10 * PDF_MM;
  const logoWidth = logo.width / logo.height * logoHeight;
  page.drawImage(logo, {
    x: centers[0] - logoWidth / 2,
    y: top - logoHeight,
    width: logoWidth,
    height: logoHeight
  });

  const phoneBaseline = top - PDF_BOTTOM_H / 2 - PDF_CAP * 10;
  pdfTextCentered(page, LAYOUT.PHONE, centers[1], phoneBaseline, 10, fonts.regular);

  const sigTop = top - (PDF_BOTTOM_H - PDF_SIG_H) / 2;
  pdfDrawSignature(page, sigTop, x + 2 * (width + gap), width, fonts, 'Podpis zawodnika');
}

function pdfDrawCard(page, cardTop, data, fonts, logo) {
  const top = (offset) => cardTop - offset;

  pdfTrackedTextCentered(page, 'METRYCZKA STRZELANIA', PDF_PAD_X + PDF_CONTENT_W / 2, top(12 + 21.75 / 2 + PDF_CAP * 19), 19, fonts.bold, 0.2);
  pdfDrawMeta(page, cardTop, data, fonts);
  pdfDrawPersonRows(page, cardTop, data, fonts);
  pdfDrawScore(page, cardTop, fonts);
  pdfDrawSignatures(page, cardTop, fonts);
  pdfDrawDeclaration(page, cardTop, fonts);
  pdfDrawBottom(page, cardTop, fonts, logo);
}

async function fillPrintPDF(assets, forms) {
  if (!Array.isArray(forms) || forms.length < 1 || forms.length > 4) throw new Error('Wybierz od 1 do 4 metryczek.');
  const doc = await PDFLib.PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fonts = {
    regular: await doc.embedFont(assets.regular, { subset: true }),
    bold: await doc.embedFont(assets.bold, { subset: true })
  };
  const logo = await doc.embedJpg(assets.logo);

  for (let i = 0; i < forms.length; i += 2) {
    const page = doc.addPage([PDF_PAGE_W, PDF_PAGE_H]);
    pdfDrawCard(page, PDF_PAGE_H, forms[i], fonts, logo);
    if (forms[i + 1]) pdfDrawCard(page, PDF_PAGE_H - PDF_CARD_H, forms[i + 1], fonts, logo);
  }

  return doc.save();
}
