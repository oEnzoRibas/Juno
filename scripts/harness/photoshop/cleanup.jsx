/* Attempt every restoration even when Photoshop rejects a previous operation. */
function junoRestoreProof(doc, app, original, oldUnits, oldDialogs, failure) {
  var errors = [];
  try {
    if (doc) doc.close(SaveOptions.DONOTSAVECHANGES);
  } catch (error) {
    errors.push('close proof: ' + error);
  }
  try {
    app.preferences.rulerUnits = oldUnits;
  } catch (error) {
    errors.push('ruler units: ' + error);
  }
  try {
    app.displayDialogs = oldDialogs;
  } catch (error) {
    errors.push('dialog preferences: ' + error);
  }
  try {
    if (original) app.activeDocument = original;
  } catch (error) {
    errors.push('active document: ' + error);
  }
  if (errors.length) {
    throw Error((failure ? 'Proof failed: ' + failure + '. ' : '') + 'Cleanup failed: ' + errors.join('; '));
  }
}
