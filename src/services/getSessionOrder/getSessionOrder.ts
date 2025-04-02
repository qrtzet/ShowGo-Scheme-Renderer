import {Session} from '@atoms/session';
import {rentalFetchUnauthorized} from '@services/utils';
import {convertKeysToCamelCase} from '@utils/convertKeysToSnakeCase';

export type GetSessionOrderReqParams = {
  slug: string;
};

export type GetSessionOrderResType = {
  payload: Session;
};

export const getSessionOrder = async ({
  slug,
}: GetSessionOrderReqParams): Promise<GetSessionOrderResType> => {
  const response = await rentalFetchUnauthorized('session/order', {
    method: 'GET',
    queryParams: {slug},
  });

  const responseData = await response.json();

  return convertKeysToCamelCase(responseData);
};
