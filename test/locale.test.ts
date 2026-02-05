import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import en from '../locales/en-US.json';

type NestedObject = { [key: string]: string | NestedObject };

function getKeys(obj: NestedObject, path = '', result: string[] = []) {
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object') {
      getKeys(value, path ? `${path}.${key}` : key, result);
    } else {
      result.push(path ? `${path}.${key}` : key);
    }
  }
  return result;
}

const localesOtherThanEnglish = readdirSync(resolve(__dirname, '../locales')).filter((file) => {
  return file.endsWith('.json') && !file.startsWith('en-US');
});
const defaultKeys = getKeys(en);

describe('locale files should include all keys', () => {
  localesOtherThanEnglish.forEach((locale) => {
    it(`for ${locale}`, async () => {
      const localeData = (await import(`../locales/${locale}`)) as { default: NestedObject };
      expect(getKeys(localeData.default)).toEqual(defaultKeys);
    });
  });
});
