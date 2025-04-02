import {isSchemeLoadingAtom} from '@atoms/scheme/setSchemeColors.atoms';
import {atom} from 'jotai';

import {
  addTicketToCartAtom,
  AddTicketToCartTicketType,
  removeTicketFromCartAtom,
  ticketsInCartAtom,
} from '@atoms/cart';
import {
  Area,
  SeatScheme,
  sessionAtom,
  sessionOrderAtom,
  sessionOrderSchemesAtom,
} from '@atoms/session';

export const schemePressHandlerAtom = atom(
  null,
  async (get, set, element: Element) => {
    try {
      set(isSchemeLoadingAtom, true);
      const sessionOrder = await get(sessionOrderAtom);
      const session = await get(sessionAtom);
      const orderSchemes = await get(sessionOrderSchemesAtom);
      const ticketsInCart = get(ticketsInCartAtom);

      if (!sessionOrder) {
        return;
      }

      const setTicket = async (
        type: AddTicketToCartTicketType,
        seat: SeatScheme | Area,
      ) => {
        const isAlreadyExist = ticketsInCart.find(
          ({ticket}) => ticket.id === seat.id,
        );

        if (isAlreadyExist?.id && type === 'seat') {
          await set(removeTicketFromCartAtom, seat.id);
          return;
        }

        await set(addTicketToCartAtom, {
          ticket: {
            type,
            id: seat.id,
          },
          isFree: session?.event?.isFree,
          eventId: sessionOrder.event?.id!,
          sessionId: sessionOrder.id,
        });
      };

      if (element?.id?.startsWith('seat_')) {
        const seat = orderSchemes.seats.get(element?.id);

        if (seat) {
          await setTicket('seat', seat);
        }
      }

      if (element?.id?.startsWith('area_')) {
        const area = orderSchemes.areas.get(element?.id);

        if (area) {
          await setTicket('area', area);
        }
      }
    } catch (e) {
    } finally {
      set(isSchemeLoadingAtom, false);
    }
  },
);
