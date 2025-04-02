import {convertKeysToSnakeCase} from '@utils/convertKeysToCamelCase';
import {Data} from './rentalFetch.types';

export const buildBody = ({body}: Data) => {
  if (body) {
    return body instanceof FormData
      ? body
      : JSON.stringify(convertKeysToSnakeCase(body));
  }
};
