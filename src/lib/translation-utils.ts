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
export function translateData<T extends Record<string, unknown>>(data: T, field: string, lang: Language): string {
  if (!data) return '';

  // @ts-expect-error - dynamic field access
  const thRaw = data[field];
  const thVal = typeof thRaw === 'string' ? thRaw : '';

  const enField = `${field}_en`;
  // @ts-expect-error - dynamic field access
  const enRaw = data[enField];
  const enVal = typeof enRaw === 'string' ? enRaw : '';

  // Explicit priority logic
  if (lang === 'en') {
    if (enVal && enVal.trim().length > 0) return enVal;
    return thVal;
  }

  if (thVal && thVal.trim().length > 0) return thVal;
  return enVal;
}

/**
 * Translates an array of strings (like pros/cons).
 * Improved with mutual fallback: if the requested language version is empty,
 * it tries the other one.
 */
export function translateArray(data: Record<string, unknown>, field: string, lang: Language): string[] {
  if (!data) return [];

  // @ts-expect-error - dynamic field access
  const thVal = data[field];
  const enField = `${field}_en`;
  // @ts-expect-error - dynamic field access
  const enVal = data[enField];

  const thArray = Array.isArray(thVal) ? (thVal as unknown[]).map(item => String(item)).filter(s => s && s !== 'null' && s.trim()) : [];
  const enArray = Array.isArray(enVal) ? (enVal as unknown[]).map(item => String(item)).filter(s => s && s !== 'null' && s.trim()) : [];

  // Explicit priority logic
  if (lang === 'en') {
    if (enArray.length > 0) return enArray;
    return thArray;
  }

  if (thArray.length > 0) return thArray;
  return enArray;
}

/**
 * Helper specifically for spec labels in comparison
 */
export function translateSpecLabel(label: string, lang: Language): string {
  return translateTerm(label, lang);
}

/**
 * Translates a full SpecItem based on current language with fallbacks
 */
export function translateSpec(spec: SpecItem, lang: Language): SpecItem {
  if (!spec) return spec;

  const label = lang === 'en'
    ? (spec.label_en || translateTerm(spec.label, 'en'))
    : (spec.label || spec.label_en || '');

  const value = lang === 'en'
    ? (spec.value_en || translateTerm(spec.value, 'en'))
    : (spec.value || spec.value_en || '');

  return {
    ...spec,
    label,
    value
  };
}
