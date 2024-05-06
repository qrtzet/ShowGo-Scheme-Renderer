import {OrderItem} from '@atoms/session';
import {rentalFetchAuthorized} from '@services/utils';
import {convertKeysToCamelCase} from '@utils/convertKeysToSnakeCase';

export type GetSessionOrderItemsReqParams = {
  id: number;
  slug: string;
};

export type GetSessionOrderItemResType = {
  payload: {
    orderItems: OrderItem[];
  };
};

export const getSessionOrderItems = async ({
  id,
  slug,
}: GetSessionOrderItemsReqParams): Promise<GetSessionOrderItemResType> => {
  const response = await rentalFetchAuthorized('session/order/item', {
    method: 'GET',
    queryParams: {
      id,
      slug,
    },
  });

  const responseData = await response.json();

  return convertKeysToCamelCase(responseData);
};
