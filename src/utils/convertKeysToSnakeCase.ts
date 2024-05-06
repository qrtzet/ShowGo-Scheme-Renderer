import * as changeCase from 'change-case';

export function convertKeysToCamelCase<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    // eslint-disable-next-line
    return obj.map(item => convertKeysToCamelCase(item)) as any;
  }

  return Object.keys(obj).reduce((result, key) => {
    const camelCaseKey = key.startsWith('#') ? key : changeCase.camelCase(key);
    const value = obj[key as keyof typeof obj] as string;

    if (typeof value === 'object') {
      result[camelCaseKey as keyof typeof obj] = convertKeysToCamelCase(value);
    } else {
      result[camelCaseKey as keyof typeof obj] = value as T[keyof T];
    }

    return result;
  }, {} as T);
}
