async function fillOriginalPDF(sourceBytes,fontBytes,values){
 const doc=await PDFLib.PDFDocument.load(sourceBytes);doc.registerFontkit(fontkit);
 const font=await doc.embedFont(fontBytes,{subset:true});const form=doc.getForm();
 for(const field of form.getFields()){
  if(!(field instanceof PDFLib.PDFTextField))continue;
  const value=values[field.getName()]||'';if(field.getName()==='Nazwisko')field.setMaxLength(16);field.setText(value);
  const rect=field.acroField.getWidgets()[0].getRectangle();
  const max=field.getMaxLength();
  let size=Math.min(12,rect.height*.56);
  if(field.isCombed()&&max){size=Math.min(size,(rect.width/max-2)/.8)}
  else if(value){const measured=font.widthOfTextAtSize(value,1);size=Math.min(size,(rect.width-5)/measured)}
  field.setFontSize(Math.max(2,size));field.setAlignment(PDFLib.TextAlignment.Center);
  field.updateAppearances(font);form.markFieldAsClean(field.ref);
 }
 return doc.save({updateFieldAppearances:false});
}
if(typeof module!=='undefined')module.exports={fillOriginalPDF};

async function fillBatchPDF(sourceBytes,fontBytes,forms){
 if(!Array.isArray(forms)||forms.length<1||forms.length>4)throw new Error('Wybierz od 1 do 4 metryczek.');
 if(forms.length===1)return fillOriginalPDF(sourceBytes,fontBytes,forms[0]);
 const merged=await PDFLib.PDFDocument.create();
 const fieldRefs=[];
 for(let index=0;index<forms.length;index++){
  const filled=await fillOriginalPDF(sourceBytes,fontBytes,forms[index]);
  const source=await PDFLib.PDFDocument.load(filled);
  // Each original field is a terminal widget. Prefix names to keep pages independent.
  for(const field of source.getForm().getFields())field.acroField.setPartialName(`Metryczka${index+1}_${field.getName()}`);
  const [page]=await merged.copyPages(source,[0]);merged.addPage(page);
  const annotations=page.node.Annots();
  if(annotations)for(const ref of annotations.asArray()){
   const widget=merged.context.lookup(ref);
   if(widget.get(PDFLib.PDFName.of('FT'))){
    widget.set(PDFLib.PDFName.of('P'),page.ref);
    fieldRefs.push(ref);
   }
  }
 }
 merged.catalog.set(PDFLib.PDFName.of('AcroForm'),merged.context.obj({Fields:fieldRefs}));
 return merged.save({updateFieldAppearances:false});
}
if(typeof module!=='undefined')module.exports.fillBatchPDF=fillBatchPDF;
