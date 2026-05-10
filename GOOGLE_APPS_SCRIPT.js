/**
 * Google Apps Script Backend for GearTrail
 *
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Create sheets (tabs) named: reviews, articles, comments, media_library.
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this code and Save.
 * 5. Click "Deploy" > "New Deployment".
 * 6. Select "Web App".
 * 7. Set "Execute as" to "Me".
 * 8. Set "Who has access" to "Anyone".
 * 9. Deploy and copy the Web App URL.
 * 10. Set VITE_GOOGLE_SCRIPT_URL in your .env file to this URL.
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  const table = e.parameter.table;
  const id = e.parameter.id;

  if (action === 'select') {
    return handleSelect(table, id);
  }

  return createResponse({ error: 'Invalid action' });
}

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;

    if (action === 'insert') {
      return handleInsert(requestData.table, requestData.data);
    } else if (action === 'update') {
      return handleUpdate(requestData.table, requestData.id, requestData.data);
    } else if (action === 'delete') {
      return handleDelete(requestData.table, requestData.id);
    } else if (action === 'upload') {
      return handleUpload(requestData.fileName, requestData.mimeType, requestData.base64Data);
    }

    return createResponse({ error: 'Invalid action' });
  } catch (err) {
    return createResponse({ error: err.toString() });
  }
}

function handleSelect(tableName, id) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tableName);
  if (!sheet) return createResponse({ error: 'Sheet not found: ' + tableName });

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return createResponse([]); // Only header or empty

  const headers = data[0];
  const rows = data.slice(1);

  const result = rows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      let value = row[i];
      // Try to parse JSON strings
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }
      obj[header] = value;
    });
    return obj;
  });

  if (id) {
    const single = result.find(item => item.id == id);
    return createResponse(single ? [single] : []);
  }

  return createResponse(result);
}

function handleInsert(tableName, data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tableName);
  if (!sheet) return createResponse({ error: 'Sheet not found' });

  const headers = sheet.getDataRange().getValues()[0];
  const newRow = headers.map(header => {
    let val = data[header] === undefined ? "" : data[header];
    if (typeof val === 'object' && val !== null) {
      val = JSON.stringify(val);
    }
    return val;
  });

  sheet.appendRow(newRow);
  return createResponse({ success: true });
}

function handleUpdate(tableName, id, data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tableName);
  if (!sheet) return createResponse({ error: 'Sheet not found' });

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');

  if (idIndex === -1) return createResponse({ error: 'No id column found' });

  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] == id) {
      const rowNum = i + 1;
      headers.forEach((header, j) => {
        if (data[header] !== undefined) {
          let val = data[header];
          if (typeof val === 'object' && val !== null) {
            val = JSON.stringify(val);
          }
          sheet.getRange(rowNum, j + 1).setValue(val);
        }
      });
      return createResponse({ success: true });
    }
  }

  return createResponse({ error: 'Item not found' });
}

function handleDelete(tableName, id) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tableName);
  if (!sheet) return createResponse({ error: 'Sheet not found' });

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');

  if (idIndex === -1) return createResponse({ error: 'No id column found' });

  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] == id) {
      sheet.deleteRow(i + 1);
      return createResponse({ success: true });
    }
  }

  return createResponse({ error: 'Item not found' });
}

function handleUpload(fileName, mimeType, base64Data) {
  try {
    const bytes = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(bytes, mimeType, fileName);

    // Save to a folder named "GearTrail Uploads"
    let folder;
    const folders = DriveApp.getFoldersByName("GearTrail Uploads");
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder("GearTrail Uploads");
    }

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    // Direct link format for many use cases
    const directLink = "https://lh3.googleusercontent.com/d/" + fileId;

    return createResponse({
      success: true,
      url: file.getUrl(),
      directLink: directLink,
      id: fileId
    });
  } catch (err) {
    return createResponse({ error: err.toString() });
  }
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
