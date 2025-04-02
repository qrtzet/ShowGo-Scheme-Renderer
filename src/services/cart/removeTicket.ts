import {rentalFetchAuthorized} from '@services/utils';
import {convertKeysToCamelCase} from '@utils/convertKeysToSnakeCase';

export const removeTicket = async (id: number) => {
  const response = await rentalFetchAuthorized('order/item', {
    method: 'DELETE',
    body: {
      id,
    },
  });

  const responseData = await response.json();

  return convertKeysToCamelCase(responseData);
};
