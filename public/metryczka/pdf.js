const PLACE_LABEL = { x: 340.464, y: 355.182, width: 86.338, height: 26.457 };

async function replacePlaceLabel(doc) {
  const page = doc.getPages()[0];
  const font = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
  const size = 9;
  const label = 'Data zawodów';
  const labelWidth = font.widthOfTextAtSize(label, size);
  page.drawRectangle({
    x: PLACE_LABEL.x + 1,
    y: PLACE_LABEL.y + 1,
    width: PLACE_LABEL.width - 2,
    height: PLACE_LABEL.height - 2,
    color: PDFLib.rgb(1, 1, 1),
  });
  page.drawText(label, {
    x: PLACE_LABEL.x + (PLACE_LABEL.width - labelWidth) / 2,
    y: PLACE_LABEL.y + (PLACE_LABEL.height - size) / 2 + 2,
    size,
    font,
    color: PDFLib.rgb(0, 0, 0),
  });
}

async function fillOriginalPDF(sourceBytes, fontBytes, values) {
  const doc = await PDFLib.PDFDocument.load(sourceBytes);
  doc.registerFontkit(fontkit);
  await replacePlaceLabel(doc);
  const font = await doc.embedFont(fontBytes, { subset: true });
  const form = doc.getForm();
  for (const field of form.getFields()) {
    if (!(field instanceof PDFLib.PDFTextField)) continue;
    const value = values[field.getName()] || '';
    if (field.getName() === 'Nazwisko') field.setMaxLength(16);
    if (value.includes('\n')) field.enableMultiline();
    field.setText(value);
    const rect = field.acroField.getWidgets()[0].getRectangle();
    const max = field.getMaxLength();
    let size = Math.min(12, rect.height * 0.56);
    if (field.isCombed() && max) {
      size = Math.min(size, (rect.width / max - 2) / 0.8);
    } else if (value) {
      const lines = value.split('\n');
      const widest = Math.max(...lines.map((line) => font.widthOfTextAtSize(line, 1)));
      if (widest) size = Math.min(size, (rect.width - 5) / widest);
      if (lines.length > 1) size = Math.min(size, (rect.height - 2) / (lines.length * font.heightAtSize(1) * 1.2));
    }
    field.setFontSize(Math.max(2, size));
    field.setAlignment(PDFLib.TextAlignment.Center);
    field.updateAppearances(font);
    form.markFieldAsClean(field.ref);
  }
  return doc.save({ updateFieldAppearances: false });
}

async function fillPrintPDF(sourceBytes, fontBytes, forms) {
  if (!Array.isArray(forms) || forms.length < 1 || forms.length > 4) throw new Error('Wybierz od 1 do 4 metryczek.');
  const output = await PDFLib.PDFDocument.create();
  const [width, height] = PDFLib.PageSizes.A4;
  for (let i = 0; i < forms.length; i++) {
    const filled = await fillOriginalPDF(sourceBytes, fontBytes, forms[i]);
    const source = await PDFLib.PDFDocument.load(filled);
    source.getForm().flatten({ updateFieldAppearances: false });
    const [embedded] = await output.embedPdf(await source.save(), [0]);
    const page = i % 2 === 0 ? output.addPage([width, height]) : output.getPage(output.getPageCount() - 1);
    const scale = Math.min(1, width / embedded.width, (height / 2) / embedded.height);
    const w = embedded.width * scale, h = embedded.height * scale;
    page.drawPage(embedded, { x: (width - w) / 2, y: (i % 2 === 0 ? height / 2 : 0) + (height / 2 - h) / 2, width: w, height: h });
  }
  return output.save();
}
