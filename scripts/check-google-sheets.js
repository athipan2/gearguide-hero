
import fs from 'fs';
import path from 'path';

/**
 * Diagnostic script to verify Google Sheets and Google Drive integration.
 * Reads configuration from .env file.
 */

async function runDiagnostics() {
  console.log("=== GearTrail Google Sheets Diagnostic Tool ===\n");

  // 1. Read .env
  let googleScriptUrl = "";
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/VITE_GOOGLE_SCRIPT_URL=["']?([^"'\n]+)["']?/);
      if (match) {
        googleScriptUrl = match[1];
        console.log(`[CONFIG] Found URL in .env: ${googleScriptUrl.substring(0, 40)}...`);
      }
    }
  } catch (err) {
    console.warn("[CONFIG] Could not read .env file. Falling back to default if provided.");
  }

  if (!googleScriptUrl) {
    console.error("[ERROR] No VITE_GOOGLE_SCRIPT_URL found in .env. Please configure it first.");
    process.exit(1);
  }

  // 2. Test SELECT (Read)
  console.log("\n--- Step 1: Testing Data Retrieval (SELECT) ---");
  try {
    const selectUrl = `${googleScriptUrl}?action=select&table=reviews`;
    const response = await fetch(selectUrl);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (data.error) {
        console.error(`[GAS ERROR] ${data.error}`);
      } else {
        console.log(`[SUCCESS] Retrieved ${Array.isArray(data) ? data.length : 'unknown'} items from 'reviews' table.`);
        if (Array.isArray(data) && data.length > 0) {
            console.log(`[INFO] Fields available: ${Object.keys(data[0]).join(', ')}`);
        }
      }
    } catch (e) {
      console.error("[PARSE ERROR] Response was not valid JSON. This usually means a Google Script error or permission issue.");
      console.log(`[DEBUG] Response starts with: ${text.substring(0, 200)}`);
    }
  } catch (err) {
    console.error(`[CONNECTION ERROR] ${err.message}`);
  }

  // 3. Test INSERT (Write)
  console.log("\n--- Step 2: Testing Data Insertion (INSERT) ---");
  try {
    const payload = {
      action: 'insert',
      table: 'comments',
      data: {
        id: `diag-${Date.now()}`,
        content: "Diagnostic connection test",
        user_name: "Diagnostic Bot",
        created_at: new Date().toISOString()
      }
    };

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (result.success) {
      console.log("[SUCCESS] Successfully inserted test record into 'comments' table.");
    } else {
      console.error(`[GAS ERROR] ${result.error}`);
    }
  } catch (err) {
    console.error(`[INSERT ERROR] ${err.message}`);
  }

  // 4. Test UPLOAD (Drive)
  console.log("\n--- Step 3: Testing File Upload (DRIVE) ---");
  try {
    // 1x1 transparent PNG
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const payload = {
      action: 'upload',
      fileName: 'diagnostic-test.png',
      mimeType: 'image/png',
      base64Data: base64Data
    };

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });

    const result = await response.json();
    if (result.success) {
      console.log("[SUCCESS] Image upload verified.");
      console.log(`[INFO] Direct Link: ${result.directLink}`);
    } else {
      console.error(`[GAS ERROR] ${result.error}`);
      if (result.error && result.error.includes("permission")) {
        console.log("[ADVICE] Ensure you have authorized 'DriveApp' in your Google Apps Script editor.");
      }
    }
  } catch (err) {
    console.error(`[UPLOAD ERROR] ${err.message}`);
  }

  console.log("\n=== Diagnostics Complete ===");
}

runDiagnostics();
