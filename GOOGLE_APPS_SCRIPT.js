/**
 * Google Apps Script Backend for GearTrail (Improved Version)
 *
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script. (This is the RECOMMENDED way)
 * 3. Delete any existing code and paste this code.
 * 4. Click "Save".
 * 5. Click "Deploy" > "New Deployment".
 * 6. Select "Web App".
 * 7. Set "Description" to "GearTrail API".
 * 8. Set "Execute as" to "Me".
 * 9. Set "Who has access" to "Anyone".
 * 10. Click "Deploy". You may need to "Authorize Access".
 * 11. Copy the "Web App URL" and update your VITE_GOOGLE_SCRIPT_URL in .env.
 */

// If you are using a standalone script (not bound to a sheet),
// you can manually put your Spreadsheet ID here:
const MANUAL_SPREADSHEET_ID = "1-QRegWSznISxU7a0_j_wXoRsw34902sUhnPHd1WqzVY";

function getSs() {
  if (MANUAL_SPREADSHEET_ID) {
    return SpreadsheetApp.openById(MANUAL_SPREADSHEET_ID);
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  throw new Error("Cannot find Spreadsheet. Please ensure this script is bound to a Google Sheet or set MANUAL_SPREADSHEET_ID in the script.");
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const table = e.parameter.table;
    const id = e.parameter.id;

    if (action === 'select') {
      return handleSelect(table, id);
    }

    return createResponse({ error: 'Invalid GET action: ' + action });
  } catch (err) {
    return createResponse({ error: err.toString(), stack: err.stack });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse({ error: 'No post data received' });
    }

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

    return createResponse({ error: 'Invalid POST action: ' + action });
  } catch (err) {
    return createResponse({ error: err.toString(), stack: err.stack });
  }
}

function ensureSheet(tableName) {
  const ss = getSs();
  let sheet = ss.getSheetByName(tableName);
  if (!sheet) {
    sheet = ss.insertSheet(tableName);
    // Initialize headers based on table type
    let headers = ['id', 'created_at'];
    if (tableName === 'reviews') {
      headers = ['id', 'name', 'name_en', 'brand', 'brand_en', 'category', 'category_en', 'price', 'slug', 'image_url', 'badge', 'badge_en', 'overall_rating', 'affiliate_url', 'cta_text', 'cta_text_en', 'shopee_url', 'lazada_url', 'intro', 'intro_en', 'verdict', 'verdict_en', 'published', 'test_conditions', 'test_conditions_en', 'ratings', 'specs', 'pros', 'pros_en', 'cons', 'cons_en', 'sections', 'images', 'created_at', 'created_by'];
    } else if (tableName === 'articles') {
      headers = ['id', 'title', 'title_en', 'slug', 'content', 'content_en', 'image_url', 'published', 'created_at'];
    } else if (tableName === 'comments') {
      headers = ['id', 'content', 'user_id', 'user_name', 'rating', 'review_id', 'article_id', 'created_at'];
    } else if (tableName === 'media_library') {
      headers = ['id', 'file_name', 'file_path', 'file_size', 'mime_type', 'uploaded_by', 'created_at'];
    }
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function handleSelect(tableName, id) {
  const sheet = ensureSheet(tableName);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return createResponse([]);

  const headers = data[0];
  const rows = data.slice(1);

  const result = rows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      let value = row[i];
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          value = JSON.parse(value);
        } catch (e) {}
      }
      // Convert "TRUE"/"FALSE" strings to booleans
      if (value === "TRUE") value = true;
      if (value === "FALSE") value = false;
      obj[header] = value;
    });
    return obj;
  });

  if (id) {
    const single = result.find(item => String(item.id) === String(id));
    return createResponse(single ? [single] : []);
  }

  return createResponse(result);
}

function handleInsert(tableName, data) {
  const sheet = ensureSheet(tableName);
  const headers = sheet.getDataRange().getValues()[0];

  const newRow = headers.map(header => {
    let val = data[header];
    if (val === undefined || val === null) return "";
    if (typeof val === 'object') {
      val = JSON.stringify(val);
    }
    return val;
  });

  sheet.appendRow(newRow);
  return createResponse({ success: true });
}

function handleUpdate(tableName, id, data) {
  const sheet = ensureSheet(tableName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');

  if (idIndex === -1) return createResponse({ error: 'No id column found' });

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      const rowNum = i + 1;
      headers.forEach((header, j) => {
        if (data[header] !== undefined) {
          let val = data[header];
          if (val === null) val = "";
          else if (typeof val === 'object') {
            val = JSON.stringify(val);
          }
          sheet.getRange(rowNum, j + 1).setValue(val);
        }
      });
      return createResponse({ success: true });
    }
  }

  return createResponse({ error: 'Item not found with ID: ' + id });
}

function handleDelete(tableName, id) {
  const sheet = ensureSheet(tableName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');

  if (idIndex === -1) return createResponse({ error: 'No id column found' });

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1);
      return createResponse({ success: true });
    }
  }

  return createResponse({ error: 'Item not found for deletion' });
}

function handleUpload(fileName, mimeType, base64Data) {
  try {
    const bytes = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(bytes, mimeType, fileName);

    let folder;
    const folderName = "GearTrail Uploads";
    const folders = DriveApp.getFoldersByName(folderName);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    const directLink = "https://lh3.googleusercontent.com/d/" + fileId;

    return createResponse({
      success: true,
      url: file.getUrl(),
      directLink: directLink,
      id: fileId
    });
  } catch (err) {
    return createResponse({ error: "Upload error: " + err.toString() });
  }
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
