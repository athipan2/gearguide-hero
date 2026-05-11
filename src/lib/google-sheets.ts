
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export type SheetAction = 'insert' | 'update' | 'delete' | 'select' | 'upload';

export interface SheetRequest {
  action: SheetAction;
  table?: string;
  data?: unknown;
  id?: string | number;
  fileName?: string;
  mimeType?: string;
  base64Data?: string;
}

class GoogleSheetsClient {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async fetch<T>(params: Record<string, string>): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${this.url}?${queryString}`;
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        const text = await response.text();
        console.error("GAS Fetch Error Response:", text);
        throw new Error(`Google Sheets API Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        const text = await response.text();
        if (text.includes("TypeError") || text.includes("Error")) {
          throw new Error(`GAS Script Error: ${text.substring(0, 200)}...`);
        }
      }

      return response.json();
    } catch (err) {
      console.error("Google Sheets Fetch Failed:", err);
      throw err;
    }
  }

  /**
   * Robust POST that handles the redirect behavior of GAS
   */
  async postJson<T>(payload: SheetRequest): Promise<T> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("GAS Post Error Response:", text);
        throw new Error(`Google Sheets API Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        const text = await response.text();
        console.warn("GAS Post Non-JSON Response:", text.substring(0, 200));
        if (text.includes("TypeError") || text.includes("Error")) {
          throw new Error(`GAS Script Error (Post): ${text.substring(0, 200)}...`);
        }
      }

      return response.json();
    } catch (err) {
      console.error("Google Sheets Post Failed:", err);
      throw err;
    }
  }

  async select<T>(table: string, id?: string | number): Promise<T[]> {
    const params: Record<string, string> = { action: 'select', table };
    if (id) params.id = String(id);
    try {
      const result = await this.fetch<Record<string, unknown>>(params);
      if (result && result.error) {
        console.warn(`Google Sheets Table "${table}" issue: ${result.error}`);
        return [];
      }
      if (!result) return [];
      return Array.isArray(result) ? (result as T[]) : ([result] as unknown as T[]);
    } catch (err) {
      console.error(`Failed to select from ${table}:`, err);
      return [];
    }
  }

  async insert(table: string, data: unknown) {
    return this.postJson({ action: 'insert', table, data });
  }

  async update(table: string, id: string | number, data: unknown) {
    return this.postJson({ action: 'update', table, id, data });
  }

  async delete(table: string, id: string | number) {
    return this.postJson({ action: 'delete', table, id });
  }

  async upload(file: File): Promise<{ success: boolean, url: string, directLink: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        try {
          const result = await this.postJson<{ success: boolean, url: string, directLink: string }>({
            action: 'upload',
            fileName: file.name,
            mimeType: file.type,
            base64Data
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const sheetsClient = new GoogleSheetsClient(GOOGLE_SCRIPT_URL);
