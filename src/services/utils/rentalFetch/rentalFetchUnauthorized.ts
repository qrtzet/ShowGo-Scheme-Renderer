import {rentalFetch} from './rentalFetch';
import {Data} from './rentalFetch.types';
import {withLogger} from './withLogger';

export const rentalFetchUnauthorized = async (
  path: string,
  data: Data,
  withVersion?: boolean,
) => {
  return await withLogger(rentalFetch, path, data, withVersion);
};
