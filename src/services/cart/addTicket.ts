import {
  AddTicketToCartData,
  AddTicketToCartTicketType,
  TicketInCartRes,
} from '@atoms/cart';
import {rentalFetchAuthorized} from '@services/utils';
import {convertKeysToCamelCase} from '@utils/convertKeysToSnakeCase';

export const ticketBodyType: Record<AddTicketToCartTicketType, string> = {
  entry: 'ticket_type_id',
  seat: 'ticket_seat_id',
  area: 'ticket_area_id',
};

export type AddTicketResType = {
  payload: TicketInCartRes;
};

export const addTicket = async ({
  eventId,
  sessionId,
  ticket,
}: AddTicketToCartData): Promise<AddTicketResType> => {
  const body = {
    event_id: eventId,
    session_id: sessionId,
    [ticketBodyType[ticket.type]]: ticket.id,
  };

  const response = await rentalFetchAuthorized('order/item', {
    method: 'POST',
    body,
  });

  const responseData = await response.json();

  return convertKeysToCamelCase(responseData);
};
