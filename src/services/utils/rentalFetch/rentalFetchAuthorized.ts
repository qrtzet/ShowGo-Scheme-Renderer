import {User} from '@atoms/auth';

import {rentalFetch} from './rentalFetch';
import {Data} from './rentalFetch.types';
import {withLogger} from './withLogger';

export const rentalFetchAuthorized = async (
  path: string,
  data: Omit<Data, 'accessToken'>,
) => {
  const user = JSON.parse(
    localStorage.getItem('user') || 'null',
  ) as User | null;

  const tempUuid = JSON.parse(localStorage.getItem('tempUuid') || 'null');

  const accessToken = user?.token;

  const body = accessToken
    ? {...data, accessToken}
    : data.method === 'GET'
      ? {queryParams: {...data?.queryParams, userUuid: tempUuid}}
      : {body: {...data?.body, userUuid: tempUuid}};

  return await withLogger(rentalFetch, path, {
    ...{...data, accessToken},
    ...body,
  });
};
