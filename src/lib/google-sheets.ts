
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiak7La2xa0XAculLujpk1bIL8mc06cPCosrDmwR8u7lBjMeLgkT06ujGt_0TKUXZ7/exec';

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
    try {
      const response = await fetch(`${this.url}?${queryString}`);
      if (!response.ok) {
        throw new Error(`Google Sheets API Error: ${response.statusText}`);
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
    const response = await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });
    if (!response.ok) {
       throw new Error(`Google Sheets API Error: ${response.statusText}`);
    }
    return response.json();
  }

  async select<T>(table: string, id?: string | number): Promise<T[]> {
    const params: Record<string, string> = { action: 'select', table };
    if (id) params.id = String(id);
    const result = await this.fetch<Record<string, unknown>>(params);
    if (result.error) throw new Error(String(result.error));
    return Array.isArray(result) ? (result as T[]) : ([result] as unknown as T[]);
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
