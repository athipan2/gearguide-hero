import { Language } from './language-store';

// Dictionary of Thai technical terms to English
export const technicalTerms: Record<string, string> = {
  // Specs
  'น้ำหนัก': 'Weight',
  'ดรอป': 'Drop',
  'หน้าเท้า': 'Width',
  'ประเภทเท้า': 'Arch Type',
  'ระยะการใช้งาน': 'Distance',
  'การรับแรงกระแทก': 'Cushioning',
  'ความสูงส้น': 'Stack Height',
  'พื้นผิว': 'Surface',
  'เส้นทาง': 'Terrain',

  // Values
  'ถนน': 'Road',
  'เทรล': 'Trail',
  'แข่งขัน': 'Race',
  'ซ้อม': 'Daily Trainer',
  'นุ่ม': 'Soft',
  'แน่น': 'Firm',
  'เด้ง': 'Responsive',
  'กว้าง': 'Wide',
  'ปกติ': 'Normal',
  'แคบ': 'Narrow',
  'สูง': 'High',
  'ต่ำ': 'Low',
  'กลาง': 'Medium',

  // Test Conditions
  'สภาพอากาศ': 'Weather',
  'แดดออก': 'Sunny',
  'ฝนตก': 'Rainy',
  'ร้อน': 'Hot',
  'หนาว': 'Cold',
  'ชื้น': 'Humid',
};

/**
 * Translates a Thai technical term to English if the language is set to 'en'
 */
export function translateTerm(term: string, lang: Language): string {
  if (lang === 'th') return term;

  // Try to find exact match
  if (technicalTerms[term]) return technicalTerms[term];

  // Try case-insensitive or partial match for common variations
  const lowerTerm = term.toLowerCase();
  for (const [key, value] of Object.entries(technicalTerms)) {
    if (key.toLowerCase() === lowerTerm) return value;
  }

  return term;
}

/**
 * Maps database fields to English if they exist, or falls back to Thai.
 * Improved with mutual fallback: if the requested language version is empty,
 * it tries the other one.
 */
export function translateData<T extends Record<string, any>>(data: T, field: string, lang: Language): string {
  const thVal = typeof data[field] === 'string' ? data[field] : '';
  const enField = `${field}_en`;
  const enVal = typeof data[enField] === 'string' ? data[enField] : '';

  if (lang === 'en') {
    return enVal.trim() ? enVal : thVal;
  }
  return thVal.trim() ? thVal : enVal;
}

/**
 * Translates an array of strings (like pros/cons).
 * Improved with mutual fallback: if the requested language version is empty,
 * it tries the other one.
 */
export function translateArray(data: Record<string, any>, field: string, lang: Language): string[] {
  const thVal = data[field];
  const enField = `${field}_en`;
  const enVal = data[enField];

  const thArray = Array.isArray(thVal) ? (thVal as string[]).filter(Boolean) : [];
  const enArray = Array.isArray(enVal) ? (enVal as string[]).filter(Boolean) : [];

  if (lang === 'en') {
    return enArray.length > 0 ? enArray : thArray;
  }
  return thArray.length > 0 ? thArray : enArray;
}

/**
 * Helper specifically for spec labels in comparison
 */
export function translateSpecLabel(label: string, lang: Language): string {
  return translateTerm(label, lang);
}
