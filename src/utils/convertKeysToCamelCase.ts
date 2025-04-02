import * as changeCase from 'change-case';

type AnyObject = Record<string, any>;

export function convertKeysToSnakeCase(
  obj: AnyObject,
  ignore: string[] = [],
): AnyObject {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToSnakeCase(item, ignore));
  }

  const snakeCaseObj: any = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const snakeKey = ignore.includes(key) ? key : changeCase.snakeCase(key);

      if (typeof obj[key] === 'object') {
        snakeCaseObj[snakeKey] = convertKeysToSnakeCase(obj[key], ignore);
      } else {
        snakeCaseObj[snakeKey] = obj[key];
      }
    }
  }
  return snakeCaseObj;
}
