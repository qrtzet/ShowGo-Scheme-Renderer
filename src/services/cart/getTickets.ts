import {TicketInCartRes} from '@atoms/cart';
import {rentalFetchAuthorized} from '@services/utils';
import {convertKeysToCamelCase} from '@utils/convertKeysToSnakeCase';

export type GetTicketsResType = {
  basket: TicketInCartRes[];
  timer: number;
};

export const getTickets = async (): Promise<GetTicketsResType> => {
  const response = await rentalFetchAuthorized('basket', {
    method: 'GET',
  });

  const responseData = await response.json();

  return convertKeysToCamelCase(responseData)?.payload;
};
