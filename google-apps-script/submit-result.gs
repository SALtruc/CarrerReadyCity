const SHEET_NAME = 'Results';
const COLUMNS = [
  'submittedAt', 'sid', 'year', 'program', 'accessCode', 'avatar', 'placesVisited',
  'hollandCode', 'scoreRealistic', 'scoreInvestigative', 'scoreArtistic',
  'scoreSocial', 'scoreEnterprising', 'scoreConventional'
];

function doPost(e) {
  let payload;

  try {
    payload = JSON.parse(e.postData.contents);
  } catch (error) {
    return respond({ ok: false, error: 'invalid_json' });
  }

  const expectedSecret = PropertiesService.getScriptProperties().getProperty('INGEST_SECRET');

  if (!expectedSecret || payload.secret !== expectedSecret) {
    return respond({ ok: false, error: 'unauthorized' });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    return respond({ ok: false, error: 'missing_sheet' });
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
  }

  const row = COLUMNS.map((column) => (column in payload ? payload[column] : ''));
  sheet.appendRow(row);

  return respond({ ok: true });
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
