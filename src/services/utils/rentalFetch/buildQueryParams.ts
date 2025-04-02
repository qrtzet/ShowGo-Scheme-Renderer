import {convertKeysToSnakeCase} from '@utils/convertKeysToCamelCase';
import queryString from 'query-string';

import {Data} from './rentalFetch.types';

export const buildQueryParams = ({queryParams}: Data) => {
  const convertedParams = convertKeysToSnakeCase(queryParams || {}, [
    '_with_data',
  ]);

  return queryParams
    ? `?${queryString.stringify(convertedParams, {
        arrayFormat: 'bracket',
      })}`
    : '';
};
