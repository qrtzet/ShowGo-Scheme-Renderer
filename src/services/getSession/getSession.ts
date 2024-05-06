import {Session} from '@atoms/session';
import {rentalFetchUnauthorized} from '@services/utils';
import {convertKeysToCamelCase} from '@utils/convertKeysToSnakeCase';

export type GetSessionReqParams = {
  slug: string;
};

export type GetSessionResType = {
  payload: Session;
};

export const getSession = async ({
  slug,
}: GetSessionReqParams): Promise<GetSessionResType> => {
  const response = await rentalFetchUnauthorized('session', {
    method: 'GET',
    queryParams: {slug},
  });

  const responseData = await response.json();

  return convertKeysToCamelCase(responseData);
};
